import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Prisma } from "@prisma/client";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { hashSecret, verifySecret } from "./utils/password.util";

type AuthPrismaUser = Prisma.UserGetPayload<{
  include: {
    organization: {
      select: {
        id: true;
        name: true;
        slug: true;
        isActive: true;
      };
    };
    userRoles: {
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
  };
}>;

type JwtTokenPayload = {
  sub: string;
  organizationId: string;
  email: string;
  tokenType: "access" | "refresh";
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(payload: LoginDto) {
    const user = await this.findUserByEmail(payload.email);

    if (!user?.passwordHash) {
      throw new UnauthorizedException("Identifiants invalides");
    }

    this.assertUserIsActive(user);

    const passwordIsValid = await verifySecret(
      payload.password,
      user.passwordHash,
    );
    if (!passwordIsValid) {
      throw new UnauthorizedException("Identifiants invalides");
    }

    return this.issueTokens(user, true);
  }

  async refresh(payload: RefreshTokenDto) {
    let tokenPayload: JwtTokenPayload;

    try {
      tokenPayload = await this.jwtService.verifyAsync<JwtTokenPayload>(
        payload.refreshToken,
        {
          secret: this.getRefreshTokenSecret(),
        },
      );
    } catch {
      throw new UnauthorizedException("Refresh token invalide ou expiré");
    }

    if (tokenPayload.tokenType !== "refresh" || !tokenPayload.sub) {
      throw new UnauthorizedException("Refresh token invalide");
    }

    const user = await this.findUserById(tokenPayload.sub);
    this.assertUserIsActive(user);

    if (!user.refreshTokenHash || !user.refreshTokenExpiresAt) {
      throw new UnauthorizedException("Aucune session active trouvée");
    }

    if (user.refreshTokenExpiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException("La session a expiré");
    }

    const refreshTokenMatches = await verifySecret(
      payload.refreshToken,
      user.refreshTokenHash,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException("Refresh token invalide");
    }

    return this.issueTokens(user, false);
  }

  async logout(currentUser: AuthUser) {
    await this.prisma.user.updateMany({
      where: { id: currentUser.userId },
      data: {
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    });

    return { success: true };
  }

  async me(currentUser: AuthUser) {
    const user = await this.findUserById(currentUser.userId);
    this.assertUserIsActive(user);

    return {
      user: this.serializeUser(user),
    };
  }

  private async issueTokens(user: AuthPrismaUser, updateLastLoginAt: boolean) {
    const accessTokenPayload: JwtTokenPayload = {
      sub: user.id,
      organizationId: user.organizationId,
      email: user.email,
      tokenType: "access",
    };

    const refreshTokenPayload: JwtTokenPayload = {
      sub: user.id,
      organizationId: user.organizationId,
      email: user.email,
      tokenType: "refresh",
    };

    const accessTokenExpiresIn = this.getAccessTokenTtl();
    const refreshTokenExpiresIn = this.getRefreshTokenTtl();
    const refreshTokenExpiresAt = this.resolveExpiryDate(refreshTokenExpiresIn);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: this.getAccessTokenSecret(),
        expiresIn: accessTokenExpiresIn as any,
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.getRefreshTokenSecret(),
        expiresIn: refreshTokenExpiresIn as any,
      }),
    ]);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: await hashSecret(refreshToken),
        refreshTokenExpiresAt,
        ...(updateLastLoginAt ? { lastLoginAt: new Date() } : {}),
      },
    });

    return {
      tokenType: "Bearer",
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
      refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString(),
      user: this.serializeUser(user),
    };
  }

  private serializeUser(user: AuthPrismaUser) {
    const roles = user.userRoles.map(({ role }) => role.code);
    const permissions = Array.from(
      new Set(
        user.userRoles.flatMap(({ role }) =>
          role.rolePermissions.map(({ permission }) => permission.code),
        ),
      ),
    );

    return {
      id: user.id,
      organizationId: user.organizationId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
      organization: user.organization,
      roles,
      permissions,
    };
  }

  private toAuthUser(user: AuthPrismaUser): AuthUser {
    const serialized = this.serializeUser(user);

    return {
      userId: serialized.id,
      organizationId: serialized.organizationId,
      email: serialized.email,
      roles: serialized.roles,
      permissions: serialized.permissions,
    };
  }

  private async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          },
        },
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  private async findUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          },
        },
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException("Utilisateur introuvable");
    }

    return user;
  }

  private assertUserIsActive(user: AuthPrismaUser) {
    if (user.status !== "active") {
      throw new UnauthorizedException("Le compte utilisateur est inactif");
    }

    if (!user.organization?.isActive) {
      throw new UnauthorizedException("L'organisation est inactive");
    }
  }

  private getAccessTokenSecret() {
    return this.configService.get<string>("JWT_SECRET") || "change-me";
  }

  private getRefreshTokenSecret() {
    return (
      this.configService.get<string>("REFRESH_TOKEN_SECRET") ||
      this.getAccessTokenSecret()
    );
  }

  private getAccessTokenTtl() {
    return this.configService.get<string>("ACCESS_TOKEN_TTL") || "15m";
  }

  private getRefreshTokenTtl() {
    return this.configService.get<string>("REFRESH_TOKEN_TTL") || "30d";
  }

  private resolveExpiryDate(expiresIn: string | number) {
    if (typeof expiresIn === "number") {
      return new Date(Date.now() + expiresIn * 1000);
    }

    const normalized = expiresIn.trim().toLowerCase();
    const numeric = Number(normalized);
    if (!Number.isNaN(numeric)) {
      return new Date(Date.now() + numeric * 1000);
    }

    const match = normalized.match(/^(\d+)([smhd])$/);
    if (!match) {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    const value = Number(match[1]);
    const unit = match[2];
    const multiplier: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multiplier[unit]);
  }
}

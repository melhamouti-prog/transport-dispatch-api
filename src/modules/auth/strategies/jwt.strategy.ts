import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthUser } from "../../../common/interfaces/auth-user.interface";
import { PrismaService } from "../../../prisma/prisma.service";

type JwtPayload = {
  sub: string;
  organizationId: string;
  email: string;
  tokenType: "access" | "refresh";
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET") || "change-me",
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    if (!payload?.sub || payload.tokenType !== "access") {
      throw new UnauthorizedException("Token d'accès invalide");
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        organization: {
          select: {
            id: true,
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

    if (!user || user.status !== "active" || !user.organization?.isActive) {
      throw new UnauthorizedException("Utilisateur non autorisé");
    }

    return {
      userId: user.id,
      organizationId: user.organizationId,
      email: user.email,
      roles: user.userRoles.map(({ role }) => role.code),
      permissions: Array.from(
        new Set(
          user.userRoles.flatMap(({ role }) =>
            role.rolePermissions.map(({ permission }) => permission.code),
          ),
        ),
      ),
    };
  }
}

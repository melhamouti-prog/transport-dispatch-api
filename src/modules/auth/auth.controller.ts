import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Public } from "../../common/decorators/public.decorator";
import { AuthUser } from "../../common/interfaces/auth-user.interface";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@ApiTags("auth")
@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Public()
  @Post("refresh")
  refresh(@Body() payload: RefreshTokenDto) {
    return this.authService.refresh(payload);
  }

  @ApiBearerAuth()
  @Post("logout")
  logout(@CurrentUser() user: AuthUser) {
    return this.authService.logout(user);
  }

  @ApiBearerAuth()
  @Get("me")
  me(@CurrentUser() user: AuthUser) {
    return this.authService.me(user);
  }
}

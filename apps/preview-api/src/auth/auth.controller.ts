import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { CurrentUser } from "./current-user.decorator.js";
import { LoginDto } from "./dto/login.dto.js";
import { RegisterDto } from "./dto/register.dto.js";
import { JwtAuthGuard } from "./jwt-auth.guard.js";
import type { AuthUser } from "./jwt.strategy.js";

@Controller("auth")
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    @Get("setup")
    setupStatus() {
        return this.auth.setupStatus();
    }

    @Post("setup")
    setup(@Body() dto: RegisterDto) {
        return this.auth.setup(dto.email, dto.password, dto.name);
    }

    @Post("login")
    @HttpCode(200)
    login(@Body() dto: LoginDto) {
        return this.auth.login(dto.email, dto.password);
    }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    me(@CurrentUser() user: AuthUser) {
        return this.auth.me(user.id);
    }
}

import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ClientIpThrottlerGuard } from "../common/client-ip-throttler.guard.js";
import { AuthService } from "./auth.service.js";
import { LoginDto } from "./dto/login.dto.js";

@Controller("auth")
export class AuthController {
    constructor(private readonly auth: AuthService) {}

    // Защита от перебора паролей.
    @Post("login")
    @HttpCode(200)
    @UseGuards(ClientIpThrottlerGuard)
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    login(@Body() dto: LoginDto) {
        return this.auth.login(dto.email, dto.password);
    }
}

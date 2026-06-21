import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service.js";
import type { JwtPayload } from "./jwt.strategy.js";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService
    ) {}

    async login(
        email: string,
        password: string
    ): Promise<{ accessToken: string }> {
        const admin = await this.prisma.admin.findUnique({ where: { email } });
        const ok =
            admin !== null &&
            (await bcrypt.compare(password, admin.passwordHash));
        if (!admin || !ok) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload: JwtPayload = { sub: admin.id, email: admin.email };
        const accessToken = await this.jwt.signAsync(payload);
        return { accessToken };
    }
}

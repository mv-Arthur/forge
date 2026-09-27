import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service.js";
import type { AuthUser, JwtPayload } from "./jwt.strategy.js";

export interface AuthSession {
    accessToken: string;
    user: AuthUser;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService
    ) {}

    async setupStatus(): Promise<{ needsSetup: boolean }> {
        const count = await this.prisma.user.count();
        return { needsSetup: count === 0 };
    }

    async setup(
        email: string,
        password: string,
        name?: string
    ): Promise<AuthSession> {
        const count = await this.prisma.user.count();
        if (count > 0) {
            throw new ForbiddenException("Первый пользователь уже создан");
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const row = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                name: name?.trim() || null,
                emailVerifiedAt: new Date(),
            },
        });
        return this.issue(row.id, row.email, row.name);
    }

    async login(email: string, password: string): Promise<AuthSession> {
        const row = await this.prisma.user.findUnique({ where: { email } });
        const ok =
            row !== null && (await bcrypt.compare(password, row.passwordHash));
        if (!row || !ok) {
            throw new UnauthorizedException("Неверный email или пароль");
        }
        if (!row.emailVerifiedAt) {
            throw new ForbiddenException("Аккаунт не подтверждён");
        }
        return this.issue(row.id, row.email, row.name);
    }

    async me(id: string): Promise<AuthUser> {
        const row = await this.prisma.user.findUnique({ where: { id } });
        if (!row?.emailVerifiedAt) {
            throw new UnauthorizedException("Нужно войти");
        }
        return {
            id: row.id,
            email: row.email,
            name: row.name ?? undefined,
        };
    }

    private async issue(
        id: string,
        email: string,
        name: string | null
    ): Promise<AuthSession> {
        const payload: JwtPayload = { sub: id, email };
        const accessToken = await this.jwt.signAsync(payload);
        return {
            accessToken,
            user: { id, email, name: name ?? undefined },
        };
    }
}

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../prisma/prisma.service.js";

export interface JwtPayload {
    sub: string;
    email: string;
}

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        private readonly prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>("JWT_SECRET"),
        });
    }

    async validate(payload: JwtPayload): Promise<AuthUser> {
        const row = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });
        if (!row?.emailVerifiedAt) {
            throw new UnauthorizedException("Нужно войти");
        }
        return {
            id: row.id,
            email: row.email,
            name: row.name ?? undefined,
        };
    }
}

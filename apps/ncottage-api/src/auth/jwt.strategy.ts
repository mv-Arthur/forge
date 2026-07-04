import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import type { Role } from "@forge/shared";
import { ExtractJwt, Strategy } from "passport-jwt";

export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
}

export interface AuthUser {
    id: string;
    email: string;
    role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>("JWT_SECRET"),
        });
    }

    validate(payload: JwtPayload): AuthUser {
        return { id: payload.sub, email: payload.email, role: payload.role };
    }
}

import {
    type CanActivate,
    type ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Role } from "@forge/shared";
import type { AuthUser } from "./jwt.strategy.js";
import { ROLES_KEY } from "./roles.decorator.js";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<Role[] | undefined>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );
        if (!required || required.length === 0) return true;

        const request = context
            .switchToHttp()
            .getRequest<{ user?: AuthUser }>();
        const user = request.user;
        if (!user || !required.includes(user.role)) {
            throw new ForbiddenException("Недостаточно прав");
        }
        return true;
    }
}

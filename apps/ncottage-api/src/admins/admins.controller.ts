import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import type { AuthUser } from "../auth/jwt.strategy.js";
import { JwtAuthGuard } from "../auth/jwt-auth.guard.js";
import { Roles } from "../auth/roles.decorator.js";
import { RolesGuard } from "../auth/roles.guard.js";
import { AdminsService } from "./admins.service.js";
import { CreateAdminDto } from "./dto/create-admin.dto.js";
import { ResetPasswordDto } from "./dto/reset-password.dto.js";
import { UpdateAdminRoleDto } from "./dto/update-admin-role.dto.js";

@Controller("admins")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
export class AdminsController {
    constructor(private readonly admins: AdminsService) {}

    @Get()
    list() {
        return this.admins.list();
    }

    @Post()
    create(@Body() dto: CreateAdminDto) {
        return this.admins.create(dto);
    }

    @Patch(":id/role")
    updateRole(@Param("id") id: string, @Body() dto: UpdateAdminRoleDto) {
        return this.admins.updateRole(id, dto.role);
    }

    @Post(":id/reset-password")
    @HttpCode(204)
    resetPassword(@Param("id") id: string, @Body() dto: ResetPasswordDto) {
        return this.admins.resetPassword(id, dto.password);
    }

    @Delete(":id")
    @HttpCode(204)
    remove(@Param("id") id: string, @Req() req: { user: AuthUser }) {
        return this.admins.remove(id, req.user.id);
    }
}

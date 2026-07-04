import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import type { Admin } from "@prisma/client";
import type { AdminUser, Role } from "@forge/shared";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateAdminDto } from "./dto/create-admin.dto.js";

function toAdminUser(row: Admin): AdminUser {
    return {
        id: row.id,
        email: row.email,
        name: row.name ?? undefined,
        role: row.role,
        createdAt: row.createdAt.toISOString(),
    };
}

@Injectable()
export class AdminsService {
    constructor(private readonly prisma: PrismaService) {}

    async list(): Promise<AdminUser[]> {
        const rows = await this.prisma.admin.findMany({
            orderBy: { createdAt: "asc" },
        });
        return rows.map(toAdminUser);
    }

    async create(dto: CreateAdminDto): Promise<AdminUser> {
        const existing = await this.prisma.admin.findUnique({
            where: { email: dto.email },
        });
        if (existing) {
            throw new ConflictException("Пользователь с таким email уже есть");
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const row = await this.prisma.admin.create({
            data: {
                email: dto.email,
                name: dto.name ?? null,
                role: dto.role,
                passwordHash,
            },
        });
        return toAdminUser(row);
    }

    async updateRole(id: string, role: Role): Promise<AdminUser> {
        await this.requireById(id);
        if (role !== "admin") {
            await this.ensureNotLastAdmin(id);
        }
        const row = await this.prisma.admin.update({
            where: { id },
            data: { role },
        });
        return toAdminUser(row);
    }

    async resetPassword(id: string, password: string): Promise<void> {
        await this.requireById(id);
        const passwordHash = await bcrypt.hash(password, 10);
        await this.prisma.admin.update({
            where: { id },
            data: { passwordHash },
        });
    }

    async remove(id: string, currentUserId: string): Promise<void> {
        if (id === currentUserId) {
            throw new BadRequestException("Нельзя удалить свою учётную запись");
        }
        await this.requireById(id);
        await this.ensureNotLastAdmin(id);
        await this.prisma.admin.delete({ where: { id } });
    }

    private async requireById(id: string): Promise<Admin> {
        const row = await this.prisma.admin.findUnique({ where: { id } });
        if (!row) {
            throw new NotFoundException("Пользователь не найден");
        }
        return row;
    }

    private async ensureNotLastAdmin(id: string): Promise<void> {
        const target = await this.prisma.admin.findUnique({ where: { id } });
        if (target?.role !== "admin") return;
        const adminCount = await this.prisma.admin.count({
            where: { role: "admin" },
        });
        if (adminCount <= 1) {
            throw new BadRequestException(
                "Нельзя удалить или понизить последнего администратора"
            );
        }
    }
}

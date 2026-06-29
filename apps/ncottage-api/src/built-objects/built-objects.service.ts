import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type BuiltObject as BuiltObjectRow } from "@prisma/client";
import type { BuiltObject } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import { CreateBuiltObjectDto } from "./dto/create-built-object.dto.js";
import { UpdateBuiltObjectDto } from "./dto/update-built-object.dto.js";

function toDomain(row: BuiltObjectRow): BuiltObject {
    return {
        id: row.slug,
        title: row.title,
        image: row.image,
        href: row.href,
        ...(row.area != null ? { area: row.area } : {}),
        ...(row.location ? { location: row.location } : {}),
        ...(row.objectType ? { type: row.objectType } : {}),
        ...(row.technology ? { technology: row.technology } : {}),
        ...(row.coordsLat != null && row.coordsLng != null
            ? { coords: { lat: row.coordsLat, lng: row.coordsLng } }
            : {}),
    };
}

@Injectable()
export class BuiltObjectsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    private revalidateBuiltObjects(slug?: string): void {
        const tags = ["built-objects"];
        if (slug) tags.push(`built-object:${slug}`);
        this.revalidate.revalidate({ tags });
    }

    async list(): Promise<BuiltObject[]> {
        const rows = await this.prisma.builtObject.findMany({
            orderBy: { createdAt: "asc" },
        });
        return rows.map(toDomain);
    }

    async getBySlug(slug: string): Promise<BuiltObject> {
        return toDomain(await this.requireBySlug(slug));
    }

    async create(dto: CreateBuiltObjectDto): Promise<BuiltObject> {
        const row = await this.prisma.builtObject.create({
            data: {
                slug: dto.id,
                title: dto.title,
                image: dto.image,
                href: dto.href,
                area: dto.area ?? null,
                location: dto.location ?? null,
                objectType: dto.type || null,
                technology: dto.technology || null,
                coordsLat: dto.coords?.lat ?? null,
                coordsLng: dto.coords?.lng ?? null,
            },
        });
        this.revalidateBuiltObjects(row.slug);
        return toDomain(row);
    }

    async update(
        slug: string,
        dto: UpdateBuiltObjectDto
    ): Promise<BuiltObject> {
        await this.requireBySlug(slug);
        const data: Prisma.BuiltObjectUpdateInput = {};
        if (dto.id !== undefined) data.slug = dto.id;
        if (dto.title !== undefined) data.title = dto.title;
        if (dto.image !== undefined) data.image = dto.image;
        if (dto.href !== undefined) data.href = dto.href;
        if (dto.area !== undefined) data.area = dto.area ?? null;
        if (dto.location !== undefined) data.location = dto.location ?? null;
        if (dto.type !== undefined) data.objectType = dto.type || null;
        if (dto.technology !== undefined)
            data.technology = dto.technology || null;
        if (dto.coords !== undefined) {
            data.coordsLat = dto.coords?.lat ?? null;
            data.coordsLng = dto.coords?.lng ?? null;
        }
        const row = await this.prisma.builtObject.update({
            where: { slug },
            data,
        });
        this.revalidate.revalidate({
            tags: [
                "built-objects",
                `built-object:${slug}`,
                `built-object:${row.slug}`,
            ],
        });
        return toDomain(row);
    }

    async remove(slug: string): Promise<void> {
        await this.requireBySlug(slug);
        await this.prisma.builtObject.delete({ where: { slug } });
        this.revalidateBuiltObjects(slug);
    }

    private async requireBySlug(slug: string): Promise<BuiltObjectRow> {
        const row = await this.prisma.builtObject.findUnique({
            where: { slug },
        });
        if (!row) {
            throw new NotFoundException(`Built object not found: ${slug}`);
        }
        return row;
    }
}

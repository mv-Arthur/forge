import { Injectable, NotFoundException } from "@nestjs/common";
import type { Partner as PartnerRow } from "@prisma/client";
import type { Partner } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import { CreatePartnerDto } from "./dto/create-partner.dto.js";
import { UpdatePartnerDto } from "./dto/update-partner.dto.js";

function toDomain(row: PartnerRow): Partner {
    return {
        slug: row.slug,
        name: row.name,
        category: row.category,
        ...(row.href ? { href: row.href } : {}),
    };
}

@Injectable()
export class PartnersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    private revalidatePartners(slug?: string): void {
        const tags = ["partners"];
        if (slug) tags.push(`partner:${slug}`);
        this.revalidate.revalidate({ tags });
    }

    async list(): Promise<Partner[]> {
        const rows = await this.prisma.partner.findMany({
            orderBy: { createdAt: "asc" },
        });
        return rows.map(toDomain);
    }

    async getBySlug(slug: string): Promise<Partner> {
        return toDomain(await this.requireBySlug(slug));
    }

    async create(dto: CreatePartnerDto): Promise<Partner> {
        const row = await this.prisma.partner.create({
            data: { ...dto, href: dto.href ?? null },
        });
        this.revalidatePartners(row.slug);
        return toDomain(row);
    }

    async update(slug: string, dto: UpdatePartnerDto): Promise<Partner> {
        await this.requireBySlug(slug);
        const row = await this.prisma.partner.update({
            where: { slug },
            data: { ...dto },
        });
        this.revalidate.revalidate({
            tags: ["partners", `partner:${slug}`, `partner:${row.slug}`],
        });
        return toDomain(row);
    }

    async remove(slug: string): Promise<void> {
        await this.requireBySlug(slug);
        await this.prisma.partner.delete({ where: { slug } });
        this.revalidatePartners(slug);
    }

    private async requireBySlug(slug: string): Promise<PartnerRow> {
        const row = await this.prisma.partner.findUnique({ where: { slug } });
        if (!row) {
            throw new NotFoundException(`Partner not found: ${slug}`);
        }
        return row;
    }
}

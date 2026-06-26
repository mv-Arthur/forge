import { Injectable, NotFoundException } from "@nestjs/common";
import type { Promo as PromoRow } from "@prisma/client";
import type { Promo } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import { CreatePromoDto } from "./dto/create-promo.dto.js";
import { UpdatePromoDto } from "./dto/update-promo.dto.js";

function toDomain(row: PromoRow): Promo {
    return {
        slug: row.slug,
        title: row.title,
        shortTitle: row.shortTitle,
        eyebrow: row.eyebrow,
        lead: row.lead,
        price: row.price,
        priceNote: row.priceNote,
        period: row.period,
        terms: row.terms,
        includes: row.includes,
        details: row.details,
        projectsHref: row.projectsHref,
        ...(row.seoTitle ? { seoTitle: row.seoTitle } : {}),
        ...(row.seoDescription ? { seoDescription: row.seoDescription } : {}),
    };
}

@Injectable()
export class PromosService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    private revalidatePromos(slug?: string): void {
        const tags = ["promos"];
        if (slug) tags.push(`promo:${slug}`);
        this.revalidate.revalidate({ tags });
    }

    async list(): Promise<Promo[]> {
        const rows = await this.prisma.promo.findMany({
            orderBy: { createdAt: "asc" },
        });
        return rows.map(toDomain);
    }

    async getBySlug(slug: string): Promise<Promo> {
        return toDomain(await this.requireBySlug(slug));
    }

    async create(dto: CreatePromoDto): Promise<Promo> {
        const row = await this.prisma.promo.create({ data: { ...dto } });
        this.revalidatePromos(row.slug);
        return toDomain(row);
    }

    async update(slug: string, dto: UpdatePromoDto): Promise<Promo> {
        await this.requireBySlug(slug);
        const row = await this.prisma.promo.update({
            where: { slug },
            data: { ...dto },
        });
        this.revalidate.revalidate({
            tags: ["promos", `promo:${slug}`, `promo:${row.slug}`],
        });
        return toDomain(row);
    }

    async remove(slug: string): Promise<void> {
        await this.requireBySlug(slug);
        await this.prisma.promo.delete({ where: { slug } });
        this.revalidatePromos(slug);
    }

    private async requireBySlug(slug: string): Promise<PromoRow> {
        const row = await this.prisma.promo.findUnique({ where: { slug } });
        if (!row) {
            throw new NotFoundException(`Promo not found: ${slug}`);
        }
        return row;
    }
}

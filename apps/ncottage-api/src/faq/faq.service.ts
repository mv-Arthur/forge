import { Injectable, NotFoundException } from "@nestjs/common";
import type { FaqItem as FaqItemRow } from "@prisma/client";
import type { FaqItem } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import { CreateFaqItemDto } from "./dto/create-faq-item.dto.js";
import { UpdateFaqItemDto } from "./dto/update-faq-item.dto.js";

function toDomain(row: FaqItemRow): FaqItem {
    return {
        slug: row.slug,
        order: row.order,
        question: row.question,
        answer: row.answer,
        group: row.group,
    };
}

@Injectable()
export class FaqService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    private revalidateFaq(slug?: string): void {
        const tags = ["faq"];
        if (slug) tags.push(`faq:${slug}`);
        this.revalidate.revalidate({ tags });
    }

    async list(): Promise<FaqItem[]> {
        const rows = await this.prisma.faqItem.findMany({
            orderBy: [{ order: "asc" }, { id: "asc" }],
        });
        return rows.map(toDomain);
    }

    async getBySlug(slug: string): Promise<FaqItem> {
        return toDomain(await this.requireBySlug(slug));
    }

    async create(dto: CreateFaqItemDto): Promise<FaqItem> {
        const row = await this.prisma.faqItem.create({ data: { ...dto } });
        this.revalidateFaq(row.slug);
        return toDomain(row);
    }

    async update(slug: string, dto: UpdateFaqItemDto): Promise<FaqItem> {
        await this.requireBySlug(slug);
        const row = await this.prisma.faqItem.update({
            where: { slug },
            data: { ...dto },
        });
        this.revalidate.revalidate({
            tags: ["faq", `faq:${slug}`, `faq:${row.slug}`],
        });
        return toDomain(row);
    }

    async remove(slug: string): Promise<void> {
        await this.requireBySlug(slug);
        await this.prisma.faqItem.delete({ where: { slug } });
        this.revalidateFaq(slug);
    }

    private async requireBySlug(slug: string): Promise<FaqItemRow> {
        const row = await this.prisma.faqItem.findUnique({ where: { slug } });
        if (!row) {
            throw new NotFoundException(`FAQ item not found: ${slug}`);
        }
        return row;
    }
}

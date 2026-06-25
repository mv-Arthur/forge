import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type Article as ArticleRow } from "@prisma/client";
import type { Article, ArticleSection } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import { CreateArticleDto } from "./dto/create-article.dto.js";
import { UpdateArticleDto } from "./dto/update-article.dto.js";

function toDomain(row: ArticleRow): Article {
    return {
        slug: row.slug,
        title: row.title,
        description: row.description,
        category: row.category,
        date: row.date,
        readTime: row.readTime,
        heroNote: row.heroNote,
        highlights: row.highlights,
        sections: row.sections as unknown as ArticleSection[],
        checklist: row.checklist,
        relatedSlugs: row.relatedSlugs,
    };
}

function toData(dto: CreateArticleDto): Prisma.ArticleCreateInput {
    return {
        slug: dto.slug,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        date: dto.date,
        readTime: dto.readTime,
        heroNote: dto.heroNote,
        highlights: dto.highlights,
        sections: dto.sections as unknown as Prisma.InputJsonValue,
        checklist: dto.checklist,
        relatedSlugs: dto.relatedSlugs,
    };
}

@Injectable()
export class BlogService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    private revalidateArticles(slug?: string): void {
        const tags = ["articles"];
        if (slug) tags.push(`article:${slug}`);
        this.revalidate.revalidate({ tags });
    }

    async list(): Promise<Article[]> {
        const rows = await this.prisma.article.findMany({
            orderBy: { createdAt: "asc" },
        });
        return rows.map(toDomain);
    }

    async getBySlug(slug: string): Promise<Article> {
        return toDomain(await this.requireBySlug(slug));
    }

    async create(dto: CreateArticleDto): Promise<Article> {
        const row = await this.prisma.article.create({ data: toData(dto) });
        this.revalidateArticles(row.slug);
        return toDomain(row);
    }

    async update(slug: string, dto: UpdateArticleDto): Promise<Article> {
        await this.requireBySlug(slug);

        const data: Prisma.ArticleUpdateInput = {};
        if (dto.slug !== undefined) data.slug = dto.slug;
        if (dto.title !== undefined) data.title = dto.title;
        if (dto.description !== undefined) data.description = dto.description;
        if (dto.category !== undefined) data.category = dto.category;
        if (dto.date !== undefined) data.date = dto.date;
        if (dto.readTime !== undefined) data.readTime = dto.readTime;
        if (dto.heroNote !== undefined) data.heroNote = dto.heroNote;
        if (dto.highlights !== undefined) data.highlights = dto.highlights;
        if (dto.sections !== undefined) {
            data.sections = dto.sections as unknown as Prisma.InputJsonValue;
        }
        if (dto.checklist !== undefined) data.checklist = dto.checklist;
        if (dto.relatedSlugs !== undefined) {
            data.relatedSlugs = dto.relatedSlugs;
        }

        const row = await this.prisma.article.update({
            where: { slug },
            data,
        });
        this.revalidate.revalidate({
            tags: ["articles", `article:${slug}`, `article:${row.slug}`],
        });
        return toDomain(row);
    }

    async remove(slug: string): Promise<void> {
        await this.requireBySlug(slug);
        await this.prisma.article.delete({ where: { slug } });
        this.revalidateArticles(slug);
    }

    private async requireBySlug(slug: string): Promise<ArticleRow> {
        const row = await this.prisma.article.findUnique({ where: { slug } });
        if (!row) {
            throw new NotFoundException(`Article not found: ${slug}`);
        }
        return row;
    }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import type { Review as ReviewRow } from "@prisma/client";
import type { Review } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import { CreateReviewDto } from "./dto/create-review.dto.js";
import { UpdateReviewDto } from "./dto/update-review.dto.js";

function toDomain(row: ReviewRow): Review {
    return {
        id: row.id,
        author: row.author,
        date: row.date,
        text: row.text,
        featured: row.featured,
        ...(row.type ? { type: row.type } : {}),
        ...(row.image ? { image: row.image } : {}),
        ...(row.videoUrl ? { videoUrl: row.videoUrl } : {}),
    };
}

@Injectable()
export class ReviewsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    private revalidateReviews(id?: string): void {
        const tags = ["reviews"];
        if (id) tags.push(`review:${id}`);
        this.revalidate.revalidate({ tags });
    }

    async list(): Promise<Review[]> {
        const rows = await this.prisma.review.findMany({
            orderBy: { createdAt: "asc" },
        });
        return rows.map(toDomain);
    }

    async getById(id: string): Promise<Review> {
        return toDomain(await this.requireById(id));
    }

    async create(dto: CreateReviewDto): Promise<Review> {
        const row = await this.prisma.review.create({ data: { ...dto } });
        this.revalidateReviews(row.id);
        return toDomain(row);
    }

    async update(id: string, dto: UpdateReviewDto): Promise<Review> {
        await this.requireById(id);
        const row = await this.prisma.review.update({
            where: { id },
            data: { ...dto },
        });
        this.revalidateReviews(id);
        return toDomain(row);
    }

    async remove(id: string): Promise<void> {
        await this.requireById(id);
        await this.prisma.review.delete({ where: { id } });
        this.revalidateReviews(id);
    }

    private async requireById(id: string): Promise<ReviewRow> {
        const row = await this.prisma.review.findUnique({ where: { id } });
        if (!row) {
            throw new NotFoundException(`Review not found: ${id}`);
        }
        return row;
    }
}

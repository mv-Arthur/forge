import { Injectable, NotFoundException } from "@nestjs/common";
import type { Vacancy as VacancyRow } from "@prisma/client";
import type { Vacancy } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import { CreateVacancyDto } from "./dto/create-vacancy.dto.js";
import { UpdateVacancyDto } from "./dto/update-vacancy.dto.js";

function toDomain(row: VacancyRow): Vacancy {
    return {
        slug: row.slug,
        title: row.title,
        intro: row.intro,
        salary: row.salary,
        experience: row.experience,
        requirements: row.requirements,
        conditions: row.conditions,
    };
}

@Injectable()
export class VacanciesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    private revalidateVacancies(slug?: string): void {
        const tags = ["vacancies"];
        if (slug) tags.push(`vacancy:${slug}`);
        this.revalidate.revalidate({ tags });
    }

    async list(): Promise<Vacancy[]> {
        const rows = await this.prisma.vacancy.findMany({
            orderBy: { createdAt: "asc" },
        });
        return rows.map(toDomain);
    }

    async getBySlug(slug: string): Promise<Vacancy> {
        return toDomain(await this.requireBySlug(slug));
    }

    async create(dto: CreateVacancyDto): Promise<Vacancy> {
        const row = await this.prisma.vacancy.create({ data: { ...dto } });
        this.revalidateVacancies(row.slug);
        return toDomain(row);
    }

    async update(slug: string, dto: UpdateVacancyDto): Promise<Vacancy> {
        await this.requireBySlug(slug);
        const row = await this.prisma.vacancy.update({
            where: { slug },
            data: { ...dto },
        });
        this.revalidate.revalidate({
            tags: ["vacancies", `vacancy:${slug}`, `vacancy:${row.slug}`],
        });
        return toDomain(row);
    }

    async remove(slug: string): Promise<void> {
        await this.requireBySlug(slug);
        await this.prisma.vacancy.delete({ where: { slug } });
        this.revalidateVacancies(slug);
    }

    private async requireBySlug(slug: string): Promise<VacancyRow> {
        const row = await this.prisma.vacancy.findUnique({ where: { slug } });
        if (!row) {
            throw new NotFoundException(`Vacancy not found: ${slug}`);
        }
        return row;
    }
}

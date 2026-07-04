import { Injectable, NotFoundException } from "@nestjs/common";
import {
    Prisma,
    type ProjectSelection as ProjectSelectionRow,
} from "@prisma/client";
import type {
    ProjectSelection,
    SelectionFilter,
    SelectionGroup,
} from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import { CreateProjectSelectionDto } from "./dto/create-project-selection.dto.js";
import { UpdateProjectSelectionDto } from "./dto/update-project-selection.dto.js";

function toDomain(row: ProjectSelectionRow): ProjectSelection {
    return {
        slug: row.slug,
        group: row.group as SelectionGroup,
        title: row.title,
        shortTitle: row.shortTitle,
        description: row.description,
        metaDescription: row.metaDescription,
        filter: row.filter as unknown as SelectionFilter,
    };
}

@Injectable()
export class ProjectSelectionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    private revalidateSelections(slug?: string): void {
        const tags = ["project-selections"];
        if (slug) tags.push(`project-selection:${slug}`);
        this.revalidate.revalidate({ tags });
    }

    async list(): Promise<ProjectSelection[]> {
        const rows = await this.prisma.projectSelection.findMany({
            orderBy: { createdAt: "asc" },
        });
        return rows.map(toDomain);
    }

    async getBySlug(slug: string): Promise<ProjectSelection> {
        return toDomain(await this.requireBySlug(slug));
    }

    async create(dto: CreateProjectSelectionDto): Promise<ProjectSelection> {
        const row = await this.prisma.projectSelection.create({
            data: {
                slug: dto.slug,
                group: dto.group,
                title: dto.title,
                shortTitle: dto.shortTitle,
                description: dto.description,
                metaDescription: dto.metaDescription,
                filter: dto.filter as unknown as Prisma.InputJsonValue,
            },
        });
        this.revalidateSelections(row.slug);
        return toDomain(row);
    }

    async update(
        slug: string,
        dto: UpdateProjectSelectionDto
    ): Promise<ProjectSelection> {
        await this.requireBySlug(slug);
        const data: Prisma.ProjectSelectionUpdateInput = {};
        if (dto.slug !== undefined) data.slug = dto.slug;
        if (dto.group !== undefined) data.group = dto.group;
        if (dto.title !== undefined) data.title = dto.title;
        if (dto.shortTitle !== undefined) data.shortTitle = dto.shortTitle;
        if (dto.description !== undefined) data.description = dto.description;
        if (dto.metaDescription !== undefined) {
            data.metaDescription = dto.metaDescription;
        }
        if (dto.filter !== undefined) {
            data.filter = dto.filter as unknown as Prisma.InputJsonValue;
        }
        const row = await this.prisma.projectSelection.update({
            where: { slug },
            data,
        });
        this.revalidate.revalidate({
            tags: [
                "project-selections",
                `project-selection:${slug}`,
                `project-selection:${row.slug}`,
            ],
        });
        return toDomain(row);
    }

    async remove(slug: string): Promise<void> {
        await this.requireBySlug(slug);
        await this.prisma.projectSelection.delete({ where: { slug } });
        this.revalidateSelections(slug);
    }

    private async requireBySlug(slug: string): Promise<ProjectSelectionRow> {
        const row = await this.prisma.projectSelection.findUnique({
            where: { slug },
        });
        if (!row) {
            throw new NotFoundException(`Project selection not found: ${slug}`);
        }
        return row;
    }
}

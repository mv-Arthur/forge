import { Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma, Project as ProjectRow } from "@prisma/client";
import type { Project } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";

export interface ListProjectsFilters {
    technology?: string;
    livingType?: string;
    featured?: boolean;
}

function fromJson<T>(value: Prisma.JsonValue | null): T | undefined {
    return value == null ? undefined : (value as unknown as T);
}

function toDomain(row: ProjectRow): Project {
    return {
        slug: row.slug,
        name: row.name,
        technology: row.technology as Project["technology"],
        area: row.area,
        floors: row.floors,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        price: row.price,
        image: row.image,
        images: row.images,
        description: row.description,
        specs: row.specs as unknown as Project["specs"],
        style: row.style as Project["style"],
        features: row.features as Project["features"],
        livingType: row.livingType as Project["livingType"],
        featured: row.featured,
        floorPlans: fromJson<Project["floorPlans"]>(row.floorPlans),
        packages: fromJson<Project["packages"]>(row.packages),
        options: fromJson<Project["options"]>(row.options),
        relatedObjectIds: row.relatedObjectIds,
        pdfUrl: row.pdfUrl ?? undefined,
    };
}

@Injectable()
export class ProjectsService {
    constructor(private readonly prisma: PrismaService) {}

    async list(filters: ListProjectsFilters): Promise<Project[]> {
        const where: Prisma.ProjectWhereInput = {};
        if (filters.technology) where.technology = filters.technology;
        if (filters.livingType) where.livingType = filters.livingType;
        if (filters.featured !== undefined) where.featured = filters.featured;

        const rows = await this.prisma.project.findMany({
            where,
            orderBy: { createdAt: "asc" },
        });
        return rows.map(toDomain);
    }

    async getBySlug(slug: string): Promise<Project> {
        const row = await this.prisma.project.findUnique({ where: { slug } });
        if (!row) {
            throw new NotFoundException(`Project not found: ${slug}`);
        }
        return toDomain(row);
    }
}

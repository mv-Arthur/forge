import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type Project as ProjectRow } from "@prisma/client";
import type { Project } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateProjectDto } from "./dto/create-project.dto.js";
import { UpdateProjectDto } from "./dto/update-project.dto.js";

export interface ListProjectsFilters {
    technology?: string;
    livingType?: string;
    featured?: boolean;
}

function fromJson<T>(value: Prisma.JsonValue | null): T | undefined {
    return value == null ? undefined : (value as unknown as T);
}

function toJson(
    value: unknown
): Prisma.InputJsonValue | typeof Prisma.JsonNull {
    return value == null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
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
        return toDomain(await this.requireBySlug(slug));
    }

    async create(dto: CreateProjectDto): Promise<Project> {
        const row = await this.prisma.project.create({
            data: {
                slug: dto.slug,
                name: dto.name,
                technology: dto.technology,
                area: dto.area,
                floors: dto.floors,
                bedrooms: dto.bedrooms,
                bathrooms: dto.bathrooms,
                price: dto.price,
                image: dto.image,
                style: dto.style,
                livingType: dto.livingType,
                featured: dto.featured,
                description: dto.description,
                pdfUrl: dto.pdfUrl ?? null,
                images: dto.images,
                features: dto.features,
                relatedObjectIds: dto.relatedObjectIds ?? [],
                specs: toJson(dto.specs),
                floorPlans: toJson(dto.floorPlans),
                packages: toJson(dto.packages),
                options: toJson(dto.options),
            },
        });
        return toDomain(row);
    }

    async update(slug: string, dto: UpdateProjectDto): Promise<Project> {
        await this.requireBySlug(slug);

        const data: Prisma.ProjectUncheckedUpdateInput = {};
        const set = <K extends keyof UpdateProjectDto>(
            key: K,
            value: UpdateProjectDto[K]
        ) => {
            if (value !== undefined) data[key] = value;
        };
        set("slug", dto.slug);
        set("name", dto.name);
        set("technology", dto.technology);
        set("area", dto.area);
        set("floors", dto.floors);
        set("bedrooms", dto.bedrooms);
        set("bathrooms", dto.bathrooms);
        set("price", dto.price);
        set("image", dto.image);
        set("style", dto.style);
        set("livingType", dto.livingType);
        set("featured", dto.featured);
        set("description", dto.description);
        if (dto.pdfUrl !== undefined) data.pdfUrl = dto.pdfUrl;
        if (dto.images !== undefined) data.images = dto.images;
        if (dto.features !== undefined) data.features = dto.features;
        if (dto.relatedObjectIds !== undefined)
            data.relatedObjectIds = dto.relatedObjectIds;
        if (dto.specs !== undefined) data.specs = toJson(dto.specs);
        if (dto.floorPlans !== undefined)
            data.floorPlans = toJson(dto.floorPlans);
        if (dto.packages !== undefined) data.packages = toJson(dto.packages);
        if (dto.options !== undefined) data.options = toJson(dto.options);

        const row = await this.prisma.project.update({
            where: { slug },
            data,
        });
        return toDomain(row);
    }

    async remove(slug: string): Promise<void> {
        await this.requireBySlug(slug);
        await this.prisma.project.delete({ where: { slug } });
    }

    private async requireBySlug(slug: string): Promise<ProjectRow> {
        const row = await this.prisma.project.findUnique({ where: { slug } });
        if (!row) {
            throw new NotFoundException(`Project not found: ${slug}`);
        }
        return row;
    }
}

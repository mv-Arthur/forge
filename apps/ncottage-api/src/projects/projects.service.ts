import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { Project } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateProjectDto } from "./dto/create-project.dto.js";
import { UpdateProjectDto } from "./dto/update-project.dto.js";

export interface ListProjectsFilters {
    technology?: string;
    livingType?: string;
    featured?: boolean;
}

const projectInclude = {
    images: { orderBy: { order: "asc" } },
    floorPlans: {
        orderBy: { order: "asc" },
        include: { rooms: { orderBy: { order: "asc" } } },
    },
    packages: {
        orderBy: { order: "asc" },
        include: { includes: { orderBy: { order: "asc" } } },
    },
    options: { orderBy: { order: "asc" } },
    relations: { orderBy: { order: "asc" } },
} satisfies Prisma.ProjectInclude;

type ProjectWithRelations = Prisma.ProjectGetPayload<{
    include: typeof projectInclude;
}>;

function toDomain(row: ProjectWithRelations): Project {
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
        images: row.images.map((i) => i.url),
        description: row.description,
        specs: {
            dimensions: row.specsDimensions,
            roofType: row.specsRoofType,
            foundation: row.specsFoundation,
            wallMaterial: row.specsWallMaterial,
            buildTime: row.specsBuildTime,
        },
        style: row.style as Project["style"],
        features: row.features as Project["features"],
        livingType: row.livingType as Project["livingType"],
        featured: row.featured,
        // Пустые вложенные коллекции опускаем (как в донормализованном ответе).
        floorPlans: row.floorPlans.length
            ? row.floorPlans.map((fp) => ({
                  label: fp.label,
                  image: fp.image,
                  area: fp.area ?? undefined,
                  rooms: fp.rooms.map((r) => ({ name: r.name, area: r.area })),
              }))
            : undefined,
        packages: row.packages.length
            ? row.packages.map((p) => ({
                  name: p.name,
                  price: p.price,
                  tagline: p.tagline ?? undefined,
                  highlighted: p.highlighted || undefined,
                  includes: p.includes.map((inc) => ({
                      label: inc.label,
                      value: inc.value,
                  })),
              }))
            : undefined,
        options: row.options.length
            ? row.options.map((o) => ({
                  label: o.label,
                  price: o.price,
                  note: o.note ?? undefined,
              }))
            : undefined,
        relatedObjectIds: row.relations.map((r) => r.relatedSlug),
        pdfUrl: row.pdfUrl ?? undefined,
    };
}

function imageCreate(
    images: string[]
): Prisma.ProjectImageCreateWithoutProjectInput[] {
    return images.map((url, order) => ({ url, order }));
}

function relationCreate(
    slugs: string[]
): Prisma.ProjectRelationCreateWithoutProjectInput[] {
    return slugs.map((relatedSlug, order) => ({ relatedSlug, order }));
}

function floorPlanCreate(
    floorPlans: CreateProjectDto["floorPlans"]
): Prisma.ProjectFloorPlanCreateWithoutProjectInput[] {
    return (floorPlans ?? []).map((fp, order) => ({
        label: fp.label,
        image: fp.image,
        area: fp.area ?? null,
        order,
        rooms: {
            create: (fp.rooms ?? []).map((r, roomOrder) => ({
                name: r.name,
                area: r.area,
                order: roomOrder,
            })),
        },
    }));
}

function packageCreate(
    packages: CreateProjectDto["packages"]
): Prisma.ProjectPackageCreateWithoutProjectInput[] {
    return (packages ?? []).map((pkg, order) => ({
        name: pkg.name,
        price: pkg.price,
        tagline: pkg.tagline ?? null,
        highlighted: pkg.highlighted ?? false,
        order,
        includes: {
            create: pkg.includes.map((inc, incOrder) => ({
                label: inc.label,
                value: inc.value,
                order: incOrder,
            })),
        },
    }));
}

function optionCreate(
    options: CreateProjectDto["options"]
): Prisma.ProjectOptionCreateWithoutProjectInput[] {
    return (options ?? []).map((o, order) => ({
        label: o.label,
        price: o.price,
        note: o.note ?? null,
        order,
    }));
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
            include: projectInclude,
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
                features: dto.features,
                specsDimensions: dto.specs.dimensions,
                specsRoofType: dto.specs.roofType,
                specsFoundation: dto.specs.foundation,
                specsWallMaterial: dto.specs.wallMaterial,
                specsBuildTime: dto.specs.buildTime,
                images: { create: imageCreate(dto.images) },
                relations: {
                    create: relationCreate(dto.relatedObjectIds ?? []),
                },
                floorPlans: { create: floorPlanCreate(dto.floorPlans) },
                packages: { create: packageCreate(dto.packages) },
                options: { create: optionCreate(dto.options) },
            },
            include: projectInclude,
        });
        return toDomain(row);
    }

    async update(slug: string, dto: UpdateProjectDto): Promise<Project> {
        await this.requireBySlug(slug);

        const data: Prisma.ProjectUpdateInput = {};
        if (dto.slug !== undefined) data.slug = dto.slug;
        if (dto.name !== undefined) data.name = dto.name;
        if (dto.technology !== undefined) data.technology = dto.technology;
        if (dto.area !== undefined) data.area = dto.area;
        if (dto.floors !== undefined) data.floors = dto.floors;
        if (dto.bedrooms !== undefined) data.bedrooms = dto.bedrooms;
        if (dto.bathrooms !== undefined) data.bathrooms = dto.bathrooms;
        if (dto.price !== undefined) data.price = dto.price;
        if (dto.image !== undefined) data.image = dto.image;
        if (dto.style !== undefined) data.style = dto.style;
        if (dto.livingType !== undefined) data.livingType = dto.livingType;
        if (dto.featured !== undefined) data.featured = dto.featured;
        if (dto.description !== undefined) data.description = dto.description;
        if (dto.pdfUrl !== undefined) data.pdfUrl = dto.pdfUrl ?? null;
        if (dto.features !== undefined) data.features = dto.features;
        if (dto.specs !== undefined) {
            data.specsDimensions = dto.specs.dimensions;
            data.specsRoofType = dto.specs.roofType;
            data.specsFoundation = dto.specs.foundation;
            data.specsWallMaterial = dto.specs.wallMaterial;
            data.specsBuildTime = dto.specs.buildTime;
        }
        // Вложенное заменяем целиком: удалить детей и пересоздать.
        if (dto.images !== undefined) {
            data.images = { deleteMany: {}, create: imageCreate(dto.images) };
        }
        if (dto.relatedObjectIds !== undefined) {
            data.relations = {
                deleteMany: {},
                create: relationCreate(dto.relatedObjectIds),
            };
        }
        if (dto.floorPlans !== undefined) {
            data.floorPlans = {
                deleteMany: {},
                create: floorPlanCreate(dto.floorPlans),
            };
        }
        if (dto.packages !== undefined) {
            data.packages = {
                deleteMany: {},
                create: packageCreate(dto.packages),
            };
        }
        if (dto.options !== undefined) {
            data.options = {
                deleteMany: {},
                create: optionCreate(dto.options),
            };
        }

        const row = await this.prisma.project.update({
            where: { slug },
            data,
            include: projectInclude,
        });
        return toDomain(row);
    }

    async remove(slug: string): Promise<void> {
        await this.requireBySlug(slug);
        await this.prisma.project.delete({ where: { slug } });
    }

    private async requireBySlug(slug: string): Promise<ProjectWithRelations> {
        const row = await this.prisma.project.findUnique({
            where: { slug },
            include: projectInclude,
        });
        if (!row) {
            throw new NotFoundException(`Project not found: ${slug}`);
        }
        return row;
    }
}

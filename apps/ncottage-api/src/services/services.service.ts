import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type Service as ServiceRow } from "@prisma/client";
import type {
    Service,
    ServiceDetailVariant,
    ServiceSeoContent,
} from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import {
    assertRefsExist,
    assertSlugImmutable,
    findMissing,
} from "../common/references.js";
import { CreateServiceDto } from "./dto/create-service.dto.js";
import { UpdateServiceDto } from "./dto/update-service.dto.js";

function toDomain(row: ServiceRow): Service {
    return {
        slug: row.slug,
        order: row.order,
        title: row.title,
        shortTitle: row.shortTitle,
        description: row.description,
        sourceTitle: row.sourceTitle,
        eyebrow: row.eyebrow,
        lead: row.lead,
        summary: row.summary,
        image: row.image,
        cta: row.cta,
        highlights: row.highlights,
        scopes: row.scopes,
        stages: row.stages,
        advantages: row.advantages,
        fitFor: row.fitFor,
        includes: row.includes,
        notIncluded: row.notIncluded,
        priceFactors: row.priceFactors,
        deliverables: row.deliverables,
        quickFacts: row.quickFacts,
        ...(row.detailPain ? { detailPain: row.detailPain } : {}),
        ...(row.detailPromise ? { detailPromise: row.detailPromise } : {}),
        detailVariants: row.detailVariants as unknown as ServiceDetailVariant[],
        detailChecks: row.detailChecks,
        ...(row.detailNextStep ? { detailNextStep: row.detailNextStep } : {}),
        ...(row.detailCta ? { detailCta: row.detailCta } : {}),
        relatedSlugs: row.relatedSlugs,
        scenarioSlugs: row.scenarioSlugs,
        seoContent: row.seoContent as unknown as ServiceSeoContent,
        ...(row.seoTitle ? { seoTitle: row.seoTitle } : {}),
        ...(row.seoDescription ? { seoDescription: row.seoDescription } : {}),
    };
}

function toData(dto: CreateServiceDto): Prisma.ServiceCreateInput {
    return {
        slug: dto.slug,
        order: dto.order,
        title: dto.title,
        shortTitle: dto.shortTitle,
        description: dto.description,
        sourceTitle: dto.sourceTitle,
        eyebrow: dto.eyebrow,
        lead: dto.lead,
        summary: dto.summary,
        image: dto.image,
        cta: dto.cta,
        highlights: dto.highlights,
        scopes: dto.scopes,
        stages: dto.stages,
        advantages: dto.advantages,
        fitFor: dto.fitFor,
        includes: dto.includes,
        notIncluded: dto.notIncluded,
        priceFactors: dto.priceFactors,
        deliverables: dto.deliverables,
        quickFacts: dto.quickFacts,
        detailPain: dto.detailPain ?? null,
        detailPromise: dto.detailPromise ?? null,
        detailVariants: dto.detailVariants as unknown as Prisma.InputJsonValue,
        detailChecks: dto.detailChecks,
        detailNextStep: dto.detailNextStep ?? null,
        detailCta: dto.detailCta ?? null,
        relatedSlugs: dto.relatedSlugs,
        scenarioSlugs: dto.scenarioSlugs,
        seoContent: dto.seoContent as unknown as Prisma.InputJsonValue,
        seoTitle: dto.seoTitle ?? null,
        seoDescription: dto.seoDescription ?? null,
    };
}

@Injectable()
export class ServicesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    private revalidateServices(slug?: string): void {
        const tags = ["services"];
        if (slug) tags.push(`service:${slug}`);
        this.revalidate.revalidate({ tags });
    }

    async list(): Promise<Service[]> {
        const rows = await this.prisma.service.findMany({
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        });
        return rows.map(toDomain);
    }

    async getBySlug(slug: string): Promise<Service> {
        return toDomain(await this.requireBySlug(slug));
    }

    // relatedSlugs -> Service.slug, scenarioSlugs -> ServiceScenario.slug.
    private async assertServiceRefs(
        relatedSlugs?: string[],
        scenarioSlugs?: string[]
    ): Promise<void> {
        if (relatedSlugs && relatedSlugs.length > 0) {
            const rows = await this.prisma.service.findMany({
                where: { slug: { in: relatedSlugs } },
                select: { slug: true },
            });
            assertRefsExist(
                "связанные услуги",
                findMissing(
                    relatedSlugs,
                    rows.map((r) => r.slug)
                )
            );
        }
        if (scenarioSlugs && scenarioSlugs.length > 0) {
            const rows = await this.prisma.serviceScenario.findMany({
                where: { slug: { in: scenarioSlugs } },
                select: { slug: true },
            });
            assertRefsExist(
                "сценарии услуг",
                findMissing(
                    scenarioSlugs,
                    rows.map((r) => r.slug)
                )
            );
        }
    }

    async create(dto: CreateServiceDto): Promise<Service> {
        await this.assertServiceRefs(dto.relatedSlugs, dto.scenarioSlugs);
        const row = await this.prisma.service.create({ data: toData(dto) });
        this.revalidateServices(row.slug);
        return toDomain(row);
    }

    async update(slug: string, dto: UpdateServiceDto): Promise<Service> {
        await this.requireBySlug(slug);
        assertSlugImmutable(slug, dto.slug);
        await this.assertServiceRefs(dto.relatedSlugs, dto.scenarioSlugs);

        const data: Prisma.ServiceUpdateInput = {};
        if (dto.order !== undefined) data.order = dto.order;
        if (dto.title !== undefined) data.title = dto.title;
        if (dto.shortTitle !== undefined) data.shortTitle = dto.shortTitle;
        if (dto.description !== undefined) data.description = dto.description;
        if (dto.sourceTitle !== undefined) data.sourceTitle = dto.sourceTitle;
        if (dto.eyebrow !== undefined) data.eyebrow = dto.eyebrow;
        if (dto.lead !== undefined) data.lead = dto.lead;
        if (dto.summary !== undefined) data.summary = dto.summary;
        if (dto.image !== undefined) data.image = dto.image;
        if (dto.cta !== undefined) data.cta = dto.cta;
        if (dto.highlights !== undefined) data.highlights = dto.highlights;
        if (dto.scopes !== undefined) data.scopes = dto.scopes;
        if (dto.stages !== undefined) data.stages = dto.stages;
        if (dto.advantages !== undefined) data.advantages = dto.advantages;
        if (dto.fitFor !== undefined) data.fitFor = dto.fitFor;
        if (dto.includes !== undefined) data.includes = dto.includes;
        if (dto.notIncluded !== undefined) data.notIncluded = dto.notIncluded;
        if (dto.priceFactors !== undefined) {
            data.priceFactors = dto.priceFactors;
        }
        if (dto.deliverables !== undefined) {
            data.deliverables = dto.deliverables;
        }
        if (dto.quickFacts !== undefined) data.quickFacts = dto.quickFacts;
        if (dto.detailPain !== undefined) {
            data.detailPain = dto.detailPain ?? null;
        }
        if (dto.detailPromise !== undefined) {
            data.detailPromise = dto.detailPromise ?? null;
        }
        if (dto.detailVariants !== undefined) {
            data.detailVariants =
                dto.detailVariants as unknown as Prisma.InputJsonValue;
        }
        if (dto.detailChecks !== undefined) {
            data.detailChecks = dto.detailChecks;
        }
        if (dto.detailNextStep !== undefined) {
            data.detailNextStep = dto.detailNextStep ?? null;
        }
        if (dto.detailCta !== undefined) {
            data.detailCta = dto.detailCta ?? null;
        }
        if (dto.relatedSlugs !== undefined) {
            data.relatedSlugs = dto.relatedSlugs;
        }
        if (dto.scenarioSlugs !== undefined) {
            data.scenarioSlugs = dto.scenarioSlugs;
        }
        if (dto.seoContent !== undefined) {
            data.seoContent =
                dto.seoContent as unknown as Prisma.InputJsonValue;
        }
        if (dto.seoTitle !== undefined) data.seoTitle = dto.seoTitle ?? null;
        if (dto.seoDescription !== undefined) {
            data.seoDescription = dto.seoDescription ?? null;
        }

        const row = await this.prisma.service.update({
            where: { slug },
            data,
        });
        this.revalidate.revalidate({
            tags: ["services", `service:${slug}`, `service:${row.slug}`],
        });
        return toDomain(row);
    }

    async remove(slug: string): Promise<void> {
        await this.requireBySlug(slug);
        await this.prisma.service.delete({ where: { slug } });
        this.revalidateServices(slug);
    }

    private async requireBySlug(slug: string): Promise<ServiceRow> {
        const row = await this.prisma.service.findUnique({ where: { slug } });
        if (!row) {
            throw new NotFoundException(`Service not found: ${slug}`);
        }
        return row;
    }
}

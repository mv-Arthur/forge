import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, type ServiceScenario as ScenarioRow } from "@prisma/client";
import type { ServiceScenario } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import { CreateServiceScenarioDto } from "./dto/create-service-scenario.dto.js";
import { UpdateServiceScenarioDto } from "./dto/update-service-scenario.dto.js";

function toDomain(row: ScenarioRow): ServiceScenario {
    return {
        slug: row.slug,
        order: row.order,
        title: row.title,
        description: row.description,
        questionLabel: row.questionLabel,
        ...(row.pain !== null ? { pain: row.pain } : {}),
        ...(row.promise !== null ? { promise: row.promise } : {}),
        ...(row.outcome !== null ? { outcome: row.outcome } : {}),
        ...(row.cta !== null ? { cta: row.cta } : {}),
        nextStep: row.nextStep,
        serviceSlugs: row.serviceSlugs,
        primaryServiceSlugs: row.primaryServiceSlugs,
        nextServiceSlugs: row.nextServiceSlugs,
        optionalServiceSlugs: row.optionalServiceSlugs,
        plan: {
            title: row.planTitle,
            resultLabel: row.planResultLabel,
            visualTitle: row.planVisualTitle,
            visualCaption: row.planVisualCaption,
            image: row.planImage,
            startLabel: row.planStartLabel,
            ...(row.planStartText !== null
                ? { startText: row.planStartText }
                : {}),
            nextLabel: row.planNextLabel,
            nextText: row.planNextText,
            optionalLabel: row.planOptionalLabel,
            optionalText: row.planOptionalText,
            ctaText: row.planCtaText,
        },
    };
}

function planColumns(plan: CreateServiceScenarioDto["plan"]) {
    return {
        planTitle: plan.title,
        planResultLabel: plan.resultLabel,
        planVisualTitle: plan.visualTitle,
        planVisualCaption: plan.visualCaption,
        planImage: plan.image,
        planStartLabel: plan.startLabel,
        planStartText: plan.startText ?? null,
        planNextLabel: plan.nextLabel,
        planNextText: plan.nextText,
        planOptionalLabel: plan.optionalLabel,
        planOptionalText: plan.optionalText,
        planCtaText: plan.ctaText,
    };
}

function toData(
    dto: CreateServiceScenarioDto
): Prisma.ServiceScenarioCreateInput {
    return {
        slug: dto.slug,
        order: dto.order,
        title: dto.title,
        description: dto.description,
        questionLabel: dto.questionLabel,
        pain: dto.pain ?? null,
        promise: dto.promise ?? null,
        outcome: dto.outcome ?? null,
        cta: dto.cta ?? null,
        nextStep: dto.nextStep,
        serviceSlugs: dto.serviceSlugs,
        primaryServiceSlugs: dto.primaryServiceSlugs,
        nextServiceSlugs: dto.nextServiceSlugs,
        optionalServiceSlugs: dto.optionalServiceSlugs,
        ...planColumns(dto.plan),
    };
}

@Injectable()
export class ServiceScenariosService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    private revalidateScenarios(): void {
        this.revalidate.revalidate({ tags: ["service-scenarios"] });
    }

    async list(): Promise<ServiceScenario[]> {
        const rows = await this.prisma.serviceScenario.findMany({
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        });
        return rows.map(toDomain);
    }

    async getBySlug(slug: string): Promise<ServiceScenario> {
        return toDomain(await this.requireBySlug(slug));
    }

    async create(dto: CreateServiceScenarioDto): Promise<ServiceScenario> {
        const row = await this.prisma.serviceScenario.create({
            data: toData(dto),
        });
        this.revalidateScenarios();
        return toDomain(row);
    }

    async update(
        slug: string,
        dto: UpdateServiceScenarioDto
    ): Promise<ServiceScenario> {
        await this.requireBySlug(slug);

        const data: Prisma.ServiceScenarioUpdateInput = {};
        if (dto.slug !== undefined) data.slug = dto.slug;
        if (dto.order !== undefined) data.order = dto.order;
        if (dto.title !== undefined) data.title = dto.title;
        if (dto.description !== undefined) data.description = dto.description;
        if (dto.questionLabel !== undefined) {
            data.questionLabel = dto.questionLabel;
        }
        if (dto.pain !== undefined) data.pain = dto.pain ?? null;
        if (dto.promise !== undefined) data.promise = dto.promise ?? null;
        if (dto.outcome !== undefined) data.outcome = dto.outcome ?? null;
        if (dto.cta !== undefined) data.cta = dto.cta ?? null;
        if (dto.nextStep !== undefined) data.nextStep = dto.nextStep;
        if (dto.serviceSlugs !== undefined) {
            data.serviceSlugs = dto.serviceSlugs;
        }
        if (dto.primaryServiceSlugs !== undefined) {
            data.primaryServiceSlugs = dto.primaryServiceSlugs;
        }
        if (dto.nextServiceSlugs !== undefined) {
            data.nextServiceSlugs = dto.nextServiceSlugs;
        }
        if (dto.optionalServiceSlugs !== undefined) {
            data.optionalServiceSlugs = dto.optionalServiceSlugs;
        }
        if (dto.plan !== undefined) {
            Object.assign(data, planColumns(dto.plan));
        }

        const row = await this.prisma.serviceScenario.update({
            where: { slug },
            data,
        });
        this.revalidateScenarios();
        return toDomain(row);
    }

    async remove(slug: string): Promise<void> {
        await this.requireBySlug(slug);
        await this.prisma.serviceScenario.delete({ where: { slug } });
        this.revalidateScenarios();
    }

    private async requireBySlug(slug: string): Promise<ScenarioRow> {
        const row = await this.prisma.serviceScenario.findUnique({
            where: { slug },
        });
        if (!row) {
            throw new NotFoundException(`Service scenario not found: ${slug}`);
        }
        return row;
    }
}

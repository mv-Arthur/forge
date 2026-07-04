import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type {
    Page,
    PageSection,
    PageSectionType,
    PageSummary,
} from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import { UpdatePageMetaDto } from "./dto/update-page-meta.dto.js";
import { SECTION_SCHEMAS } from "./pages.schemas.js";

type PageRow = Prisma.PageGetPayload<{ include: { sections: true } }>;

function toDomain(row: PageRow): Page {
    return {
        key: row.key,
        title: row.title,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        sections: row.sections
            .slice()
            .sort((a, b) => a.order - b.order)
            .map(
                (s): PageSection => ({
                    id: s.id,
                    type: s.type as PageSectionType,
                    order: s.order,
                    data: s.data,
                })
            ),
    };
}

@Injectable()
export class PagesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    private revalidatePage(key: string): void {
        this.revalidate.revalidate({ tags: ["pages", `page:${key}`] });
    }

    async list(): Promise<PageSummary[]> {
        const rows = await this.prisma.page.findMany({
            orderBy: { key: "asc" },
            include: { _count: { select: { sections: true } } },
        });
        return rows.map((row) => ({
            key: row.key,
            title: row.title,
            sectionCount: row._count.sections,
        }));
    }

    async getByKey(key: string): Promise<Page> {
        return toDomain(await this.requireByKey(key));
    }

    async updateMeta(key: string, dto: UpdatePageMetaDto): Promise<Page> {
        await this.requireByKey(key);
        await this.prisma.page.update({ where: { key }, data: { ...dto } });
        this.revalidatePage(key);
        return this.getByKey(key);
    }

    async updateSection(
        key: string,
        sectionId: string,
        data: unknown
    ): Promise<Page> {
        await this.requireByKey(key);
        const section = await this.prisma.pageSection.findUnique({
            where: { id: sectionId },
        });
        if (!section || section.pageKey !== key) {
            throw new NotFoundException(`Section not found: ${sectionId}`);
        }
        const schema = SECTION_SCHEMAS[section.type as PageSectionType];
        if (!schema) {
            throw new BadRequestException(
                `Unknown section type: ${section.type}`
            );
        }
        const parsed = schema.safeParse(data);
        if (!parsed.success) {
            throw new BadRequestException(
                parsed.error.issues.map(
                    (i) => `${i.path.join(".")}: ${i.message}`
                )
            );
        }
        await this.prisma.pageSection.update({
            where: { id: sectionId },
            data: { data: parsed.data as Prisma.InputJsonValue },
        });
        this.revalidatePage(key);
        return this.getByKey(key);
    }

    private async requireByKey(key: string): Promise<PageRow> {
        const row = await this.prisma.page.findUnique({
            where: { key },
            include: { sections: true },
        });
        if (!row) {
            throw new NotFoundException(`Page not found: ${key}`);
        }
        return row;
    }
}

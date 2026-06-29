import { Injectable, NotFoundException } from "@nestjs/common";
import type { Certificate as CertificateRow } from "@prisma/client";
import type { Certificate } from "@forge/shared";
import { PrismaService } from "../prisma/prisma.service.js";
import { RevalidateService } from "../revalidate/revalidate.service.js";
import { CreateCertificateDto } from "./dto/create-certificate.dto.js";
import { UpdateCertificateDto } from "./dto/update-certificate.dto.js";

function toDomain(row: CertificateRow): Certificate {
    return { slug: row.slug, order: row.order, title: row.title };
}

@Injectable()
export class CertificatesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly revalidate: RevalidateService
    ) {}

    private revalidateCertificates(slug?: string): void {
        const tags = ["certificates"];
        if (slug) tags.push(`certificate:${slug}`);
        this.revalidate.revalidate({ tags });
    }

    async list(): Promise<Certificate[]> {
        const rows = await this.prisma.certificate.findMany({
            orderBy: [{ order: "asc" }, { id: "asc" }],
        });
        return rows.map(toDomain);
    }

    async getBySlug(slug: string): Promise<Certificate> {
        return toDomain(await this.requireBySlug(slug));
    }

    async create(dto: CreateCertificateDto): Promise<Certificate> {
        const row = await this.prisma.certificate.create({ data: { ...dto } });
        this.revalidateCertificates(row.slug);
        return toDomain(row);
    }

    async update(
        slug: string,
        dto: UpdateCertificateDto
    ): Promise<Certificate> {
        await this.requireBySlug(slug);
        const row = await this.prisma.certificate.update({
            where: { slug },
            data: { ...dto },
        });
        this.revalidate.revalidate({
            tags: [
                "certificates",
                `certificate:${slug}`,
                `certificate:${row.slug}`,
            ],
        });
        return toDomain(row);
    }

    async remove(slug: string): Promise<void> {
        await this.requireBySlug(slug);
        await this.prisma.certificate.delete({ where: { slug } });
        this.revalidateCertificates(slug);
    }

    private async requireBySlug(slug: string): Promise<CertificateRow> {
        const row = await this.prisma.certificate.findUnique({
            where: { slug },
        });
        if (!row) {
            throw new NotFoundException(`Certificate not found: ${slug}`);
        }
        return row;
    }
}

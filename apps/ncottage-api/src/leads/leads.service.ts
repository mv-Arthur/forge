import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { $Enums, type Lead } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateLeadDto } from "./dto/create-lead.dto.js";
import type { LeadStatusValue } from "./dto/update-lead-status.dto.js";
import { LeadDeliveryPort } from "./delivery/lead-delivery.port.js";

export interface LeadResponse {
    id: string;
    source: string;
    phone: string;
    name: string | null;
    comment: string | null;
    preferredTime: string | null;
    project: string | null;
    consent: boolean | null;
    status: string;
    deliveredAt: string | null;
    deliveryError: string | null;
    deliveryAttempts: number;
    createdAt: string;
}

// Явный маппинг строки БД → ответ API (как в остальных модулях): фиксированная
// форма контракта, ISO-даты, без утечки случайных будущих колонок таблицы.
function toResponse(row: Lead): LeadResponse {
    return {
        id: row.id,
        source: row.source,
        phone: row.phone,
        name: row.name,
        comment: row.comment,
        preferredTime: row.preferredTime,
        project: row.project,
        consent: row.consent,
        status: row.status,
        deliveredAt: row.deliveredAt ? row.deliveredAt.toISOString() : null,
        deliveryError: row.deliveryError,
        deliveryAttempts: row.deliveryAttempts,
        createdAt: row.createdAt.toISOString(),
    };
}

@Injectable()
export class LeadsService {
    private readonly logger = new Logger(LeadsService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly delivery: LeadDeliveryPort
    ) {}

    async create(dto: CreateLeadDto): Promise<Lead> {
        const lead = await this.prisma.lead.create({
            data: {
                source: dto.source,
                phone: dto.phone,
                name: dto.name,
                comment: dto.comment,
                preferredTime: dto.preferredTime,
                project: dto.project,
                consent: dto.consent,
            },
        });
        // Доставка асинхронна и не блокирует ответ: лид уже сохранён.
        void this.dispatch(lead);
        return lead;
    }

    async list(): Promise<LeadResponse[]> {
        const rows = await this.prisma.lead.findMany({
            orderBy: { createdAt: "desc" },
        });
        return rows.map(toResponse);
    }

    async updateStatus(id: string, status: LeadStatusValue): Promise<Lead> {
        const existing = await this.prisma.lead.findUnique({ where: { id } });
        if (!existing) {
            throw new NotFoundException(`Lead not found: ${id}`);
        }
        return this.prisma.lead.update({
            where: { id },
            data: { status: status as $Enums.LeadStatus },
        });
    }

    async redeliver(id: string): Promise<Lead> {
        const lead = await this.prisma.lead.findUnique({ where: { id } });
        if (!lead) {
            throw new NotFoundException(`Lead not found: ${id}`);
        }
        await this.dispatch(lead);
        return this.prisma.lead.findUniqueOrThrow({ where: { id } });
    }

    private async dispatch(lead: Lead): Promise<void> {
        try {
            await this.delivery.deliver(lead);
            await this.prisma.lead.update({
                where: { id: lead.id },
                data: {
                    deliveredAt: new Date(),
                    deliveryError: null,
                    deliveryAttempts: { increment: 1 },
                },
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            this.logger.error(`Lead ${lead.id} delivery failed: ${message}`);
            await this.prisma.lead
                .update({
                    where: { id: lead.id },
                    data: {
                        deliveryError: message,
                        deliveryAttempts: { increment: 1 },
                    },
                })
                .catch(() => undefined);
        }
    }
}

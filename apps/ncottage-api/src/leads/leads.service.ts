import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { $Enums, type Lead } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateLeadDto } from "./dto/create-lead.dto.js";
import type { LeadStatusValue } from "./dto/update-lead-status.dto.js";
import { LeadDeliveryPort } from "./delivery/lead-delivery.port.js";

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

    list(): Promise<Lead[]> {
        return this.prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
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

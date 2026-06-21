import { Injectable, Logger } from "@nestjs/common";
import type { Lead } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";
import { CreateLeadDto } from "./dto/create-lead.dto.js";
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

    private async dispatch(lead: Lead): Promise<void> {
        try {
            await this.delivery.deliver(lead);
            await this.prisma.lead.update({
                where: { id: lead.id },
                data: { deliveredAt: new Date() },
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            this.logger.error(`Lead ${lead.id} delivery failed: ${message}`);
            await this.prisma.lead
                .update({
                    where: { id: lead.id },
                    data: { deliveryError: message },
                })
                .catch(() => undefined);
        }
    }
}

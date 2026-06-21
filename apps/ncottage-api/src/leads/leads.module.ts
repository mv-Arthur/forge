import { Module } from "@nestjs/common";
import { CompositeLeadDelivery } from "./delivery/composite-lead-delivery.js";
import { EmailLeadDelivery } from "./delivery/email-lead-delivery.js";
import { LeadDeliveryPort } from "./delivery/lead-delivery.port.js";
import { TelegramLeadDelivery } from "./delivery/telegram-lead-delivery.js";
import { LeadsController } from "./leads.controller.js";
import { LeadsService } from "./leads.service.js";

@Module({
    controllers: [LeadsController],
    providers: [
        LeadsService,
        TelegramLeadDelivery,
        EmailLeadDelivery,
        { provide: LeadDeliveryPort, useClass: CompositeLeadDelivery },
    ],
})
export class LeadsModule {}

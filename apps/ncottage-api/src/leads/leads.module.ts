import { Module } from "@nestjs/common";
import { LeadsController } from "./leads.controller.js";
import { LeadsService } from "./leads.service.js";
import { LeadDeliveryPort } from "./delivery/lead-delivery.port.js";
import { NoopLeadDelivery } from "./delivery/noop-lead-delivery.js";

@Module({
    controllers: [LeadsController],
    providers: [
        LeadsService,
        { provide: LeadDeliveryPort, useClass: NoopLeadDelivery },
    ],
})
export class LeadsModule {}

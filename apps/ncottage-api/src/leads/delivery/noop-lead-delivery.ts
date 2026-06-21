import { Injectable, Logger } from "@nestjs/common";
import type { Lead } from "@prisma/client";
import { LeadDeliveryPort } from "./lead-delivery.port.js";

function maskPhone(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 4) return "***";
    return `***${digits.slice(-4)}`;
}

@Injectable()
export class NoopLeadDelivery extends LeadDeliveryPort {
    private readonly logger = new Logger(NoopLeadDelivery.name);

    async deliver(lead: Lead): Promise<void> {
        this.logger.log(
            `Lead ${lead.id} (${lead.source}) phone ${maskPhone(lead.phone)}`
        );
    }
}

import { Injectable, Logger } from "@nestjs/common";
import type { Lead } from "@prisma/client";
import { EmailLeadDelivery } from "./email-lead-delivery.js";
import {
    LeadDeliveryPort,
    type LeadDeliveryProvider,
} from "./lead-delivery.port.js";
import { TelegramLeadDelivery } from "./telegram-lead-delivery.js";

@Injectable()
export class CompositeLeadDelivery extends LeadDeliveryPort {
    private readonly logger = new Logger(CompositeLeadDelivery.name);
    private readonly providers: LeadDeliveryProvider[];

    constructor(telegram: TelegramLeadDelivery, email: EmailLeadDelivery) {
        super();
        this.providers = [telegram, email];
    }

    async deliver(lead: Lead): Promise<void> {
        const active = this.providers.filter((p) => p.enabled);
        if (active.length === 0) {
            this.logger.warn(
                `No delivery providers configured; lead ${lead.id} recorded only`
            );
            return;
        }

        const results = await Promise.allSettled(
            active.map((p) => p.deliver(lead))
        );
        const failures = results
            .map((r, i) => ({ result: r, name: active[i].name }))
            .filter(
                (x): x is { result: PromiseRejectedResult; name: string } =>
                    x.result.status === "rejected"
            );

        if (failures.length > 0) {
            const detail = failures
                .map((f) => {
                    const reason = f.result.reason;
                    return `${f.name}: ${
                        reason instanceof Error
                            ? reason.message
                            : String(reason)
                    }`;
                })
                .join("; ");
            throw new Error(detail);
        }
    }
}

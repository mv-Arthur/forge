import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Lead } from "@prisma/client";
import { createTransport, type Transporter } from "nodemailer";
import { formatLead, type LeadDeliveryProvider } from "./lead-delivery.port.js";

@Injectable()
export class EmailLeadDelivery implements LeadDeliveryProvider {
    readonly name = "email";
    private readonly logger = new Logger(EmailLeadDelivery.name);
    private readonly transporter?: Transporter;
    private readonly from?: string;
    private readonly to?: string;

    constructor(config: ConfigService) {
        const host = config.get<string>("SMTP_HOST") || undefined;
        this.from = config.get<string>("SMTP_FROM") || undefined;
        this.to = config.get<string>("SMTP_TO") || undefined;
        if (host) {
            const user = config.get<string>("SMTP_USER") || undefined;
            const pass = config.get<string>("SMTP_PASS") || undefined;
            this.transporter = createTransport({
                host,
                port: Number(config.get<string>("SMTP_PORT") ?? 587),
                secure: config.get<string>("SMTP_SECURE") === "true",
                auth: user && pass ? { user, pass } : undefined,
            });
            if (this.enabled) {
                this.logger.log("Email lead delivery enabled");
            }
        }
    }

    get enabled(): boolean {
        return Boolean(this.transporter && this.from && this.to);
    }

    async deliver(lead: Lead): Promise<void> {
        if (!this.enabled || !this.transporter) return;
        await this.transporter.sendMail({
            from: this.from,
            to: this.to,
            subject: `Новая заявка с сайта: ${lead.source}`,
            text: formatLead(lead),
        });
    }
}

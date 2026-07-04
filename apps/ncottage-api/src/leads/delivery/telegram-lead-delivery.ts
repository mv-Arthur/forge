import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Lead } from "@prisma/client";
import { formatLead, type LeadDeliveryProvider } from "./lead-delivery.port.js";

@Injectable()
export class TelegramLeadDelivery implements LeadDeliveryProvider {
    readonly name = "telegram";
    private readonly logger = new Logger(TelegramLeadDelivery.name);
    private readonly token?: string;
    private readonly chatId?: string;

    constructor(config: ConfigService) {
        this.token = config.get<string>("TELEGRAM_BOT_TOKEN") || undefined;
        this.chatId = config.get<string>("TELEGRAM_CHAT_ID") || undefined;
        if (this.enabled) {
            this.logger.log("Telegram lead delivery enabled");
        }
    }

    get enabled(): boolean {
        return Boolean(this.token && this.chatId);
    }

    async deliver(lead: Lead): Promise<void> {
        if (!this.enabled) return;
        const res = await fetch(
            `https://api.telegram.org/bot${this.token}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: formatLead(lead),
                    disable_web_page_preview: true,
                }),
                signal: AbortSignal.timeout(8000),
            }
        );
        if (!res.ok) {
            const body = await res.text().catch(() => "");
            throw new Error(`Telegram ${res.status}: ${body.slice(0, 200)}`);
        }
    }
}

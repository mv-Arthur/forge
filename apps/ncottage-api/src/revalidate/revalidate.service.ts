import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export interface RevalidatePayload {
    tags?: string[];
    paths?: string[];
}

// Дёргает секретный /api/revalidate в ncottage-www для on-demand ISR.
// Активен только при заданных WWW_REVALIDATE_URL/SECRET; вызовы fire-and-forget.
@Injectable()
export class RevalidateService {
    private readonly logger = new Logger(RevalidateService.name);
    private readonly url?: string;
    private readonly secret?: string;

    constructor(config: ConfigService) {
        this.url = config.get<string>("WWW_REVALIDATE_URL") || undefined;
        this.secret = config.get<string>("WWW_REVALIDATE_SECRET") || undefined;
    }

    get enabled(): boolean {
        return Boolean(this.url && this.secret);
    }

    revalidate(payload: RevalidatePayload): void {
        if (!this.enabled) return;
        void this.send(payload);
    }

    private async send(payload: RevalidatePayload): Promise<void> {
        try {
            const res = await fetch(this.url as string, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-revalidate-secret": this.secret as string,
                },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(5000),
            });
            if (!res.ok) {
                this.logger.warn(`Revalidate request failed: ${res.status}`);
            }
        } catch (error) {
            this.logger.warn(
                `Revalidate request error: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }
}

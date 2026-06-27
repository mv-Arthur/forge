import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

// Ключ троттлинга по реальному клиенту: за www-прокси все запросы приходят с
// одного IP, поэтому при наличии X-Forwarded-For берём первый адрес из цепочки,
// иначе — IP сокета (прямое обращение к API).
@Injectable()
export class ClientIpThrottlerGuard extends ThrottlerGuard {
    protected async getTracker(
        req: Record<string, unknown>
    ): Promise<string> {
        const headers = (req.headers ?? {}) as Record<string, unknown>;
        const xff = headers["x-forwarded-for"];
        if (typeof xff === "string" && xff.trim()) {
            return xff.split(",")[0]!.trim();
        }
        return (req.ip as string) ?? "unknown";
    }
}

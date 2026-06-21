import type { Lead } from "@prisma/client";

// Seam под доставку лида во внешние системы (Telegram/email/CRM).
// В MVP связан с NoopLeadDelivery; смена провайдера не трогает контроллер/сервис.
export abstract class LeadDeliveryPort {
    abstract deliver(lead: Lead): Promise<void>;
}

import type { Lead } from "@prisma/client";

// Порт доставки лида во внешние системы (Telegram/email/CRM).
// CompositeLeadDelivery оркеструет провайдеры; контроллер/сервис не трогаются.
export abstract class LeadDeliveryPort {
    abstract deliver(lead: Lead): Promise<void>;
}

// Конкретный провайдер доставки. `enabled` — настроен ли он через env.
export interface LeadDeliveryProvider {
    readonly name: string;
    readonly enabled: boolean;
    deliver(lead: Lead): Promise<void>;
}

const SOURCE_LABELS: Record<string, string> = {
    contacts: "Форма контактов",
    callback: "Обратный звонок",
    project: "Заявка по проекту",
    works: "Заявка (работы)",
};

export function formatLead(lead: Lead): string {
    const lines = [
        `Новая заявка — ${SOURCE_LABELS[lead.source] ?? lead.source}`,
        `Телефон: ${lead.phone}`,
    ];
    if (lead.name) lines.push(`Имя: ${lead.name}`);
    if (lead.project) lines.push(`Проект: ${lead.project}`);
    if (lead.preferredTime) lines.push(`Удобное время: ${lead.preferredTime}`);
    if (lead.comment) lines.push(`Комментарий: ${lead.comment}`);
    lines.push(`Создана: ${lead.createdAt.toLocaleString("ru-RU")}`);
    return lines.join("\n");
}

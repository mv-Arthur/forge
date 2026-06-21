export type LeadStatus = "new" | "contacted" | "archived";

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "archived"];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
    new: "Новая",
    contacted: "В работе",
    archived: "Архив",
};

export const LEAD_SOURCES = [
    "contacts",
    "callback",
    "project",
    "works",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_SOURCE_LABELS: Record<string, string> = {
    contacts: "Контакты",
    callback: "Обратный звонок",
    project: "По проекту",
    works: "Работы",
};

export interface Lead {
    id: string;
    source: string;
    phone: string;
    name: string | null;
    comment: string | null;
    preferredTime: string | null;
    project: string | null;
    consent: boolean | null;
    status: LeadStatus;
    createdAt: string;
    deliveredAt: string | null;
    deliveryError: string | null;
    deliveryAttempts: number;
}

export type DeliveryState = "delivered" | "failed" | "pending";

export function deliveryState(lead: Lead): DeliveryState {
    if (lead.deliveryError) return "failed";
    if (lead.deliveredAt) return "delivered";
    return "pending";
}

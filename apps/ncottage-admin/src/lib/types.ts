export type LeadStatus = "new" | "contacted" | "archived";

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "archived"];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
    new: "Новая",
    contacted: "В работе",
    archived: "Архив",
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
}

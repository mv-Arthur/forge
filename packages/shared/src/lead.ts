export type LeadSource = "contacts" | "callback" | "project" | "works";

export interface LeadRequest {
    source: LeadSource;
    phone: string;
    name?: string;
    comment?: string;
    preferredTime?: string;
    project?: string;
    consent?: boolean;
}

export const LEAD_SOURCES: LeadSource[] = [
    "contacts",
    "callback",
    "project",
    "works",
];

export const MIN_PHONE_DIGITS = 10;

export function countPhoneDigits(phone: string): number {
    return phone.replace(/\D/g, "").length;
}

export function isValidLead(
    lead: Partial<LeadRequest> | null
): lead is LeadRequest {
    if (!lead || typeof lead !== "object") return false;
    if (typeof lead.phone !== "string") return false;
    if (countPhoneDigits(lead.phone) < MIN_PHONE_DIGITS) return false;
    if (!lead.source || !LEAD_SOURCES.includes(lead.source)) return false;
    return true;
}

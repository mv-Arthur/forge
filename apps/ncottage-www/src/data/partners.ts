import { PARTNERS as STATIC_PARTNERS } from "@/app/partners/partners";
import type { Partner } from "@/domain/partner";

// Партнёры приходят из ncottage-api (ISR-тег partners); при недоступности API
// отдаём статику из src/app/partners/partners.ts (источник сидов).
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;

export async function getPartners(): Promise<Partner[]> {
    if (!API_URL) return STATIC_PARTNERS;
    try {
        const res = await fetch(`${API_URL}/partners`, {
            next: { revalidate: REVALIDATE, tags: ["partners"] },
        });
        if (!res.ok) return STATIC_PARTNERS;
        return (await res.json()) as Partner[];
    } catch {
        return STATIC_PARTNERS;
    }
}

import { PROMOS as STATIC_PROMOS } from "@/app/promos/promos";
import type { Promo } from "@/domain/promo";

// Акции приходят из ncottage-api. ISR-теги promos/promo:<slug>; при недоступности
// API отдаём статику из src/app/promos/promos.ts (источник сидов).
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;

export async function getPromos(): Promise<Promo[]> {
    if (!API_URL) return STATIC_PROMOS;
    try {
        const res = await fetch(`${API_URL}/promos`, {
            next: { revalidate: REVALIDATE, tags: ["promos"] },
        });
        if (!res.ok) return STATIC_PROMOS;
        return (await res.json()) as Promo[];
    } catch {
        return STATIC_PROMOS;
    }
}

export async function getPromoBySlug(slug: string): Promise<Promo | undefined> {
    if (!API_URL) return STATIC_PROMOS.find((p) => p.slug === slug);
    try {
        const res = await fetch(`${API_URL}/promos/${encodeURIComponent(slug)}`, {
            next: { revalidate: REVALIDATE, tags: ["promos", `promo:${slug}`] },
        });
        if (res.status === 404) return undefined;
        if (!res.ok) return STATIC_PROMOS.find((p) => p.slug === slug);
        return (await res.json()) as Promo;
    } catch {
        return STATIC_PROMOS.find((p) => p.slug === slug);
    }
}

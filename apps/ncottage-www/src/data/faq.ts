import { FAQ_ITEMS as STATIC_FAQ } from "@/app/faq/faq";
import type { FaqItem } from "@/domain/faq";
import { warnApiFallback } from "@/lib/api-fallback";

// Вопросы FAQ приходят из ncottage-api (ISR-тег faq); при недоступности API
// отдаём статику из src/app/faq/faq.ts (источник сидов).
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;

export interface FaqGroup {
    title: string;
    items: FaqItem[];
}

export async function getFaqItems(): Promise<FaqItem[]> {
    if (!API_URL) return STATIC_FAQ;
    try {
        const res = await fetch(`${API_URL}/faq`, {
            next: { revalidate: REVALIDATE, tags: ["faq"] },
        });
        if (!res.ok) return STATIC_FAQ;
        return (await res.json()) as FaqItem[];
    } catch (error) {
        warnApiFallback("faq", error);
        return STATIC_FAQ;
    }
}

// Группирует плоский список по `group`, сохраняя порядок первого появления.
export function groupFaqItems(items: FaqItem[]): FaqGroup[] {
    const map = new Map<string, FaqItem[]>();
    for (const item of items) {
        const bucket = map.get(item.group);
        if (bucket) {
            bucket.push(item);
        } else {
            map.set(item.group, [item]);
        }
    }
    return Array.from(map, ([title, groupItems]) => ({
        title,
        items: groupItems,
    }));
}

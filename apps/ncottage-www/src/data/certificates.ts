import { CERTIFICATES as STATIC_CERTIFICATES } from "@/app/certificates/certificates";
import type { Certificate } from "@/domain/certificate";
import { warnApiFallback } from "@/lib/api-fallback";

// Сертификаты приходят из ncottage-api (ISR-тег certificates); при недоступности
// API отдаём статику из src/app/certificates/certificates.ts (источник сидов).
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;

export async function getCertificates(): Promise<Certificate[]> {
    if (!API_URL) return STATIC_CERTIFICATES;
    try {
        const res = await fetch(`${API_URL}/certificates`, {
            next: { revalidate: REVALIDATE, tags: ["certificates"] },
        });
        if (!res.ok) return STATIC_CERTIFICATES;
        return (await res.json()) as Certificate[];
    } catch (error) {
        warnApiFallback("certificates", error);
        return STATIC_CERTIFICATES;
    }
}

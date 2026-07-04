import { VACANCIES as STATIC_VACANCIES } from "@/app/vacancies/vacancies";
import type { Vacancy } from "@/domain/vacancy";
import { warnApiFallback } from "@/lib/api-fallback";

// Вакансии приходят из ncottage-api (ISR-тег vacancies); при недоступности API
// отдаём статику из src/app/vacancies/vacancies.ts (источник сидов).
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;

export async function getVacancies(): Promise<Vacancy[]> {
    if (!API_URL) return STATIC_VACANCIES;
    try {
        const res = await fetch(`${API_URL}/vacancies`, {
            next: { revalidate: REVALIDATE, tags: ["vacancies"] },
        });
        if (!res.ok) return STATIC_VACANCIES;
        return (await res.json()) as Vacancy[];
    } catch (error) {
        warnApiFallback("vacancies", error);
        return STATIC_VACANCIES;
    }
}

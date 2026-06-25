import { REVIEWS as STATIC_REVIEWS } from "@/app/reviews/reviews";
import type { Review } from "@/domain/review";

// Отзывы приходят из ncottage-api (ISR-тег reviews); при недоступности API
// отдаём статику из src/app/reviews/reviews.ts (источник сидов).
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;

export async function getReviews(): Promise<Review[]> {
    if (!API_URL) return STATIC_REVIEWS;
    try {
        const res = await fetch(`${API_URL}/reviews`, {
            next: { revalidate: REVALIDATE, tags: ["reviews"] },
        });
        if (!res.ok) return STATIC_REVIEWS;
        return (await res.json()) as Review[];
    } catch {
        return STATIC_REVIEWS;
    }
}

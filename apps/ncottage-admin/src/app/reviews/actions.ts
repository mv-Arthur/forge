"use server";

import { revalidatePath } from "next/cache";
import type { ReviewInput } from "@/lib/review-schema";
import { apiSend } from "@/lib/api";

export interface ReviewActionResult {
    error?: string;
}

export async function saveReviewAction(
    id: string | null,
    review: ReviewInput
): Promise<ReviewActionResult> {
    const result = id
        ? await apiSend("PATCH", `/reviews/${encodeURIComponent(id)}`, review)
        : await apiSend("POST", "/reviews", review);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/reviews");
    return {};
}

export async function deleteReviewAction(
    id: string
): Promise<ReviewActionResult> {
    const result = await apiSend("DELETE", `/reviews/${encodeURIComponent(id)}`);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/reviews");
    return {};
}

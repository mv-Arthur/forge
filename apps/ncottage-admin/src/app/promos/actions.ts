"use server";

import { revalidatePath } from "next/cache";
import type { Promo } from "@forge/shared";
import { apiSend } from "@/lib/api";

export interface PromoActionResult {
    error?: string;
}

export async function savePromoAction(
    slug: string | null,
    promo: Promo
): Promise<PromoActionResult> {
    const result = slug
        ? await apiSend("PATCH", `/promos/${encodeURIComponent(slug)}`, promo)
        : await apiSend("POST", "/promos", promo);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/promos");
    return {};
}

export async function deletePromoAction(
    slug: string
): Promise<PromoActionResult> {
    const result = await apiSend("DELETE", `/promos/${encodeURIComponent(slug)}`);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/promos");
    return {};
}

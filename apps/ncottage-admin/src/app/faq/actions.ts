"use server";

import { revalidatePath } from "next/cache";
import type { FaqItem } from "@forge/shared";
import { apiSend } from "@/lib/api";

export interface FaqActionResult {
    error?: string;
}

export async function saveFaqAction(
    slug: string | null,
    item: FaqItem
): Promise<FaqActionResult> {
    const result = slug
        ? await apiSend("PATCH", `/faq/${encodeURIComponent(slug)}`, item)
        : await apiSend("POST", "/faq", item);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/faq");
    return {};
}

export async function deleteFaqAction(slug: string): Promise<FaqActionResult> {
    const result = await apiSend("DELETE", `/faq/${encodeURIComponent(slug)}`);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/faq");
    return {};
}

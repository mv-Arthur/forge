"use server";

import { revalidatePath } from "next/cache";
import { apiSend } from "@/lib/api";

export interface PageActionResult {
    error?: string;
}

export async function savePageMetaAction(
    key: string,
    meta: { title: string; seoTitle: string; seoDescription: string }
): Promise<PageActionResult> {
    const result = await apiSend(
        "PUT",
        `/pages/${encodeURIComponent(key)}/meta`,
        meta
    );
    if (!result.ok) return { error: result.error };
    revalidatePath(`/pages/${key}`);
    return {};
}

export async function savePageSectionAction(
    key: string,
    sectionId: string,
    data: unknown
): Promise<PageActionResult> {
    const result = await apiSend(
        "PUT",
        `/pages/${encodeURIComponent(key)}/sections/${encodeURIComponent(sectionId)}`,
        data
    );
    if (!result.ok) return { error: result.error };
    revalidatePath(`/pages/${key}`);
    return {};
}

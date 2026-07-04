"use server";

import { revalidatePath } from "next/cache";
import type { SettingKey } from "@forge/shared";
import { apiSend } from "@/lib/api";

export interface SettingActionResult {
    error?: string;
}

export async function saveSettingAction(
    key: SettingKey,
    value: unknown
): Promise<SettingActionResult> {
    const result = await apiSend(
        "PUT",
        `/settings/${encodeURIComponent(key)}`,
        value
    );
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath(`/content/${key}`);
    revalidatePath("/content");
    return {};
}

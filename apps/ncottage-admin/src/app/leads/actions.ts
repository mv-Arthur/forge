"use server";

import { revalidatePath } from "next/cache";
import { apiSend } from "@/lib/api";
import type { LeadStatus } from "@/lib/types";

export async function updateLeadStatusAction(
    id: string,
    status: LeadStatus
): Promise<{ error?: string }> {
    const result = await apiSend("PATCH", `/leads/${encodeURIComponent(id)}`, {
        status,
    });
    if (!result.ok) return { error: result.error };
    revalidatePath("/leads");
    return {};
}

export async function redeliverLeadAction(
    id: string
): Promise<{ error?: string }> {
    const result = await apiSend(
        "POST",
        `/leads/${encodeURIComponent(id)}/redeliver`
    );
    if (!result.ok) return { error: result.error };
    revalidatePath("/leads");
    return {};
}

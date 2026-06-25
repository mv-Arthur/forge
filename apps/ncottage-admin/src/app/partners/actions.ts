"use server";

import { revalidatePath } from "next/cache";
import type { Partner } from "@forge/shared";
import { apiSend } from "@/lib/api";

export interface PartnerActionResult {
    error?: string;
}

export async function savePartnerAction(
    slug: string | null,
    partner: Partner
): Promise<PartnerActionResult> {
    const result = slug
        ? await apiSend(
              "PATCH",
              `/partners/${encodeURIComponent(slug)}`,
              partner
          )
        : await apiSend("POST", "/partners", partner);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/partners");
    return {};
}

export async function deletePartnerAction(
    slug: string
): Promise<PartnerActionResult> {
    const result = await apiSend(
        "DELETE",
        `/partners/${encodeURIComponent(slug)}`
    );
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/partners");
    return {};
}

"use server";

import { revalidatePath } from "next/cache";
import type { Service } from "@forge/shared";
import { apiSend } from "@/lib/api";

export interface ServiceActionResult {
    error?: string;
}

export async function saveServiceAction(
    slug: string | null,
    service: Service
): Promise<ServiceActionResult> {
    const result = slug
        ? await apiSend(
              "PATCH",
              `/services/${encodeURIComponent(slug)}`,
              service
          )
        : await apiSend("POST", "/services", service);

    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/services");
    return {};
}

export async function deleteServiceAction(
    slug: string
): Promise<ServiceActionResult> {
    const result = await apiSend(
        "DELETE",
        `/services/${encodeURIComponent(slug)}`
    );
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/services");
    return {};
}

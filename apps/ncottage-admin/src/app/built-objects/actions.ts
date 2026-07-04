"use server";

import { revalidatePath } from "next/cache";
import type { BuiltObject } from "@forge/shared";
import { apiSend } from "@/lib/api";

export interface BuiltObjectActionResult {
    error?: string;
}

export async function saveBuiltObjectAction(
    id: string | null,
    object: BuiltObject
): Promise<BuiltObjectActionResult> {
    const result = id
        ? await apiSend(
              "PATCH",
              `/built-objects/${encodeURIComponent(id)}`,
              object
          )
        : await apiSend("POST", "/built-objects", object);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/built-objects");
    return {};
}

export async function deleteBuiltObjectAction(
    id: string
): Promise<BuiltObjectActionResult> {
    const result = await apiSend(
        "DELETE",
        `/built-objects/${encodeURIComponent(id)}`
    );
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/built-objects");
    return {};
}

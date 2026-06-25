"use server";

import { revalidatePath } from "next/cache";
import type { ProjectSelection } from "@forge/shared";
import { apiSend } from "@/lib/api";

export interface SelectionActionResult {
    error?: string;
}

export async function saveSelectionAction(
    slug: string | null,
    selection: ProjectSelection
): Promise<SelectionActionResult> {
    const result = slug
        ? await apiSend(
              "PATCH",
              `/project-selections/${encodeURIComponent(slug)}`,
              selection
          )
        : await apiSend("POST", "/project-selections", selection);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/project-selections");
    return {};
}

export async function deleteSelectionAction(
    slug: string
): Promise<SelectionActionResult> {
    const result = await apiSend(
        "DELETE",
        `/project-selections/${encodeURIComponent(slug)}`
    );
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/project-selections");
    return {};
}

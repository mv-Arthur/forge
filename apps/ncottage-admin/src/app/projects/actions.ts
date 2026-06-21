"use server";

import { revalidatePath } from "next/cache";
import type { Project } from "@forge/shared";
import { apiSend } from "@/lib/api";

export interface ProjectActionResult {
    error?: string;
}

export async function saveProjectAction(
    slug: string | null,
    project: Project
): Promise<ProjectActionResult> {
    const result = slug
        ? await apiSend(
              "PATCH",
              `/projects/${encodeURIComponent(slug)}`,
              project
          )
        : await apiSend("POST", "/projects", project);

    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/projects");
    return {};
}

export async function deleteProjectAction(
    slug: string
): Promise<ProjectActionResult> {
    const result = await apiSend(
        "DELETE",
        `/projects/${encodeURIComponent(slug)}`
    );
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/projects");
    return {};
}

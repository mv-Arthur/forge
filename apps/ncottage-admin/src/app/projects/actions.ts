"use server";

import { revalidatePath } from "next/cache";
import type { Project } from "@forge/shared";
import { apiGet, apiSend } from "@/lib/api";

export interface ProjectActionResult {
    error?: string;
}

export interface ProjectSummary {
    slug: string;
    name: string;
}

export async function listProjectSummariesAction(): Promise<ProjectSummary[]> {
    const projects = await apiGet<Project[]>("/projects");
    return projects.map((p) => ({ slug: p.slug, name: p.name }));
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

"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import { getAllProjects } from "@/server/catalog/data";

export async function listProjectSlugs(): Promise<
    ActionResult<{ slugs: string[] }>
> {
    return {
        success: true,
        slugs: getAllProjects().map((p) => p.slug),
    };
}

"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import { getAllObjects } from "@/server/catalog/data";

export async function listObjectSlugs(): Promise<
    ActionResult<{ slugs: string[] }>
> {
    return {
        success: true,
        slugs: getAllObjects().map((o) => o.slug),
    };
}

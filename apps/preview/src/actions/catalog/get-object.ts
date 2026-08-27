"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { EnrichedBuiltObject } from "./catalog.types";
import { getListedObjects, getObject } from "@/server/catalog/data";

export async function getObjectPage(slug: string): Promise<
    ActionResult<{
        object: EnrichedBuiltObject | null;
        others: EnrichedBuiltObject[];
    }>
> {
    const object = getObject(slug) ?? null;
    if (!object) {
        return { success: true, object: null, others: [] };
    }
    const others = getListedObjects()
        .filter((o) => o.slug !== object.slug)
        .sort((a, b) => b.gallery.length - a.gallery.length)
        .slice(0, 3);
    return { success: true, object, others };
}

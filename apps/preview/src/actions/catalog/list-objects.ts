"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { EnrichedBuiltObject } from "./catalog.types";
import { getListedObjects } from "@/server/catalog/data";

export async function listListedObjects(): Promise<
    ActionResult<{ objects: EnrichedBuiltObject[] }>
> {
    return { success: true, objects: getListedObjects() };
}

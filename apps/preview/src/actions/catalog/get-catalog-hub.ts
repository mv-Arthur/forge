"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { CatalogHubPayload } from "./catalog.types";
import { getCatalogHub as readCatalogHub } from "@/server/catalog/data";

export async function getCatalogHub(): Promise<
    ActionResult<{ hub: CatalogHubPayload }>
> {
    return { success: true, hub: readCatalogHub() };
}

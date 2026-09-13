"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { CatalogNavPayload } from "./catalog.types";
import { getCatalogNav as readCatalogNav } from "@/server/catalog/data";

export async function getCatalogNav(): Promise<
    ActionResult<{ nav: CatalogNavPayload }>
> {
    return { success: true, nav: readCatalogNav() };
}

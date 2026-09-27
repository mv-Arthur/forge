"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { WorksHubPayload } from "./catalog.types";
import { getWorksHub as readWorksHub } from "@/server/catalog/data";

export async function getWorksHub(): Promise<
    ActionResult<{ hub: WorksHubPayload }>
> {
    return { success: true, hub: readWorksHub() };
}

"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { WorksStagesHubPayload } from "./catalog.types";
import { getWorksStagesHub as readWorksStagesHub } from "@/server/catalog/data";

export async function getWorksStagesHub(): Promise<
    ActionResult<{ hub: WorksStagesHubPayload }>
> {
    return { success: true, hub: readWorksStagesHub() };
}

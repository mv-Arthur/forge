"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { TechnologyHubPayload } from "./technology.types";
import { getTechnologyHub as readTechnologyHub } from "@/server/technology/payload";

export async function getTechnologyHub(): Promise<
    ActionResult<{ hub: TechnologyHubPayload }>
> {
    return { success: true, hub: readTechnologyHub() };
}

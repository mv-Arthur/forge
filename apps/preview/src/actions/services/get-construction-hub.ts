"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { ConstructionHubPayload } from "./services.types";
import type { TechFamily } from "@/lib/techFamily";
import { getConstructionHub as readConstructionHub } from "@/server/services/construction";

export async function getConstructionHub(
    family: TechFamily
): Promise<ActionResult<{ hub: ConstructionHubPayload }>> {
    return { success: true, hub: readConstructionHub(family) };
}

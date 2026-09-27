"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { ServicesHubPayload } from "./services.types";
import { getServicesHub as readServicesHub } from "@/server/services/payload";

export async function getServicesHub(): Promise<
    ActionResult<{ hub: ServicesHubPayload }>
> {
    return { success: true, hub: readServicesHub() };
}

"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { MethodsHubPayload } from "@/types/catalog";
import { getMethodsHub as readMethodsHub } from "@/server/technology/methods";

export async function getMethodsHub(): Promise<
    ActionResult<{ hub: MethodsHubPayload }>
> {
    return { success: true, hub: readMethodsHub() };
}

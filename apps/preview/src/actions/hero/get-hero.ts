"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { HeroPayload } from "./hero.types";
import { heroPayload } from "@/server/hero/payload";

export async function getHero(): Promise<
    ActionResult<{ payload: HeroPayload }>
> {
    return { success: true, payload: heroPayload };
}

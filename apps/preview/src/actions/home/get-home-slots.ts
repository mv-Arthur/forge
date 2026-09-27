"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import { FALLBACK_HOME_SLOTS } from "@/lib/homeSlots";

export type HomeSlotMap = Record<string, string>;

export async function getHomeSlots(): Promise<
    ActionResult<{ slots: HomeSlotMap }>
> {
    const base = process.env.PREVIEW_API_URL ?? "http://127.0.0.1:4010";
    try {
        const res = await fetch(`${base}/pages/home`, { cache: "no-store" });
        if (!res.ok) {
            return { success: true, slots: FALLBACK_HOME_SLOTS };
        }
        const data = (await res.json()) as {
            slots?: Record<string, { url?: string } | null>;
        };
        const slots: HomeSlotMap = { ...FALLBACK_HOME_SLOTS };
        for (const [key, value] of Object.entries(data.slots ?? {})) {
            if (value?.url) slots[key] = value.url;
        }
        return { success: true, slots };
    } catch {
        return { success: true, slots: FALLBACK_HOME_SLOTS };
    }
}

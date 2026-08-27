"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { SubmitLeadInput } from "./leads.types";

export async function submitLead(
    input: SubmitLeadInput,
): Promise<ActionResult> {
    if (!input.phone?.trim()) {
        return { success: false, error: "Укажите телефон" };
    }
    if (!input.consent) {
        return { success: false, error: "Нужно согласие на обработку данных" };
    }
    return { success: true };
}

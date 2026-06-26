"use server";

import { revalidatePath } from "next/cache";
import type { ServiceScenario } from "@forge/shared";
import { apiSend } from "@/lib/api";

export interface ScenarioActionResult {
    error?: string;
}

export async function saveScenarioAction(
    slug: string | null,
    scenario: ServiceScenario
): Promise<ScenarioActionResult> {
    const result = slug
        ? await apiSend(
              "PATCH",
              `/service-scenarios/${encodeURIComponent(slug)}`,
              scenario
          )
        : await apiSend("POST", "/service-scenarios", scenario);

    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/service-scenarios");
    return {};
}

export async function deleteScenarioAction(
    slug: string
): Promise<ScenarioActionResult> {
    const result = await apiSend(
        "DELETE",
        `/service-scenarios/${encodeURIComponent(slug)}`
    );
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/service-scenarios");
    return {};
}

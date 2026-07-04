"use server";

import { revalidatePath } from "next/cache";
import type { Vacancy } from "@forge/shared";
import { apiSend } from "@/lib/api";

export interface VacancyActionResult {
    error?: string;
}

export async function saveVacancyAction(
    slug: string | null,
    vacancy: Vacancy
): Promise<VacancyActionResult> {
    const result = slug
        ? await apiSend(
              "PATCH",
              `/vacancies/${encodeURIComponent(slug)}`,
              vacancy
          )
        : await apiSend("POST", "/vacancies", vacancy);
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/vacancies");
    return {};
}

export async function deleteVacancyAction(
    slug: string
): Promise<VacancyActionResult> {
    const result = await apiSend(
        "DELETE",
        `/vacancies/${encodeURIComponent(slug)}`
    );
    if (!result.ok) {
        return { error: result.error };
    }
    revalidatePath("/vacancies");
    return {};
}

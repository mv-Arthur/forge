import { PROJECT_SELECTIONS as STATIC_SELECTIONS } from "@/app/project-selections/selections";
import type { ProjectSelection } from "@/domain/project-selection";

// Подборки проектов приходят из ncottage-api (ISR-теги project-selections /
// project-selection:<slug>); при недоступности API отдаём статику из
// src/app/project-selections/selections.ts (источник сидов).
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;

export async function getSelections(): Promise<ProjectSelection[]> {
    if (!API_URL) return STATIC_SELECTIONS;
    try {
        const res = await fetch(`${API_URL}/project-selections`, {
            next: { revalidate: REVALIDATE, tags: ["project-selections"] },
        });
        if (!res.ok) return STATIC_SELECTIONS;
        return (await res.json()) as ProjectSelection[];
    } catch {
        return STATIC_SELECTIONS;
    }
}

export async function getSelectionBySlug(
    slug: string
): Promise<ProjectSelection | undefined> {
    if (!API_URL) return STATIC_SELECTIONS.find((s) => s.slug === slug);
    try {
        const res = await fetch(
            `${API_URL}/project-selections/${encodeURIComponent(slug)}`,
            {
                next: {
                    revalidate: REVALIDATE,
                    tags: [
                        "project-selections",
                        `project-selection:${slug}`,
                    ],
                },
            }
        );
        if (res.status === 404) return undefined;
        if (!res.ok) return STATIC_SELECTIONS.find((s) => s.slug === slug);
        return (await res.json()) as ProjectSelection;
    } catch {
        return STATIC_SELECTIONS.find((s) => s.slug === slug);
    }
}

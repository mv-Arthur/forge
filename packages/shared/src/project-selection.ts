// Подборки проектов (коллекция). Фильтр — декларативный спек (не функция),
// чтобы его можно было хранить в БД и редактировать в админке. matchesSelection
// интерпретирует спек против проекта; используется www для расчёта каталога.

import type { Project, ProjectFeature, ProjectLivingType, ProjectStyle } from "./project.js";

export const SELECTION_GROUPS = [
    "purpose",
    "floors",
    "area",
    "features",
    "styles",
] as const;
export type SelectionGroup = (typeof SELECTION_GROUPS)[number];

export interface SelectionFilter {
    mode: "all" | "match";
    // matchAny=true — критерии объединяются через ИЛИ; иначе через И.
    matchAny?: boolean;
    livingType?: ProjectLivingType;
    floors?: number;
    areaMax?: number;
    style?: ProjectStyle;
    styleIn?: ProjectStyle[];
    featuresAll?: ProjectFeature[];
    descriptionIncludes?: string[];
}

export interface ProjectSelection {
    slug: string;
    group: SelectionGroup;
    title: string;
    shortTitle: string;
    description: string;
    metaDescription: string;
    filter: SelectionFilter;
}

export function matchesSelection(
    project: Project,
    filter: SelectionFilter
): boolean {
    if (filter.mode === "all") return true;

    const checks: boolean[] = [];
    if (filter.livingType !== undefined) {
        checks.push(project.livingType === filter.livingType);
    }
    if (filter.floors !== undefined) {
        checks.push(project.floors === filter.floors);
    }
    if (filter.areaMax !== undefined) {
        checks.push(project.area <= filter.areaMax);
    }
    if (filter.style !== undefined) {
        checks.push(project.style === filter.style);
    }
    if (filter.styleIn && filter.styleIn.length > 0) {
        checks.push(filter.styleIn.includes(project.style));
    }
    if (filter.featuresAll && filter.featuresAll.length > 0) {
        checks.push(
            filter.featuresAll.every((f) => project.features.includes(f))
        );
    }
    if (filter.descriptionIncludes && filter.descriptionIncludes.length > 0) {
        const description = project.description.toLowerCase();
        checks.push(
            filter.descriptionIncludes.some((s) =>
                description.includes(s.toLowerCase())
            )
        );
    }

    if (checks.length === 0) return true;
    return filter.matchAny ? checks.some(Boolean) : checks.every(Boolean);
}

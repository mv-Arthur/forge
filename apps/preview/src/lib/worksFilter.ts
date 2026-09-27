import type { EnrichedBuiltObject, Technology } from "@/types/catalog";
import { WORKS_LOCATION_OTHER } from "@/lib/copy";

export type WorksTechGroup = "stone" | "frame";

export type WorksTechFilter = WorksTechGroup | Technology;

export type WorksStatusFilter = "built" | "in-progress";

export type WorksGalleryQuery = {
    tech?: WorksTechFilter;
    location?: string;
    status?: WorksStatusFilter;
    areaMin?: number;
    areaMax?: number;
};

export const WORKS_TECHNOLOGIES: Technology[] = [
    "gas_concrete",
    "brick",
    "frame",
    "sip",
    "fachwerk",
];

const STONE: Technology[] = ["gas_concrete", "brick"];
const FRAME: Technology[] = ["frame", "sip"];

export function isWorksTechGroup(value: string): value is WorksTechGroup {
    return value === "stone" || value === "frame";
}

export function isTechnology(value: string): value is Technology {
    return (WORKS_TECHNOLOGIES as string[]).includes(value);
}

export function isWorksTechFilter(value: string): value is WorksTechFilter {
    return isWorksTechGroup(value) || isTechnology(value);
}

export function isWorksStatusFilter(
    value: string,
): value is WorksStatusFilter {
    return value === "built" || value === "in-progress";
}

export function parseWorksGalleryQuery(raw: {
    tech?: string | string[];
    location?: string | string[];
    status?: string | string[];
}): WorksGalleryQuery {
    const tech = first(raw.tech);
    const location = first(raw.location);
    const status = first(raw.status);
    return {
        tech: tech && isWorksTechFilter(tech) ? tech : undefined,
        location: location || undefined,
        status: status && isWorksStatusFilter(status) ? status : undefined,
    };
}

export function parseWorksGallerySearch(
    params: URLSearchParams,
): WorksGalleryQuery {
    return parseWorksGalleryQuery({
        tech: params.get("tech") ?? undefined,
        location: params.get("location") ?? undefined,
        status: params.get("status") ?? undefined,
    });
}

export function objectPassesWorksFilter(
    object: EnrichedBuiltObject,
    query: WorksGalleryQuery,
): boolean {
    if (query.status && object.status !== query.status) return false;
    if (query.tech === "stone") {
        if (!object.technology || !STONE.includes(object.technology)) {
            return false;
        }
    } else if (query.tech === "frame") {
        if (!object.technology || !FRAME.includes(object.technology)) {
            return false;
        }
    } else if (query.tech) {
        if (object.technology !== query.tech) return false;
    }
    if (query.location) {
        const label = object.locationLabel ?? WORKS_LOCATION_OTHER;
        if (label !== query.location) return false;
    }
    if (query.areaMin != null || query.areaMax != null) {
        if (object.area == null) return false;
        if (query.areaMin != null && object.area < query.areaMin) return false;
        if (query.areaMax != null && object.area > query.areaMax) return false;
    }
    return true;
}

export function listWorksTechnologies(
    objects: EnrichedBuiltObject[],
): Technology[] {
    const present = new Set(
        objects
            .map((object) => object.technology)
            .filter((tech): tech is Technology => tech != null),
    );
    return WORKS_TECHNOLOGIES.filter((tech) => present.has(tech));
}

export function worksAreaBounds(objects: EnrichedBuiltObject[]): {
    min: number;
    max: number;
} {
    let min = Infinity;
    let max = -Infinity;
    for (const object of objects) {
        if (object.area == null || object.area <= 0) continue;
        if (object.area < min) min = object.area;
        if (object.area > max) max = object.area;
    }
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return { min: 50, max: 500 };
    }
    if (min === max) {
        return { min: Math.max(1, min - 20), max: min + 20 };
    }
    return { min, max };
}

function first(value: string | string[] | undefined): string | undefined {
    if (Array.isArray(value)) return value[0];
    return value;
}

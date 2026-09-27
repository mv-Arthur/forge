import {
    isCollectionId,
    projectInCollection,
    type CollectionId,
} from "./collections";
import { projectLine, type LineId } from "./lines";

export type CatalogKind = "serial" | "individual" | "bath";

export const CATALOG_KINDS: CatalogKind[] = ["serial", "individual", "bath"];

export function isCatalogKind(value: string): value is CatalogKind {
    return value === "serial" || value === "individual" || value === "bath";
}

export function parseCatalogKinds(raw: string | null): CatalogKind[] {
    if (!raw) return [];
    const out: CatalogKind[] = [];
    for (const part of raw.split(",")) {
        const value = part.trim();
        if (isCatalogKind(value) && !out.includes(value)) out.push(value);
    }
    return out;
}

export function isAllCatalogKinds(kind: CatalogKind[]): boolean {
    return kind.length === 0 || CATALOG_KINDS.every((k) => kind.includes(k));
}

export function catalogKindOn(
    selected: CatalogKind[],
    kind: CatalogKind
): boolean {
    return isAllCatalogKinds(selected) || selected.includes(kind);
}

export function toggleCatalogKind(
    selected: CatalogKind[],
    kind: CatalogKind
): CatalogKind[] {
    if (isAllCatalogKinds(selected)) {
        return CATALOG_KINDS.filter((x) => x !== kind);
    }
    if (selected.includes(kind)) {
        return selected.filter((x) => x !== kind);
    }
    const next = [...selected, kind];
    if (CATALOG_KINDS.every((k) => next.includes(k))) {
        return [];
    }
    return next;
}

export const INDIVIDUAL_CATEGORY = "doma-originalnie";

export function projectIsIndividual(project: {
    categories?: string[];
}): boolean {
    return Boolean(project.categories?.includes(INDIVIDUAL_CATEGORY));
}

export function projectClass(project: {
    slug?: string;
    categories?: string[];
    projectClass?: CatalogKind;
}): CatalogKind {
    if (project.projectClass) return project.projectClass;
    if (project.slug === "banya-levashovo") return "bath";
    if (projectIsIndividual(project)) return "individual";
    return "serial";
}

export type CatalogFilterState = {
    kind: CatalogKind[];
    lines: LineId[];
    tech: string[];
    areaMin: number;
    areaMax: number;
    priceMin: number;
    priceMax: number;
    floors: string[];
    rooms: number[];
    baths: number[];
    collection: CollectionId | "";
};

/** Bounds that do not drop any priced/measured catalog row. */
export const CATALOG_OPEN: CatalogFilterState = {
    kind: [],
    lines: [],
    tech: [],
    areaMin: 0,
    areaMax: 100_000,
    priceMin: 0,
    priceMax: 100_000,
    floors: [],
    rooms: [],
    baths: [],
    collection: "",
};

export type CatalogProjectRow = {
    slug?: string;
    area: number | null;
    priceFrom: number | null;
    technologies: string[];
    floors: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    hasTerrace: boolean;
    displayName?: string;
    subtitle?: string;
    features?: string[];
    categories?: string[];
    projectClass?: CatalogKind;
};

export function openCatalogFilter(bounds: {
    maxArea: number;
    maxPrice: number;
}): CatalogFilterState {
    const areaMax = Math.max(Math.ceil(bounds.maxArea) || 0, 1);
    const priceMax = Math.max(Math.ceil(bounds.maxPrice / 1_000_000) || 0, 1);
    return {
        ...CATALOG_OPEN,
        areaMax,
        priceMax,
    };
}

export function isOpenCatalogFilter(
    state: CatalogFilterState,
    open: CatalogFilterState
): boolean {
    return (
        isAllCatalogKinds(state.kind) &&
        state.lines.length === 0 &&
        state.tech.length === 0 &&
        state.areaMin === open.areaMin &&
        state.areaMax === open.areaMax &&
        state.priceMin === open.priceMin &&
        state.priceMax === open.priceMax &&
        state.floors.length === 0 &&
        state.rooms.length === 0 &&
        state.baths.length === 0 &&
        state.collection === ""
    );
}

export function projectPassesCatalogFilter(
    p: CatalogProjectRow,
    state: CatalogFilterState,
    query = ""
): boolean {
    const q = query.trim().toLowerCase();
    if (q) {
        const hay = [p.displayName, p.subtitle, p.technologies.join(" ")]
            .join(" ")
            .toLowerCase();
        if (!hay.includes(q)) return false;
    }
    if (state.kind.length > 0) {
        const rowKind = projectClass(p);
        if (!state.kind.includes(rowKind)) return false;
    }
    if (state.lines.length > 0) {
        const rowKind = projectClass(p);
        if (rowKind !== "serial") {
            if (!catalogKindOn(state.kind, rowKind)) return false;
        } else {
            const line = p.slug ? projectLine(p.slug) : "classic";
            if (!state.lines.includes(line)) return false;
        }
    }
    if (state.tech.length > 0) {
        const overlap = p.technologies.some((t) => state.tech.includes(t));
        if (!overlap) return false;
    }
    if (p.area != null) {
        if (p.area < state.areaMin || p.area > state.areaMax) return false;
    }
    if (p.priceFrom != null && p.priceFrom > 0) {
        const priceM = p.priceFrom / 1_000_000;
        if (priceM < state.priceMin || priceM > state.priceMax) return false;
    }
    if (state.floors.length > 0) {
        const hits = state.floors.some((floor) => {
            if (floor === "mansard") {
                return (
                    p.floors === "mansard" ||
                    p.floors === "1.5" ||
                    Boolean(p.categories?.includes("doma-s-mansardoj"))
                );
            }
            return p.floors === floor;
        });
        if (!hits) return false;
    }
    if (!countMatchesFilter(state.rooms, p.bedrooms, 7)) {
        return false;
    }
    if (!countMatchesFilter(state.baths, p.bathrooms, 6)) {
        return false;
    }
    if (state.collection && isCollectionId(state.collection)) {
        if (!projectInCollection(p, state.collection)) return false;
    }
    return true;
}

export function countMatchesFilter(
    selected: number[],
    value: number | null,
    plusFrom: number
): boolean {
    if (selected.length === 0) return true;
    if (value == null) return false;
    return selected.some((n) =>
        n >= plusFrom ? value >= plusFrom : value === n
    );
}

export function countActiveFilters(
    state: CatalogFilterState,
    open: CatalogFilterState
): number {
    let n = 0;
    if (state.kind.length && !isAllCatalogKinds(state.kind)) n += 1;
    if (state.lines.length) n += 1;
    if (state.tech.length) n += 1;
    if (state.areaMin !== open.areaMin || state.areaMax !== open.areaMax) {
        n += 1;
    }
    if (state.priceMin !== open.priceMin || state.priceMax !== open.priceMax) {
        n += 1;
    }
    if (state.floors.length) n += 1;
    if (state.rooms.length) n += 1;
    if (state.baths.length) n += 1;
    if (state.collection) n += 1;
    return n;
}

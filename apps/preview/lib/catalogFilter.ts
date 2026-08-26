export type CatalogFilterState = {
    tech: string[];
    areaMin: number;
    areaMax: number;
    priceMin: number;
    priceMax: number;
    floors: string[];
    bedroomsMin: number;
    bathroomsMin: number;
    hasTerrace: boolean;
};

/** Bounds that do not drop any priced/measured catalog row. */
export const CATALOG_OPEN: CatalogFilterState = {
    tech: [],
    areaMin: 0,
    areaMax: 100_000,
    priceMin: 0,
    priceMax: 100_000,
    floors: [],
    bedroomsMin: 0,
    bathroomsMin: 0,
    hasTerrace: false,
};

export type CatalogProjectRow = {
    area: number | null;
    priceFrom: number | null;
    technologies: string[];
    floors: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    hasTerrace: boolean;
    displayName?: string;
    subtitle?: string;
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
    open: CatalogFilterState,
): boolean {
    return (
        state.tech.length === 0 &&
        state.areaMin === open.areaMin &&
        state.areaMax === open.areaMax &&
        state.priceMin === open.priceMin &&
        state.priceMax === open.priceMax &&
        state.floors.length === 0 &&
        state.bedroomsMin === 0 &&
        state.bathroomsMin === 0 &&
        state.hasTerrace === false
    );
}

export function projectPassesCatalogFilter(
    p: CatalogProjectRow,
    state: CatalogFilterState,
    query = "",
): boolean {
    const q = query.trim().toLowerCase();
    if (q) {
        const hay = [p.displayName, p.subtitle, p.technologies.join(" ")]
            .join(" ")
            .toLowerCase();
        if (!hay.includes(q)) return false;
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
    if (state.floors.length > 0 && p.floors) {
        if (!state.floors.includes(p.floors)) return false;
    }
    if (state.bedroomsMin > 0 && (p.bedrooms ?? 0) < state.bedroomsMin) {
        return false;
    }
    if (state.bathroomsMin > 0 && (p.bathrooms ?? 0) < state.bathroomsMin) {
        return false;
    }
    if (state.hasTerrace && !p.hasTerrace) return false;
    return true;
}

export function countActiveFilters(
    state: CatalogFilterState,
    open: CatalogFilterState,
): number {
    let n = 0;
    if (state.tech.length) n += 1;
    if (state.areaMin !== open.areaMin || state.areaMax !== open.areaMax) {
        n += 1;
    }
    if (state.priceMin !== open.priceMin || state.priceMax !== open.priceMax) {
        n += 1;
    }
    if (state.floors.length) n += 1;
    if (state.bedroomsMin) n += 1;
    if (state.bathroomsMin) n += 1;
    if (state.hasTerrace) n += 1;
    return n;
}

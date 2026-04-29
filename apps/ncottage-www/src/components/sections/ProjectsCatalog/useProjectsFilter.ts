"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
    Project,
    ProjectFeature,
    ProjectLivingType,
    ProjectStyle,
    Technology,
} from "@/types/project";

export type SortKey =
    | "featured"
    | "price-asc"
    | "price-desc"
    | "area-asc"
    | "area-desc";

export interface FilterBounds {
    areaMin: number;
    areaMax: number;
    priceMin: number;
    priceMax: number;
}

export interface FiltersState {
    technology: Technology[];
    floors: number[];
    sizes: string[];
    bedrooms: number[];
    bathrooms: number[];
    livingType: ProjectLivingType[];
    styles: ProjectStyle[];
    features: ProjectFeature[];
    areaMin: number;
    areaMax: number;
    priceMin: number;
    priceMax: number;
    search: string;
    sort: SortKey;
}

const SORT_KEYS: SortKey[] = [
    "featured",
    "price-asc",
    "price-desc",
    "area-asc",
    "area-desc",
];

export function computeBounds(projects: Project[]): FilterBounds {
    if (projects.length === 0) {
        return {
            areaMin: 0,
            areaMax: 500,
            priceMin: 0,
            priceMax: 20_000_000,
        };
    }
    const areas = projects.map((p) => p.area);
    const prices = projects.map((p) => p.price);
    return {
        areaMin: Math.floor(Math.min(...areas) / 10) * 10,
        areaMax: Math.ceil(Math.max(...areas) / 10) * 10,
        priceMin: Math.floor(Math.min(...prices) / 100_000) * 100_000,
        priceMax: Math.ceil(Math.max(...prices) / 100_000) * 100_000,
    };
}

function parseList(value: string | null): string[] {
    if (!value) return [];
    return value.split(",").filter(Boolean);
}

function parseNumberList(value: string | null): number[] {
    return parseList(value)
        .map((s) => Number(s))
        .filter((n) => Number.isFinite(n));
}

function parseFiltersFromParams(
    params: URLSearchParams,
    bounds: FilterBounds
): FiltersState {
    const sortRaw = params.get("sort");
    const sort: SortKey = SORT_KEYS.includes(sortRaw as SortKey)
        ? (sortRaw as SortKey)
        : "featured";

    const areaMin = Number(params.get("areaMin"));
    const areaMax = Number(params.get("areaMax"));
    const priceMin = Number(params.get("priceMin"));
    const priceMax = Number(params.get("priceMax"));

    return {
        technology: parseList(params.get("tech")) as Technology[],
        floors: parseNumberList(params.get("floors")),
        sizes: parseList(params.get("sizes")),
        bedrooms: parseNumberList(params.get("beds")),
        bathrooms: parseNumberList(params.get("baths")),
        livingType: parseList(params.get("living")) as ProjectLivingType[],
        styles: parseList(params.get("styles")) as ProjectStyle[],
        features: parseList(params.get("features")) as ProjectFeature[],
        areaMin: Number.isFinite(areaMin) && areaMin > 0 ? areaMin : bounds.areaMin,
        areaMax: Number.isFinite(areaMax) && areaMax > 0 ? areaMax : bounds.areaMax,
        priceMin:
            Number.isFinite(priceMin) && priceMin > 0
                ? priceMin
                : bounds.priceMin,
        priceMax:
            Number.isFinite(priceMax) && priceMax > 0
                ? priceMax
                : bounds.priceMax,
        search: params.get("q") ?? "",
        sort,
    };
}

function serializeFilters(
    filters: FiltersState,
    bounds: FilterBounds
): string {
    const sp = new URLSearchParams();
    if (filters.technology.length) sp.set("tech", filters.technology.join(","));
    if (filters.floors.length)
        sp.set("floors", filters.floors.map(String).join(","));
    if (filters.sizes.length) sp.set("sizes", filters.sizes.join(","));
    if (filters.bedrooms.length)
        sp.set("beds", filters.bedrooms.map(String).join(","));
    if (filters.bathrooms.length)
        sp.set("baths", filters.bathrooms.map(String).join(","));
    if (filters.livingType.length) sp.set("living", filters.livingType.join(","));
    if (filters.styles.length) sp.set("styles", filters.styles.join(","));
    if (filters.features.length) sp.set("features", filters.features.join(","));
    if (filters.areaMin !== bounds.areaMin)
        sp.set("areaMin", String(filters.areaMin));
    if (filters.areaMax !== bounds.areaMax)
        sp.set("areaMax", String(filters.areaMax));
    if (filters.priceMin !== bounds.priceMin)
        sp.set("priceMin", String(filters.priceMin));
    if (filters.priceMax !== bounds.priceMax)
        sp.set("priceMax", String(filters.priceMax));
    if (filters.search.trim()) sp.set("q", filters.search.trim());
    if (filters.sort !== "featured") sp.set("sort", filters.sort);
    return sp.toString();
}

export function applyFilters(
    projects: Project[],
    filters: FiltersState
): Project[] {
    const filtered = projects.filter((p) => {
        if (
            filters.technology.length &&
            !filters.technology.includes(p.technology)
        )
            return false;
        if (filters.floors.length && !filters.floors.includes(p.floors))
            return false;
        if (
            filters.sizes.length &&
            !filters.sizes.includes(p.specs.dimensions)
        )
            return false;
        if (
            filters.bedrooms.length &&
            !filters.bedrooms.some((b) =>
                b >= 4 ? p.bedrooms >= 4 : p.bedrooms === b
            )
        )
            return false;
        if (
            filters.bathrooms.length &&
            !filters.bathrooms.some((b) =>
                b >= 3 ? p.bathrooms >= 3 : p.bathrooms === b
            )
        )
            return false;
        if (
            filters.livingType.length &&
            !filters.livingType.includes(p.livingType)
        )
            return false;
        if (filters.styles.length && !filters.styles.includes(p.style))
            return false;
        if (
            filters.features.length &&
            !filters.features.every((f) => p.features.includes(f))
        )
            return false;
        if (p.area < filters.areaMin || p.area > filters.areaMax) return false;
        if (p.price < filters.priceMin || p.price > filters.priceMax)
            return false;
        if (filters.search.trim()) {
            const q = filters.search.trim().toLowerCase();
            if (
                !p.name.toLowerCase().includes(q) &&
                !p.description.toLowerCase().includes(q)
            )
                return false;
        }
        return true;
    });

    const sorted = [...filtered];
    switch (filters.sort) {
        case "price-asc":
            sorted.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            sorted.sort((a, b) => b.price - a.price);
            break;
        case "area-asc":
            sorted.sort((a, b) => a.area - b.area);
            break;
        case "area-desc":
            sorted.sort((a, b) => b.area - a.area);
            break;
        default:
            sorted.sort(
                (a, b) => Number(b.featured) - Number(a.featured)
            );
            break;
    }
    return sorted;
}

export function useProjectsFilter(bounds: FilterBounds) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const filters = useMemo<FiltersState>(
        () =>
            parseFiltersFromParams(
                new URLSearchParams(params?.toString() ?? ""),
                bounds
            ),
        [params, bounds]
    );

    const setFilters = useCallback(
        (
            patch:
                | Partial<FiltersState>
                | ((prev: FiltersState) => FiltersState)
        ) => {
            const next =
                typeof patch === "function"
                    ? patch(filters)
                    : { ...filters, ...patch };
            const qs = serializeFilters(next, bounds);
            router.replace(qs ? `${pathname}?${qs}` : pathname, {
                scroll: false,
            });
        },
        [filters, router, pathname, bounds]
    );

    const reset = useCallback(() => {
        router.replace(pathname, { scroll: false });
    }, [router, pathname]);

    return { filters, setFilters, reset };
}

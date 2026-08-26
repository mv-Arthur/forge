import type { Organization } from "./types.ts";

interface SearchCategory {
    name?: unknown;
}

interface SearchPhone {
    number?: unknown;
    value?: unknown;
}

interface SearchRating {
    ratingValue?: unknown;
    reviewCount?: unknown;
}

interface SearchWorkingStatus {
    isOpenNow?: unknown;
}

export interface SearchBusiness {
    type?: unknown;
    id?: unknown;
    title?: unknown;
    address?: unknown;
    fullAddress?: unknown;
    coordinates?: unknown;
    categories?: unknown;
    phones?: unknown;
    urls?: unknown;
    ratingData?: unknown;
    seoname?: unknown;
    workingTimeText?: unknown;
    currentWorkingStatus?: unknown;
}

export function isBusiness(item: SearchBusiness): boolean {
    return item.type === "business" && typeof item.id === "string";
}

export function mapOrganization(
    item: SearchBusiness,
    origin: string
): Organization {
    const id = String(item.id);
    const seoname = typeof item.seoname === "string" ? item.seoname : null;
    return {
        id,
        title: typeof item.title === "string" ? item.title : id,
        address: stringOrNull(item.address),
        fullAddress: stringOrNull(item.fullAddress),
        categories: categoryNames(item.categories),
        phones: phoneNumbers(item.phones),
        websites: websites(item.urls),
        rating: ratingValue(item.ratingData),
        reviewCount: reviewCount(item.ratingData),
        coordinates: lonLat(item.coordinates),
        url: organizationUrl(origin, seoname, id),
        workingTimeText: stringOrNull(item.workingTimeText),
        isOpenNow: isOpenNow(item.currentWorkingStatus),
    };
}

function stringOrNull(value: unknown): string | null {
    return typeof value === "string" && value.length > 0 ? value : null;
}

function categoryNames(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    const names: string[] = [];
    for (const entry of value as SearchCategory[]) {
        if (typeof entry?.name === "string" && entry.name) {
            names.push(entry.name);
        }
    }
    return names;
}

function phoneNumbers(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    const phones: string[] = [];
    for (const entry of value as SearchPhone[]) {
        let number: string | null = null;
        if (typeof entry?.number === "string") number = entry.number;
        else if (typeof entry?.value === "string") number = entry.value;
        if (number) phones.push(number);
    }
    return phones;
}

function websites(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter((entry): entry is string => typeof entry === "string");
}

function ratingValue(value: unknown): number | null {
    const data = value as SearchRating | undefined;
    const rating = data?.ratingValue;
    return typeof rating === "number" && rating > 0 ? rating : null;
}

function reviewCount(value: unknown): number | null {
    const data = value as SearchRating | undefined;
    const count = data?.reviewCount;
    return typeof count === "number" && count > 0 ? count : null;
}

function lonLat(value: unknown): { lon: number; lat: number } | null {
    if (!Array.isArray(value) || value.length < 2) return null;
    const lon = Number(value[0]);
    const lat = Number(value[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    return { lon, lat };
}

function isOpenNow(value: unknown): boolean | null {
    const status = value as SearchWorkingStatus | undefined;
    return typeof status?.isOpenNow === "boolean" ? status.isOpenNow : null;
}

function organizationUrl(
    origin: string,
    seoname: string | null,
    id: string
): string {
    if (seoname) return `${origin}/maps/org/${seoname}/${id}/`;
    return `${origin}/maps/org/${id}/`;
}

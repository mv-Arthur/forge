import { applyBlacklist } from "./blacklist.ts";
import {
    boundsCenter,
    boundsToSpn,
    pointInGeometry,
    quadrants,
} from "./geometry.ts";
import { isBusiness, mapOrganization } from "./map-organization.ts";
import { parseDistrictUrl } from "./parse-district-url.ts";
import { resolveHouseAddresses } from "./resolve-address.ts";
import { MapsRequestError, openDistrict, searchBusinesses } from "./session.ts";
import type { MapsSession } from "./session.ts";
import type {
    Bounds,
    DistrictOrgsResult,
    GeoJsonGeometry,
    ListDistrictOrgsOptions,
    Organization,
} from "./types.ts";

const DEFAULT_LIMIT = 100;
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_DELAY_MS = 250;
const MAX_SKIP = 980;

export async function listDistrictOrgs(
    input: string,
    options: ListDistrictOrgsOptions = {}
): Promise<DistrictOrgsResult> {
    const ref = parseDistrictUrl(input);
    const http = options.fetch ?? fetch;
    const query = options.query ?? "";
    const limit = normalizeLimit(options.limit);
    const pageSize = normalizePageSize(options.pageSize);
    const delayMs = options.delayMs ?? DEFAULT_DELAY_MS;
    const includeOutside = options.includeOutside === true;

    const opened = await openDistrict(ref, {
        fetch: http,
        userAgent: options.userAgent,
        signal: options.signal,
    });

    const seen = new Set<string>();
    const collected: Organization[] = [];
    let totalEstimate: number | null = null;

    const areas: Bounds[] = [opened.district.bounds];
    if (options.densify) {
        areas.push(...quadrants(opened.district.bounds));
    }

    for (const area of areas) {
        if (collected.length >= limit) break;
        const estimate = await paginateArea({
            session: opened.session,
            query,
            bounds: area,
            geoId: opened.district.geoId,
            pageSize,
            delayMs,
            limit,
            seen,
            collected,
            includeOutside,
            geometry: opened.geometry,
            districtBounds: opened.district.bounds,
            origin: opened.district.origin,
            fetch: http,
            signal: options.signal,
        });
        if (estimate != null) totalEstimate = estimate;
    }

    const expanded = await resolveHouseAddresses(
        collected.slice(0, limit),
        opened.session,
        {
            fetch: http,
            delayMs,
            signal: options.signal,
        }
    );
    const organizations = applyBlacklist(expanded, options.exclude ?? []);

    return {
        district: opened.district,
        query,
        totalEstimate,
        count: organizations.length,
        organizations,
    };
}

async function paginateArea(params: {
    session: MapsSession;
    query: string;
    bounds: Bounds;
    geoId: string;
    pageSize: number;
    delayMs: number;
    limit: number;
    seen: Set<string>;
    collected: Organization[];
    includeOutside: boolean;
    geometry: GeoJsonGeometry | null;
    districtBounds: Bounds;
    origin: string;
    fetch: typeof fetch;
    signal?: AbortSignal;
}): Promise<number | null> {
    const ll = boundsCenter(params.bounds);
    const spn = boundsToSpn(params.bounds);
    let skip = 0;
    let totalEstimate: number | null = null;
    let firstPage = true;

    while (params.collected.length < params.limit && skip <= MAX_SKIP) {
        if (!firstPage && params.delayMs > 0) {
            await sleep(params.delayMs, params.signal);
        }
        firstPage = false;
        let page;
        try {
            page = await searchBusinesses(params.session, {
                query: params.query,
                ll,
                spn,
                skip,
                pageSize: params.pageSize,
                geoId: params.geoId,
                fetch: params.fetch,
                signal: params.signal,
            });
        } catch (error) {
            if (skip > 0 && error instanceof MapsRequestError) break;
            throw error;
        }
        if (page.totalEstimate != null) {
            totalEstimate = page.totalEstimate;
        }
        const businesses = page.items.filter(isBusiness);
        if (businesses.length === 0) break;

        let newIds = 0;
        for (const item of businesses) {
            const id = String(item.id);
            if (params.seen.has(id)) continue;
            params.seen.add(id);
            newIds += 1;
            const org = mapOrganization(item, params.origin);
            if (!params.includeOutside && org.coordinates) {
                const inside = pointInGeometry(
                    [org.coordinates.lon, org.coordinates.lat],
                    params.geometry,
                    params.districtBounds
                );
                if (!inside) continue;
            }
            params.collected.push(org);
            if (params.collected.length >= params.limit) break;
        }
        if (newIds === 0) break;
        if (businesses.length < params.pageSize) break;
        skip += params.pageSize;
    }
    return totalEstimate;
}

function normalizeLimit(value: number | undefined): number {
    if (value == null) return DEFAULT_LIMIT;
    if (!Number.isFinite(value) || value <= 0) return DEFAULT_LIMIT;
    return Math.floor(value);
}

function normalizePageSize(value: number | undefined): number {
    if (value == null) return DEFAULT_PAGE_SIZE;
    if (!Number.isFinite(value) || value <= 0) return DEFAULT_PAGE_SIZE;
    return Math.min(25, Math.floor(value));
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal?.aborted) {
            reject(signal.reason ?? new Error("aborted"));
            return;
        }
        const timer = setTimeout(resolve, ms);
        signal?.addEventListener(
            "abort",
            () => {
                clearTimeout(timer);
                reject(signal.reason ?? new Error("aborted"));
            },
            { once: true }
        );
    });
}

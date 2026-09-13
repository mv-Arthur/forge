import { isHouseAddress } from "./group-address.ts";
import { isBusiness, mapOrganization } from "./map-organization.ts";
import type { SearchBusiness } from "./map-organization.ts";
import { MapsRequestError, searchToponyms } from "./session.ts";
import type { MapsSession, SearchToponym } from "./session.ts";
import type { LonLat, Organization } from "./types.ts";

const HOUSE_SPN: [number, number] = [0.01, 0.01];
const MAX_HOUSE_LOOKUPS = 2500;
const MAX_INDOOR_M = 250;
const MAX_HOUSE_APPLY_M = 400;

export interface HouseHit {
    id: string | null;
    address: string;
    fullAddress: string | null;
    coordinates: LonLat | null;
    indoor: SearchBusiness[];
}

export async function resolveHouseAddresses(
    organizations: Organization[],
    session: MapsSession,
    options: {
        fetch: typeof fetch;
        delayMs: number;
        signal?: AbortSignal;
        acceptPoint?: (point: LonLat) => boolean;
        onProgress?: (message: string) => void;
    }
): Promise<Organization[]> {
    const seen = new Set(organizations.map((org) => org.id));
    const collected = organizations.map((org) => ({ ...org }));
    const pending = new Map<string, LonLat | null>();
    const visited = new Set<string>();
    queueAddresses(collected, pending);
    const total = [...pending.values()].filter(Boolean).length;

    let lookups = 0;
    let first = true;
    while (pending.size > 0 && lookups < MAX_HOUSE_LOOKUPS) {
        const batch = [...pending.entries()];
        pending.clear();
        for (const [address, near] of batch) {
            if (visited.has(address) || !near) continue;
            visited.add(address);
            if (!first && options.delayMs > 0) {
                await sleep(options.delayMs, options.signal);
            }
            first = false;
            lookups += 1;
            options.onProgress?.(
                total > 0 ? `house ${lookups}/${total}` : `house ${lookups}`
            );
            const house = await lookupHouse(session, address, near, options);
            if (!house) continue;
            if (!houseUsable(house, near, options.acceptPoint)) continue;
            visited.add(house.address);
            applyHouse(collected, address, house);
            const extra = indoorOrgs(
                house,
                session.origin,
                seen,
                options.acceptPoint
            );
            if (extra.length > 0) collected.push(...extra);
        }
    }
    return collected;
}

function queueAddresses(
    organizations: Organization[],
    pending: Map<string, LonLat | null>
): void {
    for (const org of organizations) {
        const key = (org.address ?? "").trim();
        if (!key || !isHouseAddress(key)) continue;
        const prev = pending.get(key);
        if (prev === undefined) pending.set(key, org.coordinates);
        else if (!prev && org.coordinates) pending.set(key, org.coordinates);
    }
}

function applyHouse(
    organizations: Organization[],
    fromAddress: string,
    house: HouseHit
): void {
    for (const org of organizations) {
        const key = (org.address ?? "").trim();
        if (key !== fromAddress) continue;
        org.address = house.address;
        org.fullAddress = house.fullAddress ?? org.fullAddress;
        if (house.coordinates) org.coordinates = house.coordinates;
    }
}

function houseUsable(
    house: HouseHit,
    near: LonLat,
    acceptPoint?: (point: LonLat) => boolean
): boolean {
    if (!house.coordinates) return true;
    if (acceptPoint && !acceptPoint(house.coordinates)) return false;
    return meters(house.coordinates, near) <= MAX_HOUSE_APPLY_M;
}

function indoorOrgs(
    house: HouseHit,
    origin: string,
    seen: Set<string>,
    acceptPoint?: (point: LonLat) => boolean
): Organization[] {
    const extra: Organization[] = [];
    for (const item of house.indoor) {
        const raw = {
            ...item,
            id: item.id != null ? String(item.id) : item.id,
        };
        if (!isBusiness(raw)) continue;
        const id = String(raw.id);
        if (seen.has(id)) continue;
        const org = mapOrganization(raw, origin);
        if (
            house.coordinates &&
            org.coordinates &&
            meters(house.coordinates, org.coordinates) > MAX_INDOOR_M
        ) {
            continue;
        }
        if (org.coordinates && acceptPoint && !acceptPoint(org.coordinates)) {
            continue;
        }
        seen.add(id);
        extra.push({
            ...org,
            address: house.address,
            fullAddress: house.fullAddress ?? org.fullAddress,
            coordinates: house.coordinates ?? org.coordinates,
        });
    }
    return extra;
}

async function lookupHouse(
    session: MapsSession,
    address: string,
    near: LonLat,
    options: {
        fetch: typeof fetch;
        signal?: AbortSignal;
    }
): Promise<HouseHit | null> {
    try {
        const items = await searchToponyms(session, {
            query: address,
            ll: [near.lon, near.lat],
            spn: HOUSE_SPN,
            fetch: options.fetch,
            signal: options.signal,
        });
        return houseFromItems(items, near);
    } catch (error) {
        if (error instanceof MapsRequestError) return null;
        throw error;
    }
}

export function houseFromItems(
    items: SearchToponym[],
    near?: LonLat | null
): HouseHit | null {
    const houses: HouseHit[] = [];
    for (const item of items) {
        if (item.type !== "toponym" || item.kind !== "house") continue;
        if (typeof item.title !== "string" || !item.title.trim()) continue;
        const full =
            typeof item.address === "string" && item.address.trim()
                ? item.address.trim()
                : null;
        houses.push({
            id:
                typeof item.id === "string"
                    ? item.id
                    : item.id != null
                      ? String(item.id)
                      : null,
            address: item.title.trim(),
            fullAddress: full,
            coordinates: lonLat(item.coordinates),
            indoor: indoorItems(item),
        });
    }
    if (houses.length === 0) return null;
    if (!near) return houses[0] ?? null;
    let best = houses[0]!;
    let bestDist = Infinity;
    for (const house of houses) {
        if (!house.coordinates) continue;
        const dist = distance2(house.coordinates, near);
        if (dist < bestDist) {
            best = house;
            bestDist = dist;
        }
    }
    return best;
}

function indoorItems(item: SearchToponym): SearchBusiness[] {
    const items = item.businesses?.items;
    if (!Array.isArray(items)) return [];
    return items.filter((entry): entry is SearchBusiness => {
        return Boolean(entry && typeof entry === "object");
    });
}

function lonLat(value: unknown): LonLat | null {
    if (!Array.isArray(value) || value.length < 2) return null;
    const lon = Number(value[0]);
    const lat = Number(value[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    return { lon, lat };
}

function distance2(a: LonLat, b: LonLat): number {
    const dLon = a.lon - b.lon;
    const dLat = a.lat - b.lat;
    return dLon * dLon + dLat * dLat;
}

function meters(a: LonLat, b: LonLat): number {
    const midLat = ((a.lat + b.lat) / 2) * (Math.PI / 180);
    const mLon = (a.lon - b.lon) * 111320 * Math.cos(midLat);
    const mLat = (a.lat - b.lat) * 111320;
    return Math.hypot(mLon, mLat);
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

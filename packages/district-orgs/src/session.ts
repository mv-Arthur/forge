import type {
    Bounds,
    District,
    DistrictRef,
    GeoJsonGeometry,
} from "./types.ts";
import { asGeometry } from "./geometry.ts";
import type { SearchBusiness } from "./map-organization.ts";

export const DEFAULT_USER_AGENT =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export interface MapsSession {
    origin: string;
    csrfToken: string;
    cookieHeader: string;
    userAgent: string;
}

export interface ResolvedDistrict {
    district: District;
    geometry: GeoJsonGeometry | null;
    session: MapsSession;
}

export interface SearchPage {
    items: SearchBusiness[];
    totalEstimate: number | null;
}

interface PageState {
    config?: { csrfToken?: unknown };
    stack?: Array<{
        response?: {
            items?: unknown[];
        };
    }>;
}

interface ToponymItem {
    type?: unknown;
    id?: unknown;
    title?: unknown;
    address?: unknown;
    coordinates?: unknown;
    bounds?: unknown;
    seoname?: unknown;
    displayGeometry?: unknown;
}

export class MapsRequestError extends Error {
    statusCode: number | null;

    constructor(message: string, statusCode: number | null = null) {
        super(message);
        this.name = "MapsRequestError";
        this.statusCode = statusCode;
    }
}

export async function openDistrict(
    ref: DistrictRef,
    options: {
        fetch: typeof fetch;
        userAgent?: string;
        signal?: AbortSignal;
    }
): Promise<ResolvedDistrict> {
    const userAgent = options.userAgent ?? DEFAULT_USER_AGENT;
    const response = await options.fetch(ref.url, {
        headers: {
            Accept: "text/html",
            "Accept-Language": "ru-RU,ru;q=0.9",
            "User-Agent": userAgent,
        },
        signal: options.signal,
        redirect: "follow",
    });
    if (!response.ok) {
        throw new MapsRequestError(
            `District page HTTP ${response.status}`,
            response.status
        );
    }
    const html = await response.text();
    const state = extractPageState(html);
    const csrfToken = csrfFromState(state);
    const toponym = toponymFromState(state, ref.geoId);
    const cookies = cookieHeaderFrom(response.headers);
    const session: MapsSession = {
        origin: ref.origin,
        csrfToken,
        cookieHeader: cookies,
        userAgent,
    };
    return {
        district: districtFromToponym(toponym, ref),
        geometry: asGeometry(toponym.displayGeometry),
        session,
    };
}

export interface SearchToponym {
    type?: unknown;
    title?: unknown;
    address?: unknown;
    kind?: unknown;
    coordinates?: unknown;
    id?: unknown;
    businesses?: {
        items?: unknown;
        totalResultCount?: unknown;
    };
}

export async function searchBusinesses(
    session: MapsSession,
    params: {
        query: string;
        ll: [number, number];
        spn: [number, number];
        skip: number;
        pageSize: number;
        geoId?: string;
        fetch: typeof fetch;
        signal?: AbortSignal;
    }
): Promise<SearchPage> {
    const page = await searchMaps(session, {
        ...params,
        type: "biz",
        rspn: true,
    });
    return {
        items: page.items as SearchBusiness[],
        totalEstimate: page.totalEstimate,
    };
}

export async function searchToponyms(
    session: MapsSession,
    params: {
        query: string;
        ll: [number, number];
        spn: [number, number];
        fetch: typeof fetch;
        signal?: AbortSignal;
    }
): Promise<SearchToponym[]> {
    const page = await searchMaps(session, {
        query: params.query,
        ll: params.ll,
        spn: params.spn,
        skip: 0,
        pageSize: 5,
        type: "geo",
        rspn: false,
        fetch: params.fetch,
        signal: params.signal,
    });
    return page.items as SearchToponym[];
}

async function searchMaps(
    session: MapsSession,
    params: {
        query: string;
        ll: [number, number];
        spn: [number, number];
        skip: number;
        pageSize: number;
        type: "biz" | "geo";
        rspn: boolean;
        geoId?: string;
        fetch: typeof fetch;
        signal?: AbortSignal;
    }
): Promise<{ items: unknown[]; totalEstimate: number | null }> {
    const url = new URL("/maps/api/search", session.origin);
    url.searchParams.set("ajax", "1");
    url.searchParams.set("lang", "ru_RU");
    url.searchParams.set("csrfToken", session.csrfToken);
    url.searchParams.set("text", params.query);
    url.searchParams.set("type", params.type);
    url.searchParams.set("results", String(params.pageSize));
    url.searchParams.set("skip", String(params.skip));
    url.searchParams.set("ll", `${params.ll[0]},${params.ll[1]}`);
    url.searchParams.set("spn", `${params.spn[0]},${params.spn[1]}`);
    url.searchParams.set("rspn", params.rspn ? "1" : "0");
    url.searchParams.set("origin", "maps-search-form");
    if (params.geoId) {
        url.searchParams.set("ol", "geo");
        url.searchParams.set("oid", params.geoId);
    }

    const response = await params.fetch(url, {
        headers: {
            Accept: "application/json",
            "Accept-Language": "ru-RU,ru;q=0.9",
            "User-Agent": session.userAgent,
            "X-Requested-With": "XMLHttpRequest",
            Referer: `${session.origin}/maps/`,
            ...(session.cookieHeader ? { Cookie: session.cookieHeader } : {}),
        },
        signal: params.signal,
    });
    const text = await response.text();
    let body: unknown;
    try {
        body = JSON.parse(text) as unknown;
    } catch {
        throw new MapsRequestError(
            `Search returned non-JSON (HTTP ${response.status})`,
            response.status
        );
    }
    if (!response.ok || hasError(body)) {
        throw new MapsRequestError(
            errorMessage(body, response.status),
            response.status
        );
    }
    const data = (body as { data?: unknown }).data;
    if (!data || typeof data !== "object") {
        throw new MapsRequestError("Search response has no data");
    }
    const rec = data as {
        items?: unknown;
        totalResultCount?: unknown;
    };
    const items = Array.isArray(rec.items) ? rec.items : [];
    const total =
        typeof rec.totalResultCount === "number" ? rec.totalResultCount : null;
    return { items, totalEstimate: total };
}

function extractPageState(html: string): PageState {
    const scripts = html.matchAll(
        /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi
    );
    for (const match of scripts) {
        const raw = match[1]?.trim();
        if (!raw?.startsWith("{")) continue;
        try {
            const parsed = JSON.parse(raw) as PageState;
            if (parsed?.config) return parsed;
        } catch {
            continue;
        }
    }
    const csrfMatch = html.match(/"csrfToken":"([^"]+)"/);
    if (csrfMatch) {
        return { config: { csrfToken: csrfMatch[1] } };
    }
    throw new MapsRequestError("Yandex Maps page state not found");
}

function csrfFromState(state: PageState): string {
    const token = state.config?.csrfToken;
    if (typeof token !== "string" || !token) {
        throw new MapsRequestError("csrfToken missing on Maps page");
    }
    return token;
}

function toponymFromState(state: PageState, geoId: string): ToponymItem {
    const items = state.stack?.[0]?.response?.items;
    if (!Array.isArray(items)) {
        throw new MapsRequestError("District toponym missing on Maps page");
    }
    const match = items.find((item) => {
        if (!item || typeof item !== "object") return false;
        const rec = item as ToponymItem;
        return String(rec.id) === geoId;
    }) as ToponymItem | undefined;
    const fallback = items[0] as ToponymItem | undefined;
    const toponym = match ?? fallback;
    if (!toponym || typeof toponym !== "object") {
        throw new MapsRequestError("District toponym missing on Maps page");
    }
    return toponym;
}

function districtFromToponym(toponym: ToponymItem, ref: DistrictRef): District {
    const coordinates =
        asLonLat(toponym.coordinates) ??
        (ref.coordinates
            ? ([ref.coordinates.lon, ref.coordinates.lat] as [number, number])
            : null);
    const bounds = asBounds(toponym.bounds);
    if (!coordinates || !bounds) {
        throw new MapsRequestError(
            "District bounds/coordinates missing on Maps page"
        );
    }
    const title =
        typeof toponym.title === "string" && toponym.title
            ? toponym.title
            : (ref.slug ?? `geo ${ref.geoId}`);
    return {
        geoId: ref.geoId,
        title,
        slug: ref.slug,
        cityId: ref.cityId,
        citySlug: ref.citySlug,
        address: typeof toponym.address === "string" ? toponym.address : null,
        coordinates: { lon: coordinates[0], lat: coordinates[1] },
        bounds,
        origin: ref.origin,
        url: ref.url,
    };
}

function asLonLat(value: unknown): [number, number] | null {
    if (!Array.isArray(value) || value.length < 2) return null;
    const lon = Number(value[0]);
    const lat = Number(value[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    return [lon, lat];
}

function asBounds(value: unknown): Bounds | null {
    if (!Array.isArray(value) || value.length < 2) return null;
    const sw = asLonLat(value[0]);
    const ne = asLonLat(value[1]);
    if (!sw || !ne) return null;
    return [sw, ne];
}

function cookieHeaderFrom(headers: Headers): string {
    const chunks =
        typeof headers.getSetCookie === "function"
            ? headers.getSetCookie()
            : headerAll(headers, "set-cookie");
    const map = new Map<string, string>();
    for (const chunk of chunks) {
        const pair = chunk.split(";")[0];
        if (!pair) continue;
        const eq = pair.indexOf("=");
        if (eq <= 0) continue;
        map.set(pair.slice(0, eq), pair.slice(eq + 1));
    }
    return [...map.entries()]
        .map(([name, value]) => `${name}=${value}`)
        .join("; ");
}

function headerAll(headers: Headers, name: string): string[] {
    const value = headers.get(name);
    return value ? [value] : [];
}

function hasError(body: unknown): boolean {
    return Boolean(
        body &&
        typeof body === "object" &&
        "error" in body &&
        (body as { error?: unknown }).error
    );
}

function errorMessage(body: unknown, status: number): string {
    const error = (
        body as {
            error?: { data?: { message?: unknown }; message?: unknown };
        }
    ).error;
    const nested = error?.data?.message;
    if (typeof nested === "string" && nested) {
        return `Search error: ${nested}`;
    }
    const top = error?.message;
    if (typeof top === "string" && top) {
        const short = top.split("\n")[0] ?? top;
        return `Search error: ${short.slice(0, 180)}`;
    }
    return `Search HTTP ${status}`;
}

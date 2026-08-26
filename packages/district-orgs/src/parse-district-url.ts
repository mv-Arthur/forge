import type { DistrictRef, LonLat } from "./types.ts";

const MAPS_HOST = /^(?:www\.)?(?:maps\.)?yandex\.(?:ru|com|by|kz|uz|com\.tr)$/i;

const GEO_PATH = /^\/maps(?:\/(\d+)\/([^/]+))?\/geo\/([^/]+)\/(\d+)\/?$/;

export class DistrictUrlError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "DistrictUrlError";
    }
}

export function parseDistrictUrl(input: string): DistrictRef {
    const trimmed = input.trim();
    if (!trimmed) {
        throw new DistrictUrlError("District URL is empty");
    }

    let url: URL;
    try {
        url = new URL(trimmed);
    } catch {
        throw new DistrictUrlError(`Not a URL: ${trimmed}`);
    }

    if (!MAPS_HOST.test(url.hostname)) {
        throw new DistrictUrlError(`Not a Yandex Maps host: ${url.hostname}`);
    }

    const origin = `${url.protocol}//${url.hostname}`;
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const geoMatch = path.match(GEO_PATH);

    if (geoMatch) {
        const cityId = geoMatch[1] ?? null;
        const citySlug = geoMatch[2] ?? null;
        const slug = geoMatch[3];
        const geoId = geoMatch[4];
        const coordinates = parseLl(url.searchParams.get("ll"));
        const zoom = parseZoom(url.searchParams.get("z"));
        return {
            geoId,
            slug,
            cityId,
            citySlug,
            coordinates,
            zoom,
            origin,
            url: canonicalDistrictUrl({
                origin,
                cityId,
                citySlug,
                slug,
                geoId,
            }),
        };
    }

    const oid = url.searchParams.get("oid");
    const ol = url.searchParams.get("ol");
    if (oid && /^\d+$/.test(oid) && (ol === "geo" || ol === null)) {
        const coordinates = parseLl(url.searchParams.get("ll"));
        const zoom = parseZoom(url.searchParams.get("z"));
        return {
            geoId: oid,
            slug: null,
            cityId: null,
            citySlug: null,
            coordinates,
            zoom,
            origin,
            url: `${origin}/maps/?ol=geo&oid=${oid}`,
        };
    }

    throw new DistrictUrlError(
        "Expected a Yandex Maps district URL like /maps/{cityId}/{city}/geo/{slug}/{geoId}/"
    );
}

function canonicalDistrictUrl(parts: {
    origin: string;
    cityId: string | null;
    citySlug: string | null;
    slug: string;
    geoId: string;
}): string {
    if (parts.cityId && parts.citySlug) {
        return `${parts.origin}/maps/${parts.cityId}/${parts.citySlug}/geo/${parts.slug}/${parts.geoId}/`;
    }
    return `${parts.origin}/maps/geo/${parts.slug}/${parts.geoId}/`;
}

function parseLl(raw: string | null): LonLat | null {
    if (!raw) return null;
    const [lonText, latText] = raw.split(",");
    const lon = Number(lonText);
    const lat = Number(latText);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
    return { lon, lat };
}

function parseZoom(raw: string | null): number | null {
    if (!raw) return null;
    const zoom = Number(raw);
    return Number.isFinite(zoom) ? zoom : null;
}

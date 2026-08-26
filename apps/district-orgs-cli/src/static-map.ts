import { boundsCenter, boundsToSpn } from "@forge/district-orgs";
import type { Bounds } from "@forge/district-orgs";

const MAP_WIDTH = 650;
const MAP_HEIGHT = 450;

export interface MapMarker {
    lon: number;
    lat: number;
    label: number;
}

export function staticMapUrl(
    bounds: Bounds,
    markers: MapMarker[] = []
): string {
    const [lon, lat] = boundsCenter(bounds);
    const [spnLon, spnLat] = boundsToSpn(bounds);
    const url = new URL("https://static-maps.yandex.ru/1.x/");
    url.searchParams.set("ll", `${lon},${lat}`);
    url.searchParams.set("spn", `${spnLon},${spnLat}`);
    url.searchParams.set("size", `${MAP_WIDTH},${MAP_HEIGHT}`);
    url.searchParams.set("l", "map");
    url.searchParams.set("lang", "ru_RU");
    const pt = encodeMarkers(markers);
    if (pt) url.searchParams.set("pt", pt);
    return url.toString();
}

export function encodeMarkers(markers: MapMarker[]): string {
    return markers
        .filter(
            (marker) =>
                Number.isFinite(marker.lon) &&
                Number.isFinite(marker.lat) &&
                marker.label >= 1 &&
                marker.label <= 99
        )
        .map((marker) => `${marker.lon},${marker.lat},pmrds${marker.label}`)
        .join("~");
}

export async function fetchStaticMapPng(
    bounds: Bounds,
    http: typeof fetch,
    markers: MapMarker[] = []
): Promise<string> {
    const response = await http(staticMapUrl(bounds, markers), {
        headers: { Accept: "image/png" },
    });
    if (!response.ok) {
        throw new Error(`Static map HTTP ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:image/png;base64,${buffer.toString("base64")}`;
}

export { MAP_WIDTH, MAP_HEIGHT };

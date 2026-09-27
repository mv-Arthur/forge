import {
    boundsCenter,
    boundsToSpn,
    padBoundsToAspect,
    tightBounds,
} from "./geometry.ts";
import type { Bounds } from "./types.ts";

const MAP_WIDTH = 650;
const MAP_HEIGHT = 450;
const MIN_MAP = 200;

export interface MapMarker {
    lon: number;
    lat: number;
    label: number;
}

export function mapViewport(
    bounds: Bounds,
    markers: MapMarker[] = []
): { bounds: Bounds; width: number; height: number } {
    const points = markers
        .filter(
            (marker) =>
                Number.isFinite(marker.lon) &&
                Number.isFinite(marker.lat) &&
                marker.label >= 1 &&
                marker.label <= 99
        )
        .map((marker) => [marker.lon, marker.lat] as [number, number]);
    if (points.length === 0) {
        return {
            bounds: padBoundsToAspect(bounds, MAP_WIDTH / MAP_HEIGHT, 0.06),
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
        };
    }
    const tight = tightBounds(points);
    const [lon, lat] = boundsCenter(tight);
    const [spnLon, spnLat] = boundsToSpn(tight);
    const metersLon =
        Math.max(spnLon, 1e-9) * Math.cos((lat * Math.PI) / 180);
    const metersLat = Math.max(spnLat, 1e-9);
    const { width, height } = fitSize(metersLon / metersLat);
    return {
        bounds: padBoundsToAspect(tight, width / height, 0.08),
        width,
        height,
    };
}

export function staticMapUrl(
    bounds: Bounds,
    markers: MapMarker[] = []
): string {
    const view = mapViewport(bounds, markers);
    const [lon, lat] = boundsCenter(view.bounds);
    const [spnLon, spnLat] = boundsToSpn(view.bounds);
    const url = new URL("https://static-maps.yandex.ru/1.x/");
    url.searchParams.set("ll", `${lon},${lat}`);
    url.searchParams.set("spn", `${spnLon},${spnLat}`);
    url.searchParams.set("size", `${view.width},${view.height}`);
    url.searchParams.set("l", "map");
    url.searchParams.set("lang", "ru_RU");
    const pt = encodeMarkers(markers);
    if (pt) url.searchParams.set("pt", pt);
    return url.toString();
}

function fitSize(geoAspect: number): { width: number; height: number } {
    const ratio = Number.isFinite(geoAspect) && geoAspect > 0 ? geoAspect : 1;
    let width: number;
    let height: number;
    if (ratio >= MAP_WIDTH / MAP_HEIGHT) {
        width = MAP_WIDTH;
        height = Math.round(MAP_WIDTH / ratio);
    } else {
        height = MAP_HEIGHT;
        width = Math.round(MAP_HEIGHT * ratio);
    }
    return {
        width: clamp(width, MIN_MAP, MAP_WIDTH),
        height: clamp(height, MIN_MAP, MAP_HEIGHT),
    };
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
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

export interface FetchStaticMapOptions {
    retries?: number;
    retryDelayMs?: number;
    sleep?: (ms: number) => Promise<void>;
}

const DEFAULT_RETRIES = 5;
const DEFAULT_RETRY_DELAY_MS = 400;

export async function fetchStaticMapPng(
    bounds: Bounds,
    http: typeof fetch,
    markers: MapMarker[] = [],
    options: FetchStaticMapOptions = {}
): Promise<string> {
    const retries = options.retries ?? DEFAULT_RETRIES;
    const retryDelayMs = options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS;
    const sleep = options.sleep ?? defaultSleep;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            const response = await http(staticMapUrl(bounds, markers), {
                headers: { Accept: "image/png" },
            });
            if (response.ok) {
                const buffer = Buffer.from(await response.arrayBuffer());
                return `data:image/png;base64,${buffer.toString("base64")}`;
            }
            const error = new Error(`Static map HTTP ${response.status}`);
            if (!isRetryableStatus(response.status) || attempt === retries) {
                throw error;
            }
            lastError = error;
        } catch (error) {
            if (attempt === retries || !isRetryableError(error)) {
                throw error;
            }
            lastError =
                error instanceof Error ? error : new Error(String(error));
        }
        await sleep(retryDelayMs * 2 ** attempt);
    }

    throw lastError ?? new Error("Static map failed");
}

function isRetryableStatus(status: number): boolean {
    return status === 429 || (status >= 500 && status <= 599);
}

function isRetryableError(error: unknown): boolean {
    if (error instanceof TypeError) return true;
    const message = error instanceof Error ? error.message : String(error);
    if (/^Static map HTTP (\d+)$/.test(message)) {
        const status = Number(message.slice("Static map HTTP ".length));
        return isRetryableStatus(status);
    }
    return /fetch failed|network|ECONNRESET|ETIMEDOUT|socket/i.test(message);
}

function defaultSleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export { MAP_WIDTH, MAP_HEIGHT };

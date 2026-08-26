import type {
    Bounds,
    GeoJsonGeometry,
    GeoJsonGeometryCollection,
    GeoJsonMultiPolygon,
    GeoJsonPolygon,
} from "./types.ts";

export function boundsToSpn(bounds: Bounds): [number, number] {
    const [[minLon, minLat], [maxLon, maxLat]] = bounds;
    return [maxLon - minLon, maxLat - minLat];
}

export function boundsCenter(bounds: Bounds): [number, number] {
    const [[minLon, minLat], [maxLon, maxLat]] = bounds;
    return [(minLon + maxLon) / 2, (minLat + maxLat) / 2];
}

const MIN_SPAN = 0.002;

export function tightBounds(points: Array<[number, number]>): Bounds {
    let minLon = Infinity;
    let minLat = Infinity;
    let maxLon = -Infinity;
    let maxLat = -Infinity;
    for (const [lon, lat] of points) {
        minLon = Math.min(minLon, lon);
        minLat = Math.min(minLat, lat);
        maxLon = Math.max(maxLon, lon);
        maxLat = Math.max(maxLat, lat);
    }
    if (!Number.isFinite(minLon)) {
        return [
            [0, 0],
            [MIN_SPAN, MIN_SPAN],
        ];
    }
    if (maxLon === minLon) {
        minLon -= MIN_SPAN / 2;
        maxLon += MIN_SPAN / 2;
    }
    if (maxLat === minLat) {
        minLat -= MIN_SPAN / 2;
        maxLat += MIN_SPAN / 2;
    }
    return [
        [minLon, minLat],
        [maxLon, maxLat],
    ];
}

export function padBoundsToAspect(
    bounds: Bounds,
    aspect: number,
    edgePad = 0.16
): Bounds {
    const [lon, lat] = boundsCenter(bounds);
    let [spnLon, spnLat] = boundsToSpn(bounds);
    spnLon = Math.max(spnLon, MIN_SPAN);
    spnLat = Math.max(spnLat, MIN_SPAN);
    const inner = Math.max(0.4, 1 - 2 * Math.min(edgePad, 0.3));
    spnLon /= inner;
    spnLat /= inner;
    const ratio = aspect > 0 ? aspect : 1;
    const current = spnLon / spnLat;
    if (current < ratio) {
        spnLon = spnLat * ratio;
    } else if (current > ratio) {
        spnLat = spnLon / ratio;
    }
    return [
        [lon - spnLon / 2, lat - spnLat / 2],
        [lon + spnLon / 2, lat + spnLat / 2],
    ];
}

export function splitBounds(bounds: Bounds): [Bounds, Bounds] {
    const [[minLon, minLat], [maxLon, maxLat]] = bounds;
    const dLon = maxLon - minLon;
    const dLat = maxLat - minLat;
    if (dLon >= dLat) {
        const mid = (minLon + maxLon) / 2;
        return [
            [
                [minLon, minLat],
                [mid, maxLat],
            ],
            [
                [mid, minLat],
                [maxLon, maxLat],
            ],
        ];
    }
    const mid = (minLat + maxLat) / 2;
    return [
        [
            [minLon, minLat],
            [maxLon, mid],
        ],
        [
            [minLon, mid],
            [maxLon, maxLat],
        ],
    ];
}

export function quadrants(bounds: Bounds): Bounds[] {
    const [a, b] = splitBounds(bounds);
    return [...splitBounds(a), ...splitBounds(b)];
}

export function pointInBounds(
    point: [number, number],
    bounds: Bounds
): boolean {
    const [lon, lat] = point;
    const [[minLon, minLat], [maxLon, maxLat]] = bounds;
    return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
}

export function pointInGeometry(
    point: [number, number],
    geometry: GeoJsonGeometry | null,
    bounds: Bounds | null
): boolean {
    if (geometry) {
        return pointInGeoJson(point, geometry);
    }
    if (bounds) {
        return pointInBounds(point, bounds);
    }
    return true;
}

function pointInGeoJson(
    point: [number, number],
    geometry: GeoJsonGeometry
): boolean {
    if (geometry.type === "Polygon") {
        return pointInPolygon(point, geometry);
    }
    if (geometry.type === "MultiPolygon") {
        return pointInMultiPolygon(point, geometry);
    }
    if (geometry.type === "GeometryCollection") {
        return pointInCollection(point, geometry);
    }
    return false;
}

function pointInCollection(
    point: [number, number],
    geometry: GeoJsonGeometryCollection
): boolean {
    return geometry.geometries.some((part) => pointInGeoJson(point, part));
}

function pointInMultiPolygon(
    point: [number, number],
    geometry: GeoJsonMultiPolygon
): boolean {
    return geometry.coordinates.some((rings) =>
        pointInPolygon(point, { type: "Polygon", coordinates: rings })
    );
}

export function pointInPolygon(
    point: [number, number],
    polygon: GeoJsonPolygon
): boolean {
    const rings = polygon.coordinates;
    if (!rings.length) return false;
    const [outer, ...holes] = rings;
    if (!pointInRing(point, outer)) return false;
    return !holes.some((hole) => pointInRing(point, hole));
}

function pointInRing(point: [number, number], ring: number[][]): boolean {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i]?.[0];
        const yi = ring[i]?.[1];
        const xj = ring[j]?.[0];
        const yj = ring[j]?.[1];
        if (
            xi === undefined ||
            yi === undefined ||
            xj === undefined ||
            yj === undefined
        ) {
            continue;
        }
        const intersects =
            yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersects) inside = !inside;
    }
    return inside;
}

export function asGeometry(value: unknown): GeoJsonGeometry | null {
    if (!value || typeof value !== "object") return null;
    const rec = value as { type?: unknown };
    if (rec.type === "Polygon" || rec.type === "MultiPolygon") {
        return value as GeoJsonGeometry;
    }
    if (rec.type === "GeometryCollection") {
        const geometries = (value as GeoJsonGeometryCollection).geometries;
        if (!Array.isArray(geometries)) return null;
        return value as GeoJsonGeometry;
    }
    return null;
}

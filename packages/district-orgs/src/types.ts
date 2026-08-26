export interface LonLat {
    lon: number;
    lat: number;
}

/** Southwest, northeast; each point is [lon, lat]. */
export type Bounds = [[number, number], [number, number]];

export interface DistrictRef {
    geoId: string;
    slug: string | null;
    cityId: string | null;
    citySlug: string | null;
    coordinates: LonLat | null;
    zoom: number | null;
    origin: string;
    url: string;
}

export interface District {
    geoId: string;
    title: string;
    slug: string | null;
    cityId: string | null;
    citySlug: string | null;
    address: string | null;
    coordinates: LonLat;
    bounds: Bounds;
    origin: string;
    url: string;
}

export interface Organization {
    id: string;
    title: string;
    address: string | null;
    fullAddress: string | null;
    categories: string[];
    phones: string[];
    websites: string[];
    rating: number | null;
    reviewCount: number | null;
    coordinates: LonLat | null;
    url: string | null;
    workingTimeText: string | null;
    isOpenNow: boolean | null;
}

export interface ListDistrictOrgsOptions {
    query?: string;
    limit?: number;
    pageSize?: number;
    delayMs?: number;
    includeOutside?: boolean;
    densify?: boolean;
    exclude?: string[];
    fetch?: typeof fetch;
    userAgent?: string;
    signal?: AbortSignal;
}

export interface DistrictOrgsResult {
    district: District;
    query: string;
    totalEstimate: number | null;
    count: number;
    organizations: Organization[];
}

export interface AddressGroup {
    address: string;
    coordinates: LonLat;
    organizations: Organization[];
}

export interface DistrictSheet {
    index: number;
    bounds: Bounds;
    groups: AddressGroup[];
    organizations: Organization[];
}

export interface GeoJsonPolygon {
    type: "Polygon";
    coordinates: number[][][];
}

export interface GeoJsonMultiPolygon {
    type: "MultiPolygon";
    coordinates: number[][][][];
}

export interface GeoJsonGeometryCollection {
    type: "GeometryCollection";
    geometries: GeoJsonGeometry[];
}

export type GeoJsonGeometry =
    | GeoJsonPolygon
    | GeoJsonMultiPolygon
    | GeoJsonGeometryCollection;

import type { AddressGroup, LonLat, Organization } from "./types.ts";

export function isHouseAddress(address: string): boolean {
    const text = address.trim();
    if (!text || !/\d/.test(text)) return false;
    const withoutDistrict = text.replace(/район\s+\S+/gi, "");
    return /\d/.test(withoutDistrict);
}

export function groupByAddress(organizations: Organization[]): AddressGroup[] {
    const buckets = new Map<
        string,
        { address: string; orgs: Organization[] }
    >();
    for (const org of organizations) {
        const { key, address } = groupKey(org);
        const bucket = buckets.get(key);
        if (bucket) bucket.orgs.push(org);
        else buckets.set(key, { address, orgs: [org] });
    }
    const groups: AddressGroup[] = [];
    for (const { address, orgs } of buckets.values()) {
        groups.push({
            address,
            coordinates: centroid(orgs),
            organizations: orgs,
        });
    }
    groups.sort((a, b) => a.address.localeCompare(b.address, "ru"));
    return groups;
}

function groupKey(org: Organization): { key: string; address: string } {
    const address =
        (org.address ?? org.fullAddress ?? "без адреса").trim() ||
        "без адреса";
    if (isHouseAddress(address) || !org.coordinates) {
        return { key: `h:${address}`, address };
    }
    const point = `${org.coordinates.lon.toFixed(4)},${org.coordinates.lat.toFixed(4)}`;
    return { key: `p:${address}:${point}`, address };
}

function centroid(organizations: Organization[]): LonLat {
    const points = organizations
        .map((org) => org.coordinates)
        .filter((point): point is LonLat => point != null);
    if (points.length === 0) return { lon: 0, lat: 0 };
    if (points.length === 1) return points[0];
    const mean = {
        lon: points.reduce((sum, point) => sum + point.lon, 0) / points.length,
        lat: points.reduce((sum, point) => sum + point.lat, 0) / points.length,
    };
    let best = points[0];
    let bestDist = Infinity;
    for (const point of points) {
        const dLon = point.lon - mean.lon;
        const dLat = point.lat - mean.lat;
        const dist = dLon * dLon + dLat * dLat;
        if (dist < bestDist) {
            best = point;
            bestDist = dist;
        }
    }
    return { lon: best.lon, lat: best.lat };
}

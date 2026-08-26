import type { AddressGroup, LonLat, Organization } from "./types.ts";

export function groupByAddress(organizations: Organization[]): AddressGroup[] {
    const buckets = new Map<string, Organization[]>();
    for (const org of organizations) {
        const key = (org.address ?? org.fullAddress ?? "без адреса").trim();
        const list = buckets.get(key);
        if (list) list.push(org);
        else buckets.set(key, [org]);
    }
    const groups: AddressGroup[] = [];
    for (const [address, orgs] of buckets) {
        groups.push({
            address,
            coordinates: centroid(orgs),
            organizations: orgs,
        });
    }
    groups.sort((a, b) => a.address.localeCompare(b.address, "ru"));
    return groups;
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

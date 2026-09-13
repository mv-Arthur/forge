import type { AddressGroup } from "./types.ts";
import type { MapMarker } from "./static-map.ts";

export interface NumberedGroup {
    group: AddressGroup;
    start: number;
    index: number;
}

export interface AroundSides {
    top: NumberedGroup[];
    right: NumberedGroup[];
    bottom: NumberedGroup[];
    left: NumberedGroup[];
}

const NS_NAME_CAP = 10;
const WE_NAME_CAP = 40;

export function numberedGroups(groups: AddressGroup[]): NumberedGroup[] {
    return numberGroups(sortGroups(groups));
}

export function markersForGroups(groups: AddressGroup[]): MapMarker[] {
    return numberedGroups(groups)
        .filter(
            (item) =>
                item.group.coordinates.lon !== 0 ||
                item.group.coordinates.lat !== 0
        )
        .map((item) => ({
            lon: item.group.coordinates.lon,
            lat: item.group.coordinates.lat,
            label: item.index,
        }));
}

export function placeGroupsAroundMap(items: NumberedGroup[]): AroundSides {
    const sides: AroundSides = { top: [], right: [], bottom: [], left: [] };
    if (items.length === 0) return sides;
    const room: Record<keyof AroundSides, number> = {
        top: NS_NAME_CAP,
        bottom: NS_NAME_CAP,
        left: WE_NAME_CAP,
        right: WE_NAME_CAP,
    };
    const points = items
        .map((item) => item.group.coordinates)
        .filter((point) => point.lon !== 0 || point.lat !== 0);
    const center = centroid(points);
    for (const item of items) {
        packItem(item, preferredSide(item, items, center), sides, room);
    }
    return {
        top: orderSide("top", sides.top),
        right: orderSide("right", sides.right),
        bottom: orderSide("bottom", sides.bottom),
        left: orderSide("left", sides.left),
    };
}

function sortGroups(groups: AddressGroup[]): AddressGroup[] {
    return [...groups].sort((a, b) => {
        const lat = b.coordinates.lat - a.coordinates.lat;
        if (lat !== 0) return lat;
        return a.coordinates.lon - b.coordinates.lon;
    });
}

function numberGroups(groups: AddressGroup[]): NumberedGroup[] {
    let nameIndex = 1;
    return groups.map((group, i) => {
        const start = nameIndex;
        nameIndex += group.organizations.length;
        return { group, start, index: i + 1 };
    });
}

function preferredSide(
    item: NumberedGroup,
    items: NumberedGroup[],
    center: { lon: number; lat: number }
): keyof AroundSides {
    if (items.length === 1) return "left";
    if (items.length === 2) {
        const [west] = [...items].sort((a, b) => {
            const lon = a.group.coordinates.lon - b.group.coordinates.lon;
            if (lon !== 0) return lon;
            return b.group.coordinates.lat - a.group.coordinates.lat;
        });
        return item === west ? "left" : "right";
    }
    const side = sideFor(item.group.coordinates, center);
    if (
        item.group.organizations.length > NS_NAME_CAP &&
        (side === "top" || side === "bottom")
    ) {
        return item.group.coordinates.lon < center.lon ? "left" : "right";
    }
    return side;
}

function packItem(
    item: NumberedGroup,
    preferred: keyof AroundSides,
    sides: AroundSides,
    room: Record<keyof AroundSides, number>
): void {
    const order = uniqueSides([preferred, "left", "right", "top", "bottom"]);
    let orgs = item.group.organizations;
    let start = item.start;
    for (const side of order) {
        if (orgs.length === 0) break;
        const cap = room[side];
        if (cap <= 0) continue;
        const take = Math.min(orgs.length, cap);
        sides[side].push(chunkOf(item, orgs.slice(0, take), start));
        orgs = orgs.slice(take);
        start += take;
        room[side] -= take;
    }
    if (orgs.length > 0) {
        sides[preferred].push(chunkOf(item, orgs, start));
    }
}

function chunkOf(
    item: NumberedGroup,
    organizations: NumberedGroup["group"]["organizations"],
    start: number
): NumberedGroup {
    return {
        index: item.index,
        start,
        group: { ...item.group, organizations },
    };
}

function uniqueSides(
    sides: Array<keyof AroundSides>
): Array<keyof AroundSides> {
    const seen = new Set<keyof AroundSides>();
    const out: Array<keyof AroundSides> = [];
    for (const side of sides) {
        if (seen.has(side)) continue;
        seen.add(side);
        out.push(side);
    }
    return out;
}

function sideFor(
    point: { lon: number; lat: number },
    center: { lon: number; lat: number }
): keyof AroundSides {
    const mLat = (point.lat - center.lat) * 111320;
    const mLon =
        (point.lon - center.lon) *
        111320 *
        Math.cos((center.lat * Math.PI) / 180);
    if (Math.abs(mLat) < 1 && Math.abs(mLon) < 1) return "bottom";
    if (Math.abs(mLat) >= Math.abs(mLon)) {
        return mLat >= 0 ? "top" : "bottom";
    }
    return mLon >= 0 ? "right" : "left";
}

function orderSide(
    side: keyof AroundSides,
    items: NumberedGroup[]
): NumberedGroup[] {
    return [...items].sort((a, b) => {
        const ac = a.group.coordinates;
        const bc = b.group.coordinates;
        if (side === "left" || side === "right") {
            const lat = bc.lat - ac.lat;
            if (lat !== 0) return lat;
            return ac.lon - bc.lon;
        }
        const lon = ac.lon - bc.lon;
        if (lon !== 0) return lon;
        return bc.lat - ac.lat;
    });
}

function centroid(
    points: Array<{ lon: number; lat: number }>
): { lon: number; lat: number } {
    if (points.length === 0) return { lon: 0, lat: 0 };
    return {
        lon: points.reduce((sum, point) => sum + point.lon, 0) / points.length,
        lat: points.reduce((sum, point) => sum + point.lat, 0) / points.length,
    };
}

import { boundsToSpn, padBoundsToAspect, tightBounds } from "./geometry.ts";
import { groupByAddress } from "./group-address.ts";
import type {
    AddressGroup,
    Bounds,
    DistrictSheet,
    LonLat,
    Organization,
} from "./types.ts";

export const DEFAULT_MAX_PER_SHEET = 48;
const MAP_ASPECT = 650 / 450;
const MAX_CLUSTER_SPAN_M = 800;
const MAX_GROUP_SPAN_M = 700;
const MAX_GROUPS_PER_SHEET = 7;

export function tileOrganizations(
    organizations: Organization[],
    _bounds: Bounds,
    maxPerSheet: number = DEFAULT_MAX_PER_SHEET
): DistrictSheet[] {
    const cap = Math.max(1, Math.floor(maxPerSheet));
    const withCoords: Organization[] = [];
    const withoutCoords: Organization[] = [];
    for (const org of organizations) {
        if (org.coordinates) withCoords.push(org);
        else withoutCoords.push(org);
    }
    const geoSheets = splitGroups(groupByAddress(withCoords), cap);
    const leftover = fillSheets(geoSheets, withoutCoords, cap);
    if (leftover.length > 0) {
        const hostBounds = geoSheets[geoSheets.length - 1]?.bounds;
        for (let i = 0; i < leftover.length; i += cap) {
            geoSheets.push(makeSheet(leftover.slice(i, i + cap), hostBounds));
        }
    }
    const sheets = geoSheets.filter((sheet) => sheet.organizations.length > 0);
    return sheets.map((sheet, index) => ({
        ...sheet,
        index: index + 1,
        groups: pinGroups(sheet.organizations),
    }));
}

function splitGroups(groups: AddressGroup[], cap: number): DistrictSheet[] {
    if (groups.length === 0) return [];
    const expanded: AddressGroup[] = [];
    for (const group of groups) {
        const sized =
            group.organizations.length <= cap
                ? [group]
                : splitOversizedGroup(group, cap);
        for (const part of sized) expanded.push(...splitSpreadGroup(part));
    }
    const total = countOrgs(expanded);
    if (total <= cap && !needsSplit(expanded)) {
        return [makeSheet(flatOrgs(expanded))];
    }
    if (expanded.length < 2) {
        return [makeSheet(flatOrgs(expanded))];
    }
    const [first, second] = partitionGroupsByMedian(expanded);
    if (first.length === 0 || second.length === 0) {
        return chunkGroups(expanded, cap);
    }
    return [...splitGroups(first, cap), ...splitGroups(second, cap)];
}

function splitOversizedGroup(group: AddressGroup, cap: number): AddressGroup[] {
    if (group.organizations.length <= cap) return [group];
    const [first, second] = partitionOrgsByMedian(group.organizations);
    if (first.length === 0 || second.length === 0) {
        return chunkOrgs(group.organizations, cap).map((orgs) =>
            asAddressGroup(orgs, group.address)
        );
    }
    return [
        ...splitOversizedGroup(asAddressGroup(first, group.address), cap),
        ...splitOversizedGroup(asAddressGroup(second, group.address), cap),
    ];
}

function splitSpreadGroup(group: AddressGroup): AddressGroup[] {
    const points = group.organizations
        .map((org) => org.coordinates)
        .filter((point): point is LonLat => point != null);
    if (points.length < 2 || spanMeters(points) <= MAX_GROUP_SPAN_M) {
        return [group];
    }
    const [first, second] = partitionOrgsByMedian(group.organizations);
    if (first.length === 0 || second.length === 0) return [group];
    return [
        ...splitSpreadGroup(asAddressGroup(first, group.address)),
        ...splitSpreadGroup(asAddressGroup(second, group.address)),
    ];
}

function pinGroups(organizations: Organization[]): AddressGroup[] {
    return groupByAddress(organizations).flatMap(splitSpreadGroup);
}

function asAddressGroup(
    organizations: Organization[],
    address: string
): AddressGroup {
    const grouped = groupByAddress(organizations)[0];
    return (
        grouped ?? { address, coordinates: { lon: 0, lat: 0 }, organizations }
    );
}

function partitionGroupsByMedian(
    groups: AddressGroup[]
): [AddressGroup[], AddressGroup[]] {
    if (groups.length < 2) return [groups, []];
    const lons = groups.map((group) => group.coordinates.lon);
    const lats = groups.map((group) => group.coordinates.lat);
    const splitLon =
        Math.max(...lons) - Math.min(...lons) >=
        Math.max(...lats) - Math.min(...lats);
    const sorted = [...groups].sort((a, b) => {
        const av = splitLon ? a.coordinates.lon : a.coordinates.lat;
        const bv = splitLon ? b.coordinates.lon : b.coordinates.lat;
        return av - bv;
    });
    const mid = Math.max(1, Math.floor(sorted.length / 2));
    return [sorted.slice(0, mid), sorted.slice(mid)];
}

function partitionOrgsByMedian(
    organizations: Organization[]
): [Organization[], Organization[]] {
    const points = organizations.filter((org) => org.coordinates);
    if (points.length < 2) return [organizations, []];
    const lons = points.map((org) => (org.coordinates as LonLat).lon);
    const lats = points.map((org) => (org.coordinates as LonLat).lat);
    const splitLon =
        Math.max(...lons) - Math.min(...lons) >=
        Math.max(...lats) - Math.min(...lats);
    const sorted = [...organizations].sort((a, b) => {
        const av = splitLon
            ? (a.coordinates?.lon ?? 0)
            : (a.coordinates?.lat ?? 0);
        const bv = splitLon
            ? (b.coordinates?.lon ?? 0)
            : (b.coordinates?.lat ?? 0);
        return av - bv;
    });
    const mid = Math.max(1, Math.floor(sorted.length / 2));
    return [sorted.slice(0, mid), sorted.slice(mid)];
}

function chunkGroups(groups: AddressGroup[], cap: number): DistrictSheet[] {
    const sheets: DistrictSheet[] = [];
    let current: Organization[] = [];
    for (const group of groups) {
        if (
            current.length > 0 &&
            current.length + group.organizations.length > cap
        ) {
            sheets.push(makeSheet(current));
            current = [];
        }
        current.push(...group.organizations);
    }
    if (current.length > 0) sheets.push(makeSheet(current));
    return sheets;
}

function chunkOrgs(
    organizations: Organization[],
    cap: number
): Organization[][] {
    const chunks: Organization[][] = [];
    for (let i = 0; i < organizations.length; i += cap) {
        chunks.push(organizations.slice(i, i + cap));
    }
    return chunks;
}

function needsSplit(groups: AddressGroup[]): boolean {
    if (groups.length < 2) return false;
    if (groups.length > MAX_GROUPS_PER_SHEET) return true;
    return isSpreadOut(groups);
}

function isSpreadOut(groups: AddressGroup[]): boolean {
    return (
        spanMeters(groups.map((group) => group.coordinates)) >
        MAX_CLUSTER_SPAN_M
    );
}

function spanMeters(points: LonLat[]): number {
    if (points.length < 2) return 0;
    const bounds = tightBounds(points.map((point) => [point.lon, point.lat]));
    const [spnLon, spnLat] = boundsToSpn(bounds);
    const midLat = (bounds[0][1] + bounds[1][1]) / 2;
    const metersLon = spnLon * 111320 * Math.cos((midLat * Math.PI) / 180);
    const metersLat = spnLat * 111320;
    return Math.max(metersLon, metersLat);
}

function countOrgs(groups: AddressGroup[]): number {
    return groups.reduce((sum, group) => sum + group.organizations.length, 0);
}

function flatOrgs(groups: AddressGroup[]): Organization[] {
    return groups.flatMap((group) => group.organizations);
}

function makeSheet(
    organizations: Organization[],
    fallbackBounds?: Bounds
): DistrictSheet {
    const points: Array<[number, number]> = pinGroups(organizations).map(
        (group) => [group.coordinates.lon, group.coordinates.lat]
    );
    const bounds =
        points.length > 0
            ? padBoundsToAspect(tightBounds(points), MAP_ASPECT)
            : (fallbackBounds ??
              padBoundsToAspect(
                  [
                      [0, 0],
                      [0.002, 0.002],
                  ],
                  MAP_ASPECT
              ));
    return {
        index: 0,
        bounds,
        groups: [],
        organizations,
    };
}

function fillSheets(
    sheets: DistrictSheet[],
    extra: Organization[],
    cap: number
): Organization[] {
    const remaining = [...extra];
    for (const sheet of sheets) {
        const room = cap - sheet.organizations.length;
        if (room <= 0 || remaining.length === 0) continue;
        sheet.organizations.push(...remaining.splice(0, room));
    }
    return remaining;
}

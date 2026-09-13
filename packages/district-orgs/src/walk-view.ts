import { applyBlacklist, WALK_SHEET_EXCLUDE } from "./blacklist.ts";
import {
    markersForGroups,
    numberedGroups,
    placeGroupsAroundMap,
} from "./place-groups.ts";
import type { AroundSides } from "./place-groups.ts";
import { staticMapUrl } from "./static-map.ts";
import { tileOrganizations } from "./tile-orgs.ts";
import type { Bounds, District, DistrictOrgsResult } from "./types.ts";

export interface WalkSheetPage {
    index: number;
    bounds: Bounds;
    orgCount: number;
    mapUrl: string;
    sides: AroundSides;
}

export interface WalkView {
    district: District;
    query: string;
    count: number;
    sheets: WalkSheetPage[];
}

export function parseDistrictOrgsDump(raw: unknown): DistrictOrgsResult {
    if (
        !raw ||
        typeof raw !== "object" ||
        !("district" in raw) ||
        !("organizations" in raw) ||
        !Array.isArray((raw as DistrictOrgsResult).organizations)
    ) {
        throw new Error("Not a district-orgs dump");
    }
    const dump = raw as DistrictOrgsResult;
    dump.count = dump.organizations.length;
    return dump;
}

export function buildWalkView(
    result: DistrictOrgsResult,
    maxPerSheet?: number
): WalkView {
    const organizations = applyBlacklist(
        result.organizations,
        WALK_SHEET_EXCLUDE
    );
    const sheets = tileOrganizations(
        organizations,
        result.district.bounds,
        maxPerSheet
    );
    return {
        district: result.district,
        query: result.query,
        count: organizations.length,
        sheets: sheets.map((sheet) => ({
            index: sheet.index,
            bounds: sheet.bounds,
            orgCount: sheet.organizations.length,
            mapUrl: staticMapUrl(
                sheet.bounds,
                markersForGroups(sheet.groups)
            ),
            sides: placeGroupsAroundMap(numberedGroups(sheet.groups)),
        })),
    };
}

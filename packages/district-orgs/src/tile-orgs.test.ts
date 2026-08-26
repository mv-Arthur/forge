import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { tileOrganizations } from "./tile-orgs.ts";
import type { Bounds, Organization } from "./types.ts";

const BOUNDS: Bounds = [
    [37.58, 55.88],
    [37.66, 55.92],
];

function org(
    id: string,
    lon: number,
    lat: number,
    address = "дом"
): Organization {
    return {
        id,
        title: id,
        address,
        fullAddress: null,
        categories: [],
        phones: [],
        websites: [],
        rating: null,
        reviewCount: null,
        coordinates: { lon, lat },
        url: null,
        workingTimeText: null,
        isOpenNow: null,
    };
}

describe("tileOrganizations", () => {
    it("keeps a small set on one sheet", () => {
        const sheets = tileOrganizations(
            [org("a", 37.6, 55.9), org("b", 37.61, 55.9)],
            BOUNDS,
            80
        );
        assert.equal(sheets.length, 1);
        assert.equal(sheets[0]?.organizations.length, 2);
        assert.equal(sheets[0]?.index, 1);
    });

    it("splits until every sheet is at most maxPerSheet", () => {
        const orgs = [];
        for (let i = 0; i < 10; i += 1) {
            orgs.push(org(`w${i}`, 37.59, 55.89, "west"));
            orgs.push(org(`e${i}`, 37.65, 55.91, "east"));
        }
        const sheets = tileOrganizations(orgs, BOUNDS, 8);
        assert.ok(sheets.length >= 2);
        for (const sheet of sheets) {
            assert.ok(sheet.organizations.length <= 8);
        }
        const ids = new Set(
            sheets.flatMap((s) => s.organizations.map((o) => o.id))
        );
        assert.equal(ids.size, 20);
        for (const sheet of sheets) {
            const hasWest = sheet.organizations.some((item) =>
                item.id.startsWith("w")
            );
            const hasEast = sheet.organizations.some((item) =>
                item.id.startsWith("e")
            );
            assert.equal(hasWest && hasEast, false);
        }
    });

    it("uses a tight bbox smaller than the parent span", () => {
        const orgs = [];
        for (let i = 0; i < 20; i += 1) {
            orgs.push(
                org(`c${i}`, 37.6 + (i % 4) * 0.0004, 55.9 + (i % 5) * 0.0004)
            );
        }
        const sheets = tileOrganizations(orgs, BOUNDS, 48);
        assert.equal(sheets.length, 1);
        const [[minLon, minLat], [maxLon, maxLat]] =
            sheets[0]?.bounds ?? BOUNDS;
        const parent = [37.66 - 37.58, 55.92 - 55.88];
        assert.ok(maxLon - minLon < parent[0]);
        assert.ok(maxLat - minLat < parent[1]);
    });

    it("splits an oversized same-address group", () => {
        const orgs = [];
        for (let i = 0; i < 10; i += 1) {
            orgs.push(org(`m${i}`, 37.6 + i * 0.0002, 55.9, "mall"));
        }
        const sheets = tileOrganizations(orgs, BOUNDS, 8);
        assert.ok(sheets.length >= 2);
        for (const sheet of sheets) {
            assert.ok(sheet.organizations.length <= 8);
        }
    });

    it("does not let a same-address outlier explode the crop", () => {
        const sheets = tileOrganizations(
            [
                org("near-a", 37.6, 55.9, "generic"),
                org("near-b", 37.6005, 55.9004, "generic"),
                org("far", 37.64, 55.91, "generic"),
            ],
            BOUNDS,
            48
        );
        assert.ok(sheets.length >= 2);
        for (const sheet of sheets) {
            const [[minLon, minLat], [maxLon, maxLat]] = sheet.bounds;
            assert.ok(maxLon - minLon < 0.04);
            assert.ok(maxLat - minLat < 0.04);
        }
    });

    it("caps how many numbered houses share a crop", () => {
        const orgs = [];
        for (let i = 0; i < 10; i += 1) {
            orgs.push(org(`g${i}`, 37.6 + i * 0.00025, 55.9, `addr-${i}`));
        }
        const sheets = tileOrganizations(orgs, BOUNDS, 48);
        assert.ok(sheets.length >= 2);
        for (const sheet of sheets) {
            assert.ok(sheet.groups.length <= 7);
        }
        const ids = new Set(
            sheets.flatMap((sheet) =>
                sheet.organizations.map((item) => item.id)
            )
        );
        assert.equal(ids.size, 10);
    });

    it("does not put two distant houses on one walk sheet", () => {
        const sheets = tileOrganizations(
            [
                org("north", 37.59, 55.9, "north"),
                org("south", 37.59, 55.89, "south"),
            ],
            BOUNDS,
            48
        );
        assert.ok(sheets.length >= 2);
    });

    it("splits far-apart groups even when under the org cap", () => {
        const sheets = tileOrganizations(
            [
                org("west", 37.59, 55.89, "west"),
                org("east", 37.64, 55.91, "east"),
            ],
            BOUNDS,
            48
        );
        assert.ok(sheets.length >= 2);
        assert.equal(
            sheets.some((sheet) =>
                sheet.organizations.every((item) => item.id === "west")
            ),
            true
        );
        assert.equal(
            sheets.some((sheet) =>
                sheet.organizations.every((item) => item.id === "east")
            ),
            true
        );
    });

    it("does not send withoutCoords orgs to Null Island bbox", () => {
        const sheets = tileOrganizations(
            [
                org("a", 37.6, 55.9),
                org("b", 37.61, 55.9),
                org("c", 37.605, 55.901),
                {
                    ...org("d", 37.6, 55.9),
                    id: "d",
                    coordinates: null,
                },
            ],
            BOUNDS,
            48
        );
        const [[minLon]] = sheets[0]?.bounds ?? BOUNDS;
        assert.ok(minLon > 1);
    });
});

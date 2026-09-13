import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    markersForGroups,
    numberedGroups,
    placeGroupsAroundMap,
    renderSheetsHtml,
} from "./render-sheet.ts";
import type { District, DistrictSheet } from "@forge/district-orgs";

const DISTRICT: District = {
    geoId: "53211689",
    title: "район Бибирево",
    slug: "rayon_bibirevo",
    cityId: "213",
    citySlug: "moscow",
    address: null,
    coordinates: { lon: 37.6, lat: 55.9 },
    bounds: [
        [37.58, 55.88],
        [37.65, 55.92],
    ],
    origin: "https://yandex.ru",
    url: "https://yandex.ru/maps/",
};

const SHEET: DistrictSheet = {
    index: 1,
    bounds: DISTRICT.bounds,
    organizations: [
        {
            id: "1",
            title: "Кафе внутри",
            address: "ул. Лескова, 1",
            fullAddress: null,
            categories: ["Кафе"],
            phones: [],
            websites: [],
            rating: null,
            reviewCount: null,
            coordinates: { lon: 37.6, lat: 55.9 },
            url: null,
            workingTimeText: null,
            isOpenNow: null,
        },
    ],
    groups: [
        {
            address: "ул. Лескова, 1",
            coordinates: { lon: 37.6, lat: 55.9 },
            organizations: [
                {
                    id: "1",
                    title: "Кафе внутри",
                    address: "ул. Лескова, 1",
                    fullAddress: null,
                    categories: ["Кафе"],
                    phones: [],
                    websites: [],
                    rating: null,
                    reviewCount: null,
                    coordinates: { lon: 37.6, lat: 55.9 },
                    url: null,
                    workingTimeText: null,
                    isOpenNow: null,
                },
            ],
        },
    ],
};

describe("numberedGroups", () => {
    it("numbers north-first so list indexes match map markers", () => {
        const numbered = numberedGroups([
            {
                address: "south",
                coordinates: { lon: 37.6, lat: 55.89 },
                organizations: [SHEET.organizations[0]!],
            },
            {
                address: "north",
                coordinates: { lon: 37.6, lat: 55.91 },
                organizations: [SHEET.organizations[0]!],
            },
        ]);
        assert.equal(numbered[0]?.group.address, "north");
        assert.equal(numbered[0]?.index, 1);
        assert.equal(numbered[1]?.group.address, "south");
        assert.equal(numbered[1]?.index, 2);
        const markers = markersForGroups(numbered.map((item) => item.group));
        assert.deepEqual(
            markers.map((marker) => marker.label),
            [1, 2]
        );
        assert.equal(markers[0]?.lat, 55.91);
    });
});

describe("placeGroupsAroundMap", () => {
    it("puts houses on the matching side of the map", () => {
        const orgAt = (
            id: string,
            lon: number,
            lat: number
        ): DistrictSheet["organizations"][number] => ({
            id,
            title: id,
            address: id,
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
        });
        const numbered = numberedGroups([
            {
                address: "north",
                coordinates: { lon: 37.6, lat: 55.91 },
                organizations: [orgAt("north", 37.6, 55.91)],
            },
            {
                address: "east",
                coordinates: { lon: 37.62, lat: 55.9 },
                organizations: [orgAt("east", 37.62, 55.9)],
            },
            {
                address: "south",
                coordinates: { lon: 37.6, lat: 55.89 },
                organizations: [orgAt("south", 37.6, 55.89)],
            },
            {
                address: "west",
                coordinates: { lon: 37.58, lat: 55.9 },
                organizations: [orgAt("west", 37.58, 55.9)],
            },
        ]);
        const sides = placeGroupsAroundMap(numbered);
        assert.deepEqual(
            sides.top.map((item) => item.group.address),
            ["north"]
        );
        assert.deepEqual(
            sides.right.map((item) => item.group.address),
            ["east"]
        );
        assert.deepEqual(
            sides.bottom.map((item) => item.group.address),
            ["south"]
        );
        assert.deepEqual(
            sides.left.map((item) => item.group.address),
            ["west"]
        );
    });

    it("puts a single house to the left of the map", () => {
        const numbered = numberedGroups([
            {
                address: "only",
                coordinates: { lon: 37.6, lat: 55.9 },
                organizations: [SHEET.organizations[0]!],
            },
        ]);
        const sides = placeGroupsAroundMap(numbered);
        assert.deepEqual(
            sides.left.map((item) => item.group.address),
            ["only"]
        );
        assert.equal(sides.top.length, 0);
        assert.equal(sides.right.length, 0);
        assert.equal(sides.bottom.length, 0);
    });

    it("puts two houses left and right of the map, not above and below", () => {
        const numbered = numberedGroups([
            {
                address: "north",
                coordinates: { lon: 37.6, lat: 55.91 },
                organizations: [SHEET.organizations[0]!],
            },
            {
                address: "south",
                coordinates: { lon: 37.61, lat: 55.89 },
                organizations: [SHEET.organizations[0]!],
            },
        ]);
        const sides = placeGroupsAroundMap(numbered);
        assert.deepEqual(
            sides.left.map((item) => item.group.address),
            ["north"]
        );
        assert.deepEqual(
            sides.right.map((item) => item.group.address),
            ["south"]
        );
        assert.equal(sides.top.length, 0);
        assert.equal(sides.bottom.length, 0);
    });

    it("keeps a long house off the short north/south cells", () => {
        const orgs = Array.from({ length: 24 }, (_, i) => ({
            ...SHEET.organizations[0]!,
            id: String(i + 1),
            title: `Org ${i + 1}`,
        }));
        const numbered = numberedGroups([
            {
                address: "mall",
                coordinates: { lon: 37.6, lat: 55.91 },
                organizations: orgs,
            },
            {
                address: "south",
                coordinates: { lon: 37.6, lat: 55.89 },
                organizations: [SHEET.organizations[0]!],
            },
            {
                address: "east",
                coordinates: { lon: 37.62, lat: 55.9 },
                organizations: [SHEET.organizations[0]!],
            },
        ]);
        const sides = placeGroupsAroundMap(numbered);
        const topNames = sides.top.reduce(
            (sum, item) => sum + item.group.organizations.length,
            0
        );
        const mallOnTop = sides.top.some((item) => item.group.address === "mall");
        assert.equal(mallOnTop, false);
        assert.ok(topNames <= 10);
        const sideNames =
            sides.left.reduce(
                (sum, item) => sum + item.group.organizations.length,
                0
            ) +
            sides.right.reduce(
                (sum, item) => sum + item.group.organizations.length,
                0
            );
        assert.ok(sideNames >= 24);
    });

    it("splits a list that does not fit in one column", () => {
        const orgs = Array.from({ length: 45 }, (_, i) => ({
            ...SHEET.organizations[0]!,
            id: String(i + 1),
            title: `Org ${i + 1}`,
        }));
        const numbered = numberedGroups([
            {
                address: "mall",
                coordinates: { lon: 37.6, lat: 55.9 },
                organizations: orgs,
            },
        ]);
        const sides = placeGroupsAroundMap(numbered);
        const left = sides.left.reduce(
            (sum, item) => sum + item.group.organizations.length,
            0
        );
        const rest =
            sides.right.reduce(
                (sum, item) => sum + item.group.organizations.length,
                0
            ) +
            sides.top.reduce(
                (sum, item) => sum + item.group.organizations.length,
                0
            ) +
            sides.bottom.reduce(
                (sum, item) => sum + item.group.organizations.length,
                0
            );
        assert.equal(left, 40);
        assert.equal(rest, 5);
        assert.equal(
            [...sides.left, ...sides.right, ...sides.top, ...sides.bottom].every(
                (item) => item.index === 1
            ),
            true
        );
    });
});

describe("renderSheetsHtml", () => {
    it("prints names and address groups on a single sheet", () => {
        const html = renderSheetsHtml({
            district: DISTRICT,
            sheets: [SHEET],
            maps: ["data:image/png;base64,aaa"],
            query: "",
        });
        assert.match(html, /Кафе внутри/);
        assert.match(html, /ул\. Лескова, 1/);
        assert.match(html, /лист 1\/1/);
        assert.match(html, /size: A4 portrait/);
        assert.doesNotMatch(html, /landscape/);
        assert.equal(html.includes('class="sheet"'), true);
        assert.match(html, /class="cell cell-map"/);
        assert.match(html, /class="cell cell-n"/);
        assert.match(html, /class="cell cell-w"/);
        assert.match(html, /class="cell cell-e"/);
        assert.match(html, /class="cell cell-s"/);
        assert.doesNotMatch(html, /<svg/);
        assert.doesNotMatch(html, /class="pin"/);
    });

    it("prints two-digit name indexes as idx spans", () => {
        const orgs = Array.from({ length: 10 }, (_, i) => ({
            id: String(i + 1),
            title: `Org ${i + 1}`,
            address: "ул. Лескова, 1",
            fullAddress: null,
            categories: [],
            phones: [],
            websites: [],
            rating: null,
            reviewCount: null,
            coordinates: { lon: 37.6, lat: 55.9 },
            url: null,
            workingTimeText: null,
            isOpenNow: null,
        }));
        const html = renderSheetsHtml({
            district: DISTRICT,
            sheets: [
                {
                    index: 1,
                    bounds: DISTRICT.bounds,
                    organizations: orgs,
                    groups: [
                        {
                            address: "ул. Лескова, 1",
                            coordinates: { lon: 37.6, lat: 55.9 },
                            organizations: orgs,
                        },
                    ],
                },
            ],
            maps: [""],
            query: "",
        });
        assert.match(html, /<span class="idx">10\.<\/span>/);
    });
});

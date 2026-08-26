import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    markersForGroups,
    numberedGroups,
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

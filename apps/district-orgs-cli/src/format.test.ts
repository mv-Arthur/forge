import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DistrictOrgsResult } from "@forge/district-orgs";
import { formatResult } from "./format.ts";

const RESULT: DistrictOrgsResult = {
    district: {
        geoId: "53211689",
        title: "район Бибирево",
        slug: "rayon_bibirevo",
        cityId: "213",
        citySlug: "moscow",
        address: "Москва, район Бибирево",
        coordinates: { lon: 37.6, lat: 55.9 },
        bounds: [
            [37.58, 55.88],
            [37.65, 55.92],
        ],
        origin: "https://yandex.ru",
        url: "https://yandex.ru/maps/213/moscow/geo/rayon_bibirevo/53211689/",
    },
    query: "",
    totalEstimate: 2,
    count: 2,
    organizations: [
        {
            id: "1",
            title: "Кафе",
            address: "ул. Лескова, 1",
            fullAddress: "Москва, улица Лескова, 1",
            categories: ["Кафе"],
            phones: ["+7 (495) 000-00-00"],
            websites: [],
            rating: 4,
            reviewCount: 3,
            coordinates: { lon: 37.6, lat: 55.9 },
            url: "https://yandex.ru/maps/org/kafe/1/",
            workingTimeText: null,
            isOpenNow: true,
        },
        {
            id: "2",
            title: "Аптека",
            address: "ул. Плещеева, 2",
            fullAddress: null,
            categories: ["Аптека"],
            phones: [],
            websites: ["https://example.com"],
            rating: null,
            reviewCount: null,
            coordinates: { lon: 37.61, lat: 55.9 },
            url: "https://yandex.ru/maps/org/apteka/2/",
            workingTimeText: null,
            isOpenNow: null,
        },
    ],
};

describe("formatResult", () => {
    it("prints pretty JSON", () => {
        const text = formatResult(RESULT, "json");
        const parsed = JSON.parse(text) as DistrictOrgsResult;
        assert.equal(parsed.count, 2);
        assert.equal(parsed.organizations[0]?.title, "Кафе");
    });

    it("prints one JSON object per line", () => {
        const lines = formatResult(RESULT, "ndjson").trim().split("\n");
        assert.equal(lines.length, 2);
        assert.equal(JSON.parse(lines[0] ?? "{}").id, "1");
    });

    it("prints a table with the district title", () => {
        const text = formatResult(RESULT, "table");
        assert.match(text, /район Бибирево/);
        assert.match(text, /Кафе/);
        assert.match(text, /Аптека/);
        assert.match(text, /ул\. Лескова, 1/);
    });
});

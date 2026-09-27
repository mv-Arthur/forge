import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildWalkView, parseDistrictOrgsDump } from "./walk-view.ts";
import type { DistrictOrgsResult, Organization } from "./types.ts";

function org(
    id: string,
    title: string,
    address: string,
    lon: number,
    lat: number,
    categories: string[] = ["Кафе"]
): Organization {
    return {
        id,
        title,
        address,
        fullAddress: null,
        categories,
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

const RESULT: DistrictOrgsResult = {
    district: {
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
    },
    query: "",
    totalEstimate: 2,
    count: 3,
    organizations: [
        org("1", "Кафе внутри", "ул. Лескова, 1", 37.6, 55.9),
        org("2", "Площадка", "ул. Лескова, 1", 37.6, 55.9, [
            "Детская площадка",
        ]),
        org("3", "Аптека", "ул. Плещеева, 4", 37.61, 55.89),
    ],
};

describe("parseDistrictOrgsDump", () => {
    it("rejects a non-dump", () => {
        assert.throws(() => parseDistrictOrgsDump({ foo: 1 }), /Not a district-orgs dump/);
    });
});

describe("buildWalkView", () => {
    it("drops walk-sheet furniture and builds paged map URLs", () => {
        const view = buildWalkView(RESULT, 48);
        assert.equal(view.count, 2);
        assert.equal(view.district.title, "район Бибирево");
        assert.ok(view.sheets.length >= 1);
        assert.match(view.sheets[0]?.mapUrl ?? "", /static-maps\.yandex\.ru/);
        const map = new URL(view.sheets[0]?.mapUrl ?? "https://invalid/");
        assert.ok(map.searchParams.get("pt"));
        assert.ok(map.searchParams.get("spn"));
        assert.match(map.searchParams.get("size") ?? "", /^\d+,\d+$/);
        const titles = view.sheets.flatMap((sheet) =>
            [...sheet.sides.top, ...sheet.sides.left, ...sheet.sides.right, ...sheet.sides.bottom]
                .flatMap((item) => item.group.organizations.map((row) => row.title))
        );
        assert.equal(titles.includes("Кафе внутри"), true);
        assert.equal(titles.includes("Площадка"), false);
    });
});

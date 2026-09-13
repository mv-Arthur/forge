import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { groupByAddress, isHouseAddress } from "./group-address.ts";
import type { Organization } from "./types.ts";

function org(title: string, address: string | null): Organization {
    return {
        id: title,
        title,
        address,
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
    };
}

describe("groupByAddress", () => {
    it("groups organizations that share an address", () => {
        const groups = groupByAddress([
            org("A", "ул. Лескова, 16"),
            org("B", "ул. Лескова, 16"),
            org("C", "ул. Плещеева, 4"),
        ]);
        assert.equal(groups.length, 2);
        const leskova = groups.find((g) => g.address === "ул. Лескова, 16");
        assert.equal(leskova?.organizations.length, 2);
    });

    it("pins a group at a real organization coordinate, not the mean", () => {
        const groups = groupByAddress([
            {
                ...org("A", "Лескова, 16"),
                coordinates: { lon: 37.6, lat: 55.9 },
            },
            {
                ...org("B", "Лескова, 16"),
                coordinates: { lon: 37.6, lat: 55.9 },
            },
            {
                ...org("C", "Лескова, 16"),
                coordinates: { lon: 37.62, lat: 55.9 },
            },
        ]);
        assert.deepEqual(groups[0]?.coordinates, { lon: 37.6, lat: 55.9 });
    });

    it("does not merge district-level addresses across the map", () => {
        const district =
            "Москва, Северо-Восточный административный округ, район Бибирево";
        const groups = groupByAddress([
            {
                ...org("метро", district),
                coordinates: { lon: 37.603, lat: 55.884 },
            },
            {
                ...org("ручей", district),
                coordinates: { lon: 37.597, lat: 55.906 },
            },
        ]);
        assert.equal(groups.length, 2);
        assert.equal(isHouseAddress(district), false);
        assert.equal(isHouseAddress("улица Лескова, 8"), true);
    });
});

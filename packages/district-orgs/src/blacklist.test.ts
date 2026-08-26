import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { applyBlacklist } from "./blacklist.ts";
import type { Organization } from "./types.ts";

function org(title: string, categories: string[], id = title): Organization {
    return {
        id,
        title,
        address: null,
        fullAddress: null,
        categories,
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

describe("applyBlacklist", () => {
    it("keeps everything when the list is empty", () => {
        const orgs = [org("МФЦ", ["МФЦ"]), org("Кафе", ["Кафе"])];
        assert.equal(applyBlacklist(orgs, []).length, 2);
    });

    it("drops by category or title substring", () => {
        const orgs = [
            org("Центр госуслуг", ["МФЦ"]),
            org("Eurospar", ["Супермаркет"]),
            org("Поликлиника № 125", ["Детская поликлиника"]),
        ];
        const kept = applyBlacklist(orgs, ["мфц", "поликлиника"]);
        assert.deepEqual(
            kept.map((item) => item.title),
            ["Eurospar"]
        );
    });
});

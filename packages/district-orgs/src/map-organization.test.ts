import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isBusiness, mapOrganization } from "./map-organization.ts";

const ITEM = {
    type: "business",
    id: "1403291512",
    title: "Центр госуслуг Мои Документы",
    address: "Мелиховская ул., 4А",
    fullAddress: "Москва, Мелиховская улица, 4А",
    coordinates: [37.604873, 55.898551],
    phones: [{ number: "+7 (495) 777-77-77", value: "+74957777777" }],
    urls: ["https://md.mos.ru/"],
    categories: [{ name: "МФЦ" }],
    ratingData: { ratingValue: 4.2, reviewCount: 12 },
    seoname: "tsentr_gosuslug_moi_dokumenty",
    workingTimeText: "ежедневно, 08:00–20:00",
    currentWorkingStatus: { isOpenNow: true },
};

describe("mapOrganization", () => {
    it("maps a search business into a public organization", () => {
        const org = mapOrganization(ITEM, "https://yandex.ru");
        assert.equal(org.id, "1403291512");
        assert.equal(org.title, "Центр госуслуг Мои Документы");
        assert.deepEqual(org.phones, ["+7 (495) 777-77-77"]);
        assert.deepEqual(org.websites, ["https://md.mos.ru/"]);
        assert.deepEqual(org.categories, ["МФЦ"]);
        assert.equal(org.rating, 4.2);
        assert.equal(org.reviewCount, 12);
        assert.equal(org.isOpenNow, true);
        assert.equal(
            org.url,
            "https://yandex.ru/maps/org/tsentr_gosuslug_moi_dokumenty/1403291512/"
        );
        assert.deepEqual(org.coordinates, { lon: 37.604873, lat: 55.898551 });
    });

    it("treats zero rating as missing", () => {
        const org = mapOrganization(
            {
                ...ITEM,
                ratingData: { ratingValue: 0, reviewCount: 0 },
            },
            "https://yandex.ru"
        );
        assert.equal(org.rating, null);
        assert.equal(org.reviewCount, null);
    });

    it("rejects non-business items", () => {
        assert.equal(isBusiness({ type: "toponym", id: "1" }), false);
        assert.equal(isBusiness(ITEM), true);
    });
});

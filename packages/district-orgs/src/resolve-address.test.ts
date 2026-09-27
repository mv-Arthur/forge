import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { houseFromItems, resolveHouseAddresses } from "./resolve-address.ts";
import type { MapsSession } from "./session.ts";
import type { Organization } from "./types.ts";

const SESSION: MapsSession = {
    origin: "https://yandex.ru",
    csrfToken: "csrf",
    cookieHeader: "",
    userAgent: "test",
};

function org(title: string, address: string): Organization {
    return {
        id: title,
        title,
        address,
        fullAddress: `Москва, ${address}`,
        categories: [],
        phones: [],
        websites: [],
        rating: null,
        reviewCount: null,
        coordinates: { lon: 37.59, lat: 55.891 },
        url: null,
        workingTimeText: null,
        isOpenNow: null,
    };
}

describe("houseFromItems", () => {
    it("takes the first house toponym", () => {
        const house = houseFromItems([
            { type: "toponym", kind: "street", title: "Шенкурский проезд" },
            {
                type: "toponym",
                kind: "house",
                title: "Шенкурский проезд, 3",
                address: "Москва, Шенкурский проезд, 3",
            },
        ]);
        assert.equal(house?.address, "Шенкурский проезд, 3");
        assert.equal(house?.fullAddress, "Москва, Шенкурский проезд, 3");
        assert.deepEqual(house?.indoor, []);
    });

    it("ignores non-houses", () => {
        assert.equal(
            houseFromItems([
                { type: "toponym", kind: "metro", title: "Алтуфьево" },
            ]),
            null
        );
    });
});

describe("resolveHouseAddresses", () => {
    it("rewrites a fake house letter to the real house", async () => {
        const fetchMock: typeof fetch = async (input) => {
            const url = new URL(String(input));
            assert.equal(url.searchParams.get("type"), "geo");
            const text = url.searchParams.get("text") ?? "";
            const title = text.includes("3А")
                ? "Шенкурский проезд, 3"
                : "Шенкурский проезд, 3Б";
            return new Response(
                JSON.stringify({
                    data: {
                        items: [
                            {
                                type: "toponym",
                                kind: "house",
                                title,
                                address: `Москва, ${title}`,
                            },
                        ],
                    },
                }),
                { status: 200 }
            );
        };
        const progress: string[] = [];
        const resolved = await resolveHouseAddresses(
            [
                org("Темп", "Шенкурский пр., 3А"),
                org("Диана", "Шенкурский пр., 3Б"),
            ],
            SESSION,
            {
                fetch: fetchMock,
                delayMs: 0,
                onProgress: (message) => progress.push(message),
            }
        );
        assert.equal(resolved[0]?.address, "Шенкурский проезд, 3");
        assert.equal(resolved[1]?.address, "Шенкурский проезд, 3Б");
        assert.deepEqual(progress, ["house 1/2", "house 2/2"]);
    });

    it("adds organizations listed inside the house", async () => {
        const fetchMock: typeof fetch = async () =>
            new Response(
                JSON.stringify({
                    data: {
                        items: [
                            {
                                type: "toponym",
                                kind: "house",
                                title: "улица Плещеева, 4к1с5",
                                address: "Москва, улица Плещеева, 4к1с5",
                                coordinates: [37.6048, 55.8829],
                                businesses: {
                                    totalResultCount: 2,
                                    items: [
                                        {
                                            type: "business",
                                            id: "already",
                                            title: "Плещеев",
                                            address: "ул. Плещеева, 4к1с5",
                                            coordinates: [37.6048, 55.8829],
                                        },
                                        {
                                            type: "business",
                                            id: "dostuk-1",
                                            title: "Достук",
                                            address: "ул. Плещеева, 4к1с5",
                                            coordinates: [37.6049, 55.8828],
                                            categories: [{ name: "Чайхана" }],
                                        },
                                        {
                                            type: "business",
                                            id: "other-school",
                                            title: "Школа в другом районе",
                                            address: "Алтуфьевское шоссе, 94",
                                            coordinates: [37.49, 55.82],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                }),
                { status: 200 }
            );
        const resolved = await resolveHouseAddresses(
            [
                {
                    ...org("Плещеев", "ул. Плещеева, 4, корп. 1, стр. 5"),
                    id: "already",
                    coordinates: { lon: 37.6048, lat: 55.8829 },
                },
            ],
            SESSION,
            { fetch: fetchMock, delayMs: 0 }
        );
        const titles = resolved.map((item) => item.title).sort();
        assert.deepEqual(titles, ["Достук", "Плещеев"]);
        assert.equal(
            resolved.find((item) => item.title === "Достук")?.address,
            "улица Плещеева, 4к1с5"
        );
    });

    it("keeps the original address when geocode fails", async () => {
        const fetchMock: typeof fetch = async () =>
            new Response(JSON.stringify({ data: { items: [] } }), {
                status: 200,
            });
        const resolved = await resolveHouseAddresses(
            [org("Темп", "Шенкурский пр., 3А")],
            SESSION,
            { fetch: fetchMock, delayMs: 0 }
        );
        assert.equal(resolved[0]?.address, "Шенкурский пр., 3А");
    });

    it("does not pull indoor orgs from a house outside the search point", async () => {
        const fetchMock: typeof fetch = async () =>
            new Response(
                JSON.stringify({
                    data: {
                        items: [
                            {
                                type: "toponym",
                                kind: "house",
                                title: "МКАД, 47-й километр, вл2",
                                address: "Москва, МКАД, 47-й километр, вл2",
                                coordinates: [37.43, 55.66],
                                businesses: {
                                    items: [
                                        {
                                            type: "business",
                                            id: "govorovo-1",
                                            title: "Бизнес-центр Говорово",
                                            address: "МКАД, 47-й километр, вл2",
                                            coordinates: [37.4301, 55.6601],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                }),
                { status: 200 }
            );
        const source = org("Ajm", "МКАД, 47-й километр, вл2");
        const resolved = await resolveHouseAddresses([source], SESSION, {
            fetch: fetchMock,
            delayMs: 0,
            acceptPoint: (point) =>
                point.lat > 55.85 && point.lon > 37.55,
        });
        assert.equal(resolved.length, 1);
        assert.equal(resolved[0]?.title, "Ajm");
        assert.equal(resolved[0]?.address, "МКАД, 47-й километр, вл2");
        assert.deepEqual(resolved[0]?.coordinates, source.coordinates);
    });
});

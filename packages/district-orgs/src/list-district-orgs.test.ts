import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { listDistrictOrgs } from "./list-district-orgs.ts";

const DISTRICT_URL =
    "https://yandex.ru/maps/213/moscow/geo/rayon_bibirevo/53211689/";

const POLYGON = {
    type: "Polygon",
    coordinates: [
        [
            [37.58, 55.88],
            [37.65, 55.88],
            [37.65, 55.92],
            [37.58, 55.92],
            [37.58, 55.88],
        ],
    ],
};

const PAGE_STATE = {
    config: { csrfToken: "csrf-token:1" },
    stack: [
        {
            response: {
                items: [
                    {
                        type: "toponym",
                        id: "53211689",
                        title: "район Бибирево",
                        address:
                            "Москва, Северо-Восточный административный округ, район Бибирево",
                        coordinates: [37.607673, 55.894495],
                        bounds: [
                            [37.586643, 55.879339],
                            [37.644001, 55.913631],
                        ],
                        displayGeometry: POLYGON,
                    },
                ],
            },
        },
    ],
};

function htmlPage(): string {
    return `<!doctype html><html><head><title>район Бибирево</title></head><body><script type="application/json">${JSON.stringify(PAGE_STATE)}</script></body></html>`;
}

function business(id: string, lon: number, lat: number, title: string) {
    return {
        type: "business",
        id,
        title,
        address: "ул. Лескова, 1",
        fullAddress: "Москва, улица Лескова, 1",
        coordinates: [lon, lat],
        categories: [{ name: "Кафе" }],
        phones: [{ number: "+7 (495) 000-00-00" }],
        urls: [],
        seoname: title.toLowerCase(),
        ratingData: { ratingValue: 4, reviewCount: 3 },
        workingTimeText: null,
        currentWorkingStatus: { isOpenNow: false },
    };
}

describe("listDistrictOrgs", () => {
    it("opens the district page, paginates search, and drops points outside the polygon", async () => {
        const urls: string[] = [];
        const fetchMock: typeof fetch = async (input) => {
            const url = String(input);
            urls.push(url);
            if (url.includes("/geo/")) {
                return new Response(htmlPage(), {
                    status: 200,
                    headers: {
                        "content-type": "text/html",
                        "set-cookie": "yandexuid=1; Path=/",
                    },
                });
            }
            const parsed = new URL(url);
            assert.equal(parsed.searchParams.get("csrfToken"), "csrf-token:1");
            if (parsed.searchParams.get("type") === "geo") {
                const text =
                    parsed.searchParams.get("text") ?? "ул. Лескова, 1";
                return new Response(
                    JSON.stringify({
                        data: {
                            items: [
                                {
                                    type: "toponym",
                                    kind: "house",
                                    title: text,
                                    address: `Москва, ${text}`,
                                    coordinates: [37.6, 55.9],
                                },
                            ],
                        },
                    }),
                    { status: 200 }
                );
            }
            assert.equal(parsed.searchParams.get("type"), "biz");
            assert.equal(parsed.searchParams.get("rspn"), "1");
            const skip = Number(parsed.searchParams.get("skip"));
            const items =
                skip === 0
                    ? [
                          business("1", 37.6, 55.9, "InsideCafe"),
                          business("2", 37.0, 55.0, "OutsideCafe"),
                      ]
                    : [];
            return new Response(
                JSON.stringify({
                    data: { items, totalResultCount: 2 },
                }),
                { status: 200, headers: { "content-type": "application/json" } }
            );
        };

        const result = await listDistrictOrgs(DISTRICT_URL, {
            fetch: fetchMock,
            delayMs: 0,
            limit: 50,
        });

        assert.equal(result.district.title, "район Бибирево");
        assert.equal(result.district.geoId, "53211689");
        assert.equal(result.count, 1);
        assert.equal(result.organizations[0]?.id, "1");
        assert.equal(result.organizations[0]?.title, "InsideCafe");
        assert.equal(
            urls.some((url) => url.includes("/maps/api/search")),
            true
        );
    });

    it("keeps outside points when includeOutside is set", async () => {
        const fetchMock: typeof fetch = async (input) => {
            const url = String(input);
            if (url.includes("/geo/")) {
                return new Response(htmlPage(), { status: 200 });
            }
            return new Response(
                JSON.stringify({
                    data: {
                        items: [
                            business("1", 37.6, 55.9, "InsideCafe"),
                            business("2", 37.0, 55.0, "OutsideCafe"),
                        ],
                        totalResultCount: 2,
                    },
                }),
                { status: 200 }
            );
        };

        const result = await listDistrictOrgs(DISTRICT_URL, {
            fetch: fetchMock,
            delayMs: 0,
            includeOutside: true,
        });
        assert.equal(result.count, 2);
    });

    it("applies a category blacklist", async () => {
        const fetchMock: typeof fetch = async (input) => {
            const url = String(input);
            if (url.includes("/geo/")) {
                return new Response(htmlPage(), { status: 200 });
            }
            return new Response(
                JSON.stringify({
                    data: {
                        items: [
                            {
                                ...business("1", 37.6, 55.9, "МФЦ Бибирево"),
                                categories: [{ name: "МФЦ" }],
                            },
                            business("2", 37.6, 55.9, "InsideCafe"),
                        ],
                        totalResultCount: 2,
                    },
                }),
                { status: 200 }
            );
        };
        const result = await listDistrictOrgs(DISTRICT_URL, {
            fetch: fetchMock,
            delayMs: 0,
            exclude: ["мфц"],
        });
        assert.equal(result.count, 1);
        assert.equal(result.organizations[0]?.title, "InsideCafe");
    });

    it("stops pagination when a later page errors", async () => {
        const fetchMock: typeof fetch = async (input) => {
            const url = String(input);
            if (url.includes("/geo/")) {
                return new Response(htmlPage(), { status: 200 });
            }
            const skip = Number(new URL(url).searchParams.get("skip"));
            if (skip > 0) {
                return new Response(
                    JSON.stringify({
                        error: { message: "501 skip too far" },
                    }),
                    { status: 200 }
                );
            }
            return new Response(
                JSON.stringify({
                    data: {
                        items: [business("1", 37.6, 55.9, "InsideCafe")],
                        totalResultCount: 1,
                    },
                }),
                { status: 200 }
            );
        };
        const result = await listDistrictOrgs(DISTRICT_URL, {
            fetch: fetchMock,
            delayMs: 0,
            pageSize: 1,
            limit: 50,
        });
        assert.equal(result.count, 1);
    });
});

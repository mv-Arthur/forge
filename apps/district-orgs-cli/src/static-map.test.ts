import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    encodeMarkers,
    fetchStaticMapPng,
    staticMapUrl,
} from "./static-map.ts";

const BOUNDS: [[number, number], [number, number]] = [
    [37.6, 55.89],
    [37.62, 55.91],
];

describe("encodeMarkers", () => {
    it("joins numbered Yandex placemarks with tildes", () => {
        assert.equal(
            encodeMarkers([
                { lon: 37.61, lat: 55.9, label: 1 },
                { lon: 37.615, lat: 55.905, label: 2 },
            ]),
            "37.61,55.9,pmrds1~37.615,55.905,pmrds2"
        );
    });

    it("drops markers outside 1..99", () => {
        assert.equal(encodeMarkers([{ lon: 37.61, lat: 55.9, label: 0 }]), "");
    });
});

describe("staticMapUrl", () => {
    it("keeps the crop and bakes numbered pins into the image", () => {
        const url = new URL(
            staticMapUrl(BOUNDS, [{ lon: 37.61, lat: 55.9, label: 1 }])
        );
        assert.equal(url.searchParams.get("size"), "650,450");
        assert.equal(url.searchParams.get("l"), "map");
        assert.ok(url.searchParams.get("ll"));
        assert.ok(url.searchParams.get("spn"));
        assert.equal(url.searchParams.get("pt"), "37.61,55.9,pmrds1");
    });
});

describe("fetchStaticMapPng", () => {
    const png = Buffer.from("png");

    it("retries a dropped fetch then returns the image", async () => {
        let calls = 0;
        const delays: number[] = [];
        const data = await fetchStaticMapPng(
            BOUNDS,
            async () => {
                calls += 1;
                if (calls === 1) {
                    throw new TypeError("fetch failed");
                }
                return new Response(png, {
                    status: 200,
                    headers: { "content-type": "image/png" },
                });
            },
            [],
            {
                retryDelayMs: 10,
                sleep: async (ms) => {
                    delays.push(ms);
                },
            }
        );
        assert.equal(calls, 2);
        assert.deepEqual(delays, [10]);
        assert.match(data, /^data:image\/png;base64,/);
    });

    it("retries HTTP 429 then succeeds", async () => {
        let calls = 0;
        await fetchStaticMapPng(
            BOUNDS,
            async () => {
                calls += 1;
                if (calls === 1) {
                    return new Response("busy", { status: 429 });
                }
                return new Response(png, { status: 200 });
            },
            [],
            { retryDelayMs: 5, sleep: async () => undefined }
        );
        assert.equal(calls, 2);
    });

    it("does not retry HTTP 400", async () => {
        let calls = 0;
        await assert.rejects(
            () =>
                fetchStaticMapPng(
                    BOUNDS,
                    async () => {
                        calls += 1;
                        return new Response("bad", { status: 400 });
                    },
                    [],
                    { retries: 3, sleep: async () => undefined }
                ),
            /Static map HTTP 400/
        );
        assert.equal(calls, 1);
    });

    it("gives up after the last retry", async () => {
        let calls = 0;
        await assert.rejects(
            () =>
                fetchStaticMapPng(
                    BOUNDS,
                    async () => {
                        calls += 1;
                        throw new TypeError("fetch failed");
                    },
                    [],
                    {
                        retries: 2,
                        retryDelayMs: 1,
                        sleep: async () => undefined,
                    }
                ),
            /fetch failed/
        );
        assert.equal(calls, 3);
    });
});

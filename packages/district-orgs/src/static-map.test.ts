import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    encodeMarkers,
    fetchStaticMapPng,
    mapViewport,
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
    it("crops to pins and uses a taller image for a north-south cluster", () => {
        const markers = [
            { lon: 37.61, lat: 55.9, label: 1 },
            { lon: 37.611, lat: 55.906, label: 2 },
            { lon: 37.6105, lat: 55.912, label: 3 },
        ];
        const view = mapViewport(BOUNDS, markers);
        assert.ok(view.height > view.width);
        const url = new URL(staticMapUrl(BOUNDS, markers));
        assert.equal(
            url.searchParams.get("size"),
            `${view.width},${view.height}`
        );
        assert.ok(url.searchParams.get("ll"));
        assert.ok(url.searchParams.get("spn"));
        assert.match(url.searchParams.get("pt") ?? "", /pmrds1/);
    });

    it("uses a wide image for an east-west cluster", () => {
        const view = mapViewport(BOUNDS, [
            { lon: 37.6, lat: 55.9, label: 1 },
            { lon: 37.62, lat: 55.9005, label: 2 },
        ]);
        assert.ok(view.width > view.height);
    });

    it("uses bounds when there are no pins", () => {
        const url = new URL(staticMapUrl(BOUNDS, []));
        assert.equal(url.searchParams.get("size"), "650,450");
        assert.ok(url.searchParams.get("ll"));
        assert.ok(url.searchParams.get("spn"));
        assert.equal(url.searchParams.get("pt"), null);
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
});

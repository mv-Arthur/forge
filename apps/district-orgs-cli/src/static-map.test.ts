import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { encodeMarkers, staticMapUrl } from "./static-map.ts";

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

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    boundsToSpn,
    padBoundsToAspect,
    pointInBounds,
    pointInGeometry,
    pointInPolygon,
    tightBounds,
} from "./geometry.ts";
import type { GeoJsonPolygon } from "./types.ts";

const SQUARE: GeoJsonPolygon = {
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

describe("geometry", () => {
    it("computes spn from bounds", () => {
        const [lon, lat] = boundsToSpn([
            [37.58, 55.88],
            [37.65, 55.92],
        ]);
        assert.ok(Math.abs(lon - 0.07) < 1e-10);
        assert.ok(Math.abs(lat - 0.04) < 1e-10);
    });

    it("detects a point inside a polygon", () => {
        assert.equal(pointInPolygon([37.6, 55.9], SQUARE), true);
        assert.equal(pointInPolygon([37.0, 55.0], SQUARE), false);
    });

    it("falls back to bounds when geometry is missing", () => {
        const bounds: [[number, number], [number, number]] = [
            [37.58, 55.88],
            [37.65, 55.92],
        ];
        assert.equal(pointInGeometry([37.6, 55.9], null, bounds), true);
        assert.equal(pointInGeometry([10, 10], null, bounds), false);
        assert.equal(pointInBounds([37.58, 55.88], bounds), true);
    });

    it("builds tightBounds from points", () => {
        const bounds = tightBounds([
            [37.6, 55.9],
            [37.61, 55.91],
        ]);
        assert.deepEqual(bounds[0], [37.6, 55.9]);
        assert.deepEqual(bounds[1], [37.61, 55.91]);
    });

    it("pads bounds to a wider aspect", () => {
        const padded = padBoundsToAspect(
            [
                [37.6, 55.9],
                [37.61, 55.92],
            ],
            650 / 450
        );
        const [spnLon, spnLat] = boundsToSpn(padded);
        assert.ok(Math.abs(spnLon / spnLat - 650 / 450) < 1e-9);
    });

    it("keeps original corners inward of the padded frame", () => {
        const tight: [[number, number], [number, number]] = [
            [37.6, 55.9],
            [37.62, 55.91],
        ];
        const padded = padBoundsToAspect(tight, 650 / 450, 0.16);
        const [[minLon, minLat], [maxLon, maxLat]] = padded;
        const east = (37.62 - minLon) / (maxLon - minLon);
        const north = (55.91 - minLat) / (maxLat - minLat);
        assert.ok(east < 0.9);
        assert.ok(east > 0.5);
        assert.ok(north < 0.9);
        assert.ok(north > 0.5);
    });

    it("uses GeometryCollection polygons", () => {
        assert.equal(
            pointInGeometry(
                [37.6, 55.9],
                { type: "GeometryCollection", geometries: [SQUARE] },
                null
            ),
            true
        );
    });
});

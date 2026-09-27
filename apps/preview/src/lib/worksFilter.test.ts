import assert from "node:assert/strict";
import { test } from "node:test";
import type { EnrichedBuiltObject } from "../types/catalog.ts";
import {
    objectPassesWorksFilter,
    parseWorksGallerySearch,
    worksAreaBounds,
} from "./worksFilter.ts";

function house(
    patch: Partial<EnrichedBuiltObject> & Pick<EnrichedBuiltObject, "slug">,
): EnrichedBuiltObject {
    return {
        title: patch.slug,
        technology: "sip",
        location: null,
        floors: "1",
        status: "built",
        gallery: [],
        displayTitle: patch.slug,
        heroImage: null,
        locationLabel: null,
        area: null,
        bedrooms: null,
        bathrooms: null,
        kitchenArea: null,
        hasTerrace: false,
        hasSauna: false,
        hasGarage: false,
        buildTermLabel: null,
        metaDescription: null,
        ...patch,
    };
}

test("parseWorksGallerySearch reads tech=sip", () => {
    const q = parseWorksGallerySearch(
        new URLSearchParams("tech=sip"),
    );
    assert.equal(q.tech, "sip");
});

test("tech=sip keeps sip houses and drops frame", () => {
    const sip = house({ slug: "sip-1", technology: "sip" });
    const frame = house({ slug: "frame-1", technology: "frame" });
    assert.equal(objectPassesWorksFilter(sip, { tech: "sip" }), true);
    assert.equal(objectPassesWorksFilter(frame, { tech: "sip" }), false);
});

test("idle area filter keeps houses without area", () => {
    const unknown = house({ slug: "no-area", area: null });
    assert.equal(objectPassesWorksFilter(unknown, { tech: "sip" }), true);
});

test("active area filter drops houses without area", () => {
    const unknown = house({ slug: "no-area", area: null });
    const inside = house({ slug: "in", area: 120 });
    const outside = house({ slug: "out", area: 400 });
    const query = { tech: "sip" as const, areaMin: 100, areaMax: 200 };
    assert.equal(objectPassesWorksFilter(unknown, query), false);
    assert.equal(objectPassesWorksFilter(inside, query), true);
    assert.equal(objectPassesWorksFilter(outside, query), false);
});

test("worksAreaBounds uses only houses that have area", () => {
    const bounds = worksAreaBounds([
        house({ slug: "a", area: 112 }),
        house({ slug: "b", area: null }),
        house({ slug: "c", area: 121 }),
    ]);
    assert.deepEqual(bounds, { min: 112, max: 121 });
});

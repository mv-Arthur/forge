import assert from "node:assert/strict";
import { test } from "node:test";
import { applyShownMaterial, SHOWN_MATERIAL } from "./shownMaterial.ts";
import type { Technology } from "../types/catalog.ts";

function variant(technology: Technology) {
    return { technology, priceFrom: technology === "frame" ? 5_000_000 : 9_000_000 };
}

test("four variants collapse to the pictured technology", () => {
    const project = applyShownMaterial({
        slug: "brig",
        technologies: ["fachwerk", "frame"] as Technology[],
        variants: [variant("fachwerk"), variant("frame")],
    });
    assert.deepEqual(project.variants.map((item) => item.technology), [
        "fachwerk",
    ]);
    assert.deepEqual(project.technologies, ["fachwerk"]);
    assert.equal(SHOWN_MATERIAL.brig, "fachwerk");
});

test("a fachwerk card stays out of the brick filter", () => {
    const shown = applyShownMaterial({
        slug: "brig",
        technologies: ["fachwerk", "frame"] as Technology[],
        variants: [variant("fachwerk"), variant("frame")],
    });
    const matches = (tech: Technology) =>
        shown.technologies.some((item) => item === tech);
    assert.equal(matches("brick"), false);
    assert.equal(matches("fachwerk"), true);
    assert.equal(SHOWN_MATERIAL.brig, "fachwerk");
});

test("unknown slug is left intact", () => {
    const project = {
        slug: "not-a-house",
        technologies: ["brick", "frame"] as Technology[],
        variants: [variant("brick"), variant("frame")],
    };
    assert.equal(applyShownMaterial(project), project);
});

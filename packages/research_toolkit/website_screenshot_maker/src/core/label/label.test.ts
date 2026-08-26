import { test } from "node:test";
import assert from "node:assert/strict";
import { heuristicLabeler } from "./label.js";

test("heuristicLabeler returns non-empty strings", async () => {
    const r = await heuristicLabeler({
        templateId: "/catalog",
        sampleUrls: ["https://ex.test/catalog/1"],
        slotKinds: ["form", "nav"],
    });
    assert.ok(r.templateLabel.length > 0);
    assert.equal(r.slotLabels.form, "form");
    assert.equal(r.slotLabels.nav, "nav");
});

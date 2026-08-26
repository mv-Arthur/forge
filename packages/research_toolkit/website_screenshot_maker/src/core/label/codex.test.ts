import { test } from "node:test";
import assert from "node:assert/strict";
import { refineCrops } from "./codex.js";

const crops = [
    { file: "crops/a-form-1-default.png", kind: "form" },
    { file: "crops/a-header-1-default.png", kind: "header" },
];

test("refineCrops keep one file and label", async () => {
    const file = crops[0].file;
    const r = await refineCrops(crops, async () => ({
        keep: [file],
        labels: { [file]: "фильтр" },
    }));
    assert.equal(r.crops.length, 1);
    assert.equal(r.crops[0].file, file);
    assert.equal(r.labels[file], "фильтр");
});

test("refineCrops throw keeps input length", async () => {
    const r = await refineCrops(crops, async () => {
        throw new Error("codex down");
    });
    assert.equal(r.crops.length, crops.length);
});

test("refineCrops empty keep keeps input length", async () => {
    const r = await refineCrops(crops, async () => ({ keep: [], labels: {} }));
    assert.equal(r.crops.length, crops.length);
});

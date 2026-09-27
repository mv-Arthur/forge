import assert from "node:assert/strict";
import { test } from "node:test";
import { sortByTechnology, sortTechnologies } from "./technology.ts";

test("primary tech stays first even if later in TECH_ORDER", () => {
    assert.deepEqual(
        sortTechnologies(["gas_concrete", "brick", "frame", "sip"], "frame"),
        ["frame", "gas_concrete", "brick", "sip"]
    );
});

test("without primary, gas_concrete stays first", () => {
    assert.deepEqual(sortTechnologies(["sip", "frame", "gas_concrete"]), [
        "gas_concrete",
        "frame",
        "sip",
    ]);
});

test("fachwerk primary beats frame", () => {
    assert.deepEqual(sortTechnologies(["frame", "fachwerk"], "fachwerk"), [
        "fachwerk",
        "frame",
    ]);
});

test("sortByTechnology mirrors tech order", () => {
    const variants = [
        { technology: "gas_concrete" as const },
        { technology: "frame" as const },
        { technology: "brick" as const },
    ];
    assert.deepEqual(
        sortByTechnology(variants, "frame").map((v) => v.technology),
        ["frame", "gas_concrete", "brick"]
    );
});

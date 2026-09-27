import assert from "node:assert/strict";
import { test } from "node:test";
import {
    parseCatalogTechs,
    projectInFamily,
    techsForFamily,
    worksGroupForFamily,
} from "./techFamily.ts";

test("wood expands to frame, sip, fachwerk", () => {
    assert.deepEqual(techsForFamily("wood"), ["frame", "sip", "fachwerk"]);
    assert.deepEqual(parseCatalogTechs("wood"), ["frame", "sip", "fachwerk"]);
});

test("stone expands to gas_concrete, brick", () => {
    assert.deepEqual(techsForFamily("stone"), ["gas_concrete", "brick"]);
    assert.deepEqual(parseCatalogTechs("stone"), ["gas_concrete", "brick"]);
});

test("comma list keeps order and drops unknown", () => {
    assert.deepEqual(parseCatalogTechs("sip,frame,nope"), ["sip", "frame"]);
});

test("family plus extra tech does not duplicate", () => {
    assert.deepEqual(parseCatalogTechs("wood,frame"), [
        "frame",
        "sip",
        "fachwerk",
    ]);
});

test("empty and unknown yield empty", () => {
    assert.deepEqual(parseCatalogTechs(null), []);
    assert.deepEqual(parseCatalogTechs(""), []);
    assert.deepEqual(parseCatalogTechs("plastic"), []);
});

test("projectInFamily matches any tech in the family", () => {
    assert.equal(
        projectInFamily({ technologies: ["sip", "gas_concrete"] }, "wood"),
        true
    );
    assert.equal(
        projectInFamily({ technologies: ["brick"] }, "wood"),
        false
    );
    assert.equal(
        projectInFamily({ technologies: ["brick"] }, "stone"),
        true
    );
});

test("works group for construction family", () => {
    assert.equal(worksGroupForFamily("wood"), "frame");
    assert.equal(worksGroupForFamily("stone"), "stone");
});

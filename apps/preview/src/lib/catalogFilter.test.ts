import assert from "node:assert/strict";
import { test } from "node:test";
import {
    catalogKindOn,
    countActiveFilters,
    isAllCatalogKinds,
    isOpenCatalogFilter,
    openCatalogFilter,
    projectPassesCatalogFilter,
    toggleCatalogKind,
    type CatalogProjectRow,
} from "./catalogFilter.ts";

test("isAllCatalogKinds: empty and all three", () => {
    assert.equal(isAllCatalogKinds([]), true);
    assert.equal(isAllCatalogKinds(["serial", "individual", "bath"]), true);
    assert.equal(isAllCatalogKinds(["serial"]), false);
    assert.equal(isAllCatalogKinds(["serial", "individual"]), false);
});

test("from all-on, click a kind unchecks only that kind", () => {
    assert.deepEqual(toggleCatalogKind([], "individual"), ["serial", "bath"]);
    assert.deepEqual(toggleCatalogKind([], "serial"), ["individual", "bath"]);
    assert.deepEqual(
        toggleCatalogKind(["serial", "individual", "bath"], "bath"),
        ["serial", "individual"]
    );
});

test("from one kind, click it again returns all-on", () => {
    assert.deepEqual(toggleCatalogKind(["serial"], "serial"), []);
});

test("from two kinds, click the missing one returns all-on", () => {
    assert.deepEqual(toggleCatalogKind(["serial", "individual"], "bath"), []);
});

test("from two kinds, uncheck one leaves the other", () => {
    assert.deepEqual(toggleCatalogKind(["serial", "individual"], "serial"), [
        "individual",
    ]);
});

test("catalogKindOn is true for every kind when all-on", () => {
    assert.equal(catalogKindOn([], "serial"), true);
    assert.equal(catalogKindOn([], "bath"), true);
    assert.equal(catalogKindOn(["individual"], "serial"), false);
    assert.equal(catalogKindOn(["individual"], "individual"), true);
});

test("countActiveFilters ignores all-on kind", () => {
    const open = openCatalogFilter({ maxArea: 100, maxPrice: 10_000_000 });
    assert.equal(countActiveFilters({ ...open, kind: [] }, open), 0);
    assert.equal(
        countActiveFilters(
            { ...open, kind: ["serial", "individual", "bath"] },
            open
        ),
        0
    );
    assert.equal(countActiveFilters({ ...open, kind: ["serial"] }, open), 1);
});

test("isOpenCatalogFilter treats explicit three kinds as open", () => {
    const open = openCatalogFilter({ maxArea: 100, maxPrice: 10_000_000 });
    assert.equal(
        isOpenCatalogFilter(
            { ...open, kind: ["serial", "individual", "bath"] },
            open
        ),
        true
    );
});

test("line filter with all-on still shows individual and bath", () => {
    const open = openCatalogFilter({ maxArea: 400, maxPrice: 20_000_000 });
    const state = { ...open, lines: ["modern" as const] };
    const modern: CatalogProjectRow = {
        slug: "favor",
        area: 190,
        priceFrom: 8_000_000,
        technologies: ["gas_concrete"],
        floors: "2",
        bedrooms: 4,
        bathrooms: 2,
        hasTerrace: true,
        projectClass: "serial",
    };
    const scandi: CatalogProjectRow = {
        ...modern,
        slug: "don",
        projectClass: "serial",
    };
    const individual: CatalogProjectRow = {
        ...modern,
        slug: "brig",
        projectClass: "individual",
    };
    assert.equal(projectPassesCatalogFilter(modern, state), true);
    assert.equal(projectPassesCatalogFilter(scandi, state), false);
    assert.equal(projectPassesCatalogFilter(individual, state), true);
});

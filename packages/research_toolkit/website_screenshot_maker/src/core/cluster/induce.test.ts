import { test } from "node:test";
import assert from "node:assert/strict";
import { induceClusters } from "./induce.js";

test("12 /item/N → /item/:id size 12", () => {
    const urls = Array.from(
        { length: 12 },
        (_, i) => `https://ex.test/item/${i + 1}`,
    );
    const map = induceClusters(urls);
    assert.equal(map.get("/item/:id")?.length, 12);
    assert.equal(map.size, 1);
});

test("12 /projects/slug-N → /projects/:id", () => {
    const urls = Array.from(
        { length: 12 },
        (_, i) => `https://ex.test/projects/slug-${i + 1}`,
    );
    const map = induceClusters(urls);
    assert.equal(map.get("/projects/:id")?.length, 12);
});

test("3 first-level sections × 5 children → not /:id", () => {
    const urls: string[] = [];
    for (const s of ["alpha", "beta", "gamma"]) {
        for (let i = 1; i <= 5; i++) {
            urls.push(`https://ex.test/${s}/n${i}`);
        }
    }
    const map = induceClusters(urls);
    assert.equal(map.has("/:id"), false);
    assert.equal(map.get("/alpha/:id")?.length, 5);
    assert.equal(map.get("/beta/:id")?.length, 5);
    assert.equal(map.get("/gamma/:id")?.length, 5);
});

test("home + catalog listing + catalog slugs", () => {
    const urls = [
        "https://ex.test/",
        "https://ex.test/catalog",
        ...Array.from(
            { length: 12 },
            (_, i) => `https://ex.test/catalog/slug-${i + 1}`,
        ),
    ];
    const map = induceClusters(urls);
    assert.equal(map.get("/")?.length, 1);
    assert.equal(map.get("/catalog")?.length, 1);
    assert.equal(map.get("/catalog/:id")?.length, 12);
});

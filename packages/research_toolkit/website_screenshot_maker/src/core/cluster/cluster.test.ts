import { test } from "node:test";
import assert from "node:assert/strict";
import { clusterByPath, sampleCluster } from "./cluster.js";
import type { SitePack } from "./pack.js";

test("20 /catalog/N → 1 key, sample length 6", () => {
    const pack: SitePack = {
        exactPaths: [],
        includePathPrefixes: ["/catalog"],
    };
    const urls = Array.from(
        { length: 20 },
        (_, i) => `https://ex.test/catalog/${i + 1}`,
    );
    const map = clusterByPath(urls, pack);
    assert.equal(map.size, 1);
    assert.equal(map.get("/catalog")?.length, 20);
    const sample = sampleCluster(map.get("/catalog") ?? [], 6);
    assert.equal(sample.length, 6);
    assert.equal(sample[0], urls[0]);
    assert.equal(sample[5], urls[19]);
});

test("pack drops unmatched URLs", () => {
    const pack: SitePack = {
        exactPaths: ["/"],
        includePathPrefixes: ["/item"],
    };
    const map = clusterByPath(
        [
            "https://ex.test/",
            "https://ex.test/item/1",
            "https://ex.test/other/1",
        ],
        pack,
    );
    assert.equal(map.size, 2);
    assert.equal(map.get("/")?.length, 1);
    assert.equal(map.get("/item")?.length, 1);
    assert.equal(map.has("/other"), false);
});

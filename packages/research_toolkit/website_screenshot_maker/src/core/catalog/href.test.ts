import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { assetFileUrl, withAssetFileUrls } from "./href.js";

test("assetFileUrl resolves relative file against outDir", () => {
    const out = "/tmp/wsm-out";
    const href = assetFileUrl(out, "crops/home-hero-1-default.png");
    assert.equal(
        href,
        pathToFileURL(path.join(out, "crops/home-hero-1-default.png")).href,
    );
    assert.equal(
        fileURLToPath(href),
        path.join(out, "crops/home-hero-1-default.png"),
    );
});

test("withAssetFileUrls rewrites file and page, leaves url", () => {
    const out = "/tmp/wsm-out";
    const src = {
        url: "https://ex.test/",
        file: "pages/desktop/home.png",
        page: "pages/desktop/home.png",
        children: [{ file: "crops/a.png", kind: "button" }],
    };
    const outDoc = withAssetFileUrls(src, out);
    assert.equal(outDoc.url, "https://ex.test/");
    assert.equal(src.file, "pages/desktop/home.png");
    assert.equal(outDoc.file, pathToFileURL(path.join(out, "pages/desktop/home.png")).href);
    assert.equal(outDoc.page, pathToFileURL(path.join(out, "pages/desktop/home.png")).href);
    assert.equal(
        outDoc.children[0].file,
        pathToFileURL(path.join(out, "crops/a.png")).href,
    );
});

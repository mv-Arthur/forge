import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { startTestServer } from "../http/test-server.js";
import { atlas } from "./atlas.js";
import type { CaptureConfig } from "../index.js";
import type { Atlas } from "../catalog/catalog.js";

const device = {
    id: "desktop",
    width: 400,
    height: 300,
    deviceScaleFactor: 1,
    isMobile: false,
};

function itemBody(withForm: boolean): string {
    const formJs = withForm
        ? `<script>document.body.insertAdjacentHTML('beforeend','<form style="height:60px"><input name="n" required><button type="submit">go</button></form>');</script>`
        : "";
    return `<!doctype html><title>item</title><body><h1>item</h1>${formJs}</body>`;
}

test("atlas clusters 12 items and caps representatives", {
    timeout: 120_000,
}, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-atlas-"));
    const sitemap = { type: "application/xml", body: "<urlset></urlset>" };
    const routes: Record<string, { type?: string; body: string }> = {
        "/robots.txt": { type: "text/plain", body: "User-agent: *\n" },
        "/sitemap.xml": sitemap,
        "/sitemap_index.xml": {
            type: "application/xml",
            body: "<sitemapindex/>",
        },
        "/": { body: `<!doctype html><title>Home</title><body><h1>home</h1></body>` },
    };
    for (let n = 1; n <= 12; n++) {
        routes[`/item/${n}`] = { body: itemBody(n <= 6) };
    }
    const srv = await startTestServer(routes);
    const origin = srv.origin.origin;
    const locs = [`${origin}/`, ...Array.from({ length: 12 }, (_, i) => `${origin}/item/${i + 1}`)];
    sitemap.body = `<urlset>${locs.map((u) => `<url><loc>${u}</loc></url>`).join("")}</urlset>`;

    const config: CaptureConfig = {
        origin: srv.origin,
        out,
        devices: [device],
        concurrency: 2,
        tabsPerBrowser: 1,
        navTimeout: 8000,
        locale: "ru-RU",
    };
    try {
        const doc = await atlas(config, {
            pack: {
                exactPaths: ["/"],
                includePathPrefixes: ["/item"],
            },
        });
        assert.equal(doc.labelSource, "heuristic");
        assert.equal(doc.templates.length, 2);
        const items = doc.templates.find((t) => t.id === "/item");
        assert.ok(items);
        assert.equal(items.urls.length, 12);
        assert.ok(items.representatives.length <= 3);
        assert.ok(items.representatives.length >= 1);
        assert.equal(items.occupancy.some((o) => o.has_form), true);
        const crop = items.slots.find((s) => s.file.endsWith(".png"));
        if (crop) {
            const abs = path.join(out, crop.file);
            assert.ok(fs.existsSync(abs));
            assert.ok(fs.statSync(abs).size > 0);
        }
        const parsed = JSON.parse(
            fs.readFileSync(path.join(out, "atlas.json"), "utf8"),
        ) as Atlas;
        assert.equal(parsed.templates.length, 2);
        assert.equal("library" in parsed, false);
        assert.equal(fs.existsSync(path.join(out, "library.json")), false);
        for (const t of doc.templates) {
            assert.ok(Array.isArray(t.widgetIds));
            assert.ok(Array.isArray(t.atomIds));
        }
    } finally {
        await srv.close();
    }
});

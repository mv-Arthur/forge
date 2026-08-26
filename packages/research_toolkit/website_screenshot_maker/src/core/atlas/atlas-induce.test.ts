import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { startTestServer } from "../http/test-server.js";
import { atlas } from "./atlas.js";
import type { CaptureConfig } from "../index.js";

const device = {
    id: "desktop",
    width: 400,
    height: 300,
    deviceScaleFactor: 1,
    isMobile: false,
};

function itemBody(n: number): string {
    const form =
        n <= 6
            ? `<form style="height:60px"><input name="n" required><button>go</button></form>`
            : "";
    return `<!doctype html><body><h1>item ${n}</h1>${form}</body>`;
}

test("atlas without pack induces /item/:id; allow drops /other", {
    timeout: 120_000,
}, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-ind-"));
    const sitemap = { type: "application/xml", body: "<urlset></urlset>" };
    const routes: Record<string, { type?: string; body: string }> = {
        "/robots.txt": { type: "text/plain", body: "User-agent: *\n" },
        "/sitemap.xml": sitemap,
        "/sitemap_index.xml": { type: "application/xml", body: "<sitemapindex/>" },
        "/": { body: `<!doctype html><body><h1>home</h1></body>` },
        "/other/1": { body: `<!doctype html><body><h1>other</h1></body>` },
    };
    for (let n = 1; n <= 12; n++) {
        routes[`/item/${n}`] = { body: itemBody(n) };
    }
    const srv = await startTestServer(routes);
    const origin = srv.origin.origin;
    const locs = [
        `${origin}/`,
        `${origin}/other/1`,
        ...Array.from({ length: 12 }, (_, i) => `${origin}/item/${i + 1}`),
    ];
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
        const doc = await atlas(config);
        const ids = doc.templates.map((t) => t.id).sort();
        assert.ok(ids.includes("/"));
        assert.ok(ids.includes("/item/:id"));
        const items = doc.templates.find((t) => t.id === "/item/:id");
        assert.ok(items);
        assert.equal(items.urls.length, 12);
        assert.ok(items.representatives.length <= 3);

        const filtered = await atlas(config, {
            allow: { exactPaths: ["/"], includePathPrefixes: ["/item"] },
        });
        const allUrls = filtered.templates.flatMap((t) => t.urls);
        assert.equal(
            allUrls.some((u) => u.includes("/other/")),
            false,
        );
    } finally {
        await srv.close();
    }
});

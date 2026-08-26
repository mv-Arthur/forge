import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { startTestServer } from "../http/test-server.js";
import { atlas } from "./atlas.js";
import type { CaptureConfig } from "../index.js";
import { slugFromUrl } from "../url/url.js";

const device = {
    id: "desktop",
    width: 400,
    height: 300,
    deviceScaleFactor: 1,
    isMobile: false,
};

test("atlas.json slots only from representative slugs", {
    timeout: 120_000,
}, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-slots-"));
    const sitemap = { type: "application/xml", body: "<urlset></urlset>" };
    const routes: Record<string, { type?: string; body: string }> = {
        "/robots.txt": { type: "text/plain", body: "User-agent: *\n" },
        "/sitemap.xml": sitemap,
        "/sitemap_index.xml": { type: "application/xml", body: "<sitemapindex/>" },
        "/": { body: `<!doctype html><title>Home</title><body><h1>home</h1></body>` },
    };
    for (let n = 1; n <= 12; n++) {
        const form =
            n <= 6
                ? `<form style="height:60px"><input name="n" required><button type="submit">go</button></form>`
                : "";
        routes[`/item/${n}`] = {
            body: `<!doctype html><body><h1>item ${n}</h1>${form}</body>`,
        };
    }
    const srv = await startTestServer(routes);
    const origin = srv.origin.origin;
    const locs = [
        `${origin}/`,
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
        const doc = await atlas(config, {
            pack: { exactPaths: ["/"], includePathPrefixes: ["/item"] },
        });
        const items = doc.templates.find((t) => t.id === "/item");
        assert.ok(items);
        const repSlugs = items.representatives.map((u) => slugFromUrl(u));
        for (const s of items.slots) {
            const hit = repSlugs.some(
                (slug) =>
                    s.file.includes(`/${slug}-`) ||
                    s.file.includes(`crops/${slug}-`),
            );
            assert.ok(
                hit,
                `slot ${s.file} not from reps ${repSlugs.join(",")}`,
            );
        }
    } finally {
        await srv.close();
    }
});

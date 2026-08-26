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

test("atlas refine keeps one slot file", { timeout: 120_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-refine-"));
    const sitemap = { type: "application/xml", body: "<urlset></urlset>" };
    const routes: Record<string, { type?: string; body: string }> = {
        "/robots.txt": { type: "text/plain", body: "User-agent: *\n" },
        "/sitemap.xml": sitemap,
        "/sitemap_index.xml": { type: "application/xml", body: "<sitemapindex/>" },
        "/": {
            body: `<!doctype html><body>
<header style="height:40px">h</header>
<form style="height:80px"><input name="n"><button type="submit">go</button></form>
</body>`,
        },
    };
    const srv = await startTestServer(routes);
    const origin = srv.origin.origin;
    sitemap.body = `<urlset><url><loc>${origin}/</loc></url></urlset>`;
    const config: CaptureConfig = {
        origin: srv.origin,
        out,
        devices: [device],
        concurrency: 1,
        tabsPerBrowser: 1,
        navTimeout: 8000,
        locale: "ru-RU",
    };
    let kept = "";
    try {
        const doc = await atlas(config, {
            pack: { exactPaths: ["/"], includePathPrefixes: [] },
            refine: async (crops) => {
                assert.ok(crops.length >= 1, JSON.stringify(crops));
                kept = crops[0].file;
                return { keep: [kept], labels: { [kept]: "фильтр" } };
            },
        });
        assert.equal(doc.templates[0].slots.length, 1);
        assert.equal(doc.templates[0].slots[0].file, kept);
        assert.equal(doc.templates[0].slots[0].label, "фильтр");
    } finally {
        await srv.close();
    }
});

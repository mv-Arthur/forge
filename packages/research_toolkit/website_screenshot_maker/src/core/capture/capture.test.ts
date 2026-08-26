import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { CaptureConfig } from "../index.js";
import { capture, browserWorkerCount } from "./index.js";
import { startTestServer } from "../http/test-server.js";

const device = {
    id: "desktop",
    width: 400,
    height: 300,
    deviceScaleFactor: 1,
    isMobile: false,
};

test("capture writes png and manifest", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-cap-"));
    const srv = await startTestServer({
        "/robots.txt": { type: "text/plain", body: "User-agent: *\n" },
        "/sitemap.xml": { type: "application/xml", body: "<urlset></urlset>" },
        "/sitemap_index.xml": { type: "application/xml", body: "<sitemapindex/>" },
        "/": { body: "<!doctype html><title>Home</title><body>ok</body>" },
    });
    const config: CaptureConfig = {
        origin: srv.origin,
        out,
        devices: [device],
        concurrency: 1,
        tabsPerBrowser: 1,
        navTimeout: 8000,
        locale: "ru-RU",
    };
    try {
        await capture(config);
        const png = path.join(out, "pages", "desktop", "home.png");
        assert.ok(fs.existsSync(png));
        assert.ok(fs.statSync(png).size > 0);
        assert.equal(fs.existsSync(path.join(out, "discovery.log")), false);
        const manifest = JSON.parse(fs.readFileSync(path.join(out, "manifest.json"), "utf8"));
        assert.equal(manifest.final, true);
        assert.equal(manifest.discoveredCount, 1);
        assert.equal(manifest.capturedCount, 1);
        assert.deepEqual(manifest.devices, ["desktop"]);
        assert.equal(manifest.captures[0].status, "ok");
    } finally {
        await srv.close();
    }
});

test("browserWorkerCount caps workers", () => {
    assert.equal(browserWorkerCount(6, 3), 3);
    assert.equal(browserWorkerCount(6, 100), 6);
    assert.equal(browserWorkerCount(6, 0), 0);
});

test("capture concurrency 2 uses own Chromium", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-cap-"));
    const srv = await startTestServer({
        "/robots.txt": { type: "text/plain", body: "User-agent: *\n" },
        "/sitemap.xml": { type: "application/xml", body: "<urlset></urlset>" },
        "/sitemap_index.xml": { type: "application/xml", body: "<sitemapindex/>" },
        "/": { body: `<!doctype html><title>Home</title><a href="/b">b</a>` },
        "/b": { body: `<!doctype html><title>B</title><body>b</body>` },
    });
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
        await capture(config);
        const home = path.join(out, "pages", "desktop", "home.png");
        const b = path.join(out, "pages", "desktop", "b.png");
        assert.ok(fs.existsSync(home));
        assert.ok(fs.existsSync(b));
        assert.ok(fs.statSync(home).size > 0);
        assert.ok(fs.statSync(b).size > 0);
        const manifest = JSON.parse(fs.readFileSync(path.join(out, "manifest.json"), "utf8"));
        assert.equal(manifest.final, true);
        assert.equal(manifest.capturedCount, 2);
    } finally {
        await srv.close();
    }
});

test("capture tabsPerBrowser 2 writes both pngs", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-cap-"));
    const srv = await startTestServer({
        "/robots.txt": { type: "text/plain", body: "User-agent: *\n" },
        "/sitemap.xml": { type: "application/xml", body: "<urlset></urlset>" },
        "/sitemap_index.xml": { type: "application/xml", body: "<sitemapindex/>" },
        "/": { body: `<!doctype html><title>Home</title><a href="/b">b</a>` },
        "/b": { body: `<!doctype html><title>B</title><body>b</body>` },
    });
    const config: CaptureConfig = {
        origin: srv.origin,
        out,
        devices: [device],
        concurrency: 1,
        tabsPerBrowser: 2,
        navTimeout: 8000,
        locale: "ru-RU",
    };
    try {
        await capture(config);
        assert.ok(fs.existsSync(path.join(out, "pages", "desktop", "home.png")));
        assert.ok(fs.existsSync(path.join(out, "pages", "desktop", "b.png")));
        const manifest = JSON.parse(fs.readFileSync(path.join(out, "manifest.json"), "utf8"));
        assert.equal(manifest.capturedCount, 2);
    } finally {
        await srv.close();
    }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { CaptureConfig } from "../index.js";
import { discoverUrls } from "./index.js";
import { startTestServer, type TestRoute } from "../http/test-server.js";

const device = {
    id: "desktop",
    width: 400,
    height: 300,
    deviceScaleFactor: 1,
    isMobile: false,
};

function config(origin: URL, out: string): CaptureConfig {
    return {
        origin,
        out,
        devices: [device],
        concurrency: 1,
        tabsPerBrowser: 1,
        navTimeout: 5000,
        locale: "ru-RU",
    };
}

test("discoverUrls: sitemap, nested map, home hrefs, skip assets and foreign hosts", async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-dis-"));
    const routes: Record<string, TestRoute> = {};
    const srv = await startTestServer(routes);
    const extra = new URL("/extra.xml", srv.origin).href;
    const nested = new URL("/nested.xml", srv.origin).href;
    routes["/robots.txt"] = {
        type: "text/plain",
        body: `Sitemap: ${extra}\n`,
    };
    routes["/sitemap.xml"] = {
        type: "application/xml",
        body: `<urlset>${[
            `<loc>${new URL("/page-a", srv.origin).href}</loc>`,
            `<loc>${new URL("/photo.jpg", srv.origin).href}</loc>`,
            "<loc>https://other.com/x</loc>",
            `<loc>${nested}</loc>`,
        ].join("")}</urlset>`,
    };
    routes["/sitemap_index.xml"] = { type: "application/xml", body: "<sitemapindex/>" };
    routes["/extra.xml"] = {
        type: "application/xml",
        body: `<urlset><loc>${new URL("/page-b", srv.origin).href}</loc></urlset>`,
    };
    routes["/nested.xml"] = {
        type: "application/xml",
        body: `<urlset><loc>${new URL("/page-c", srv.origin).href}</loc></urlset>`,
    };
    routes["/"] = {
        body: `<html><a href="/page-d">d</a><a href="https://other.com/z">z</a></html>`,
    };
    try {
        const urls = await discoverUrls(config(srv.origin, out));
        assert.deepEqual(urls, [
            srv.origin.href,
            new URL("/page-a", srv.origin).href,
            new URL("/page-b", srv.origin).href,
            new URL("/page-c", srv.origin).href,
            new URL("/page-d", srv.origin).href,
        ].sort());
        assert.equal(fs.existsSync(path.join(out, "discovery.log")), false);
    } finally {
        await srv.close();
    }
});

test("discoverUrls: robots drop still uses default sitemap seeds", async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-dis-"));
    const routes: Record<string, TestRoute> = {
        "/robots.txt": { drop: true },
        "/sitemap.xml": {
            type: "application/xml",
            body: "",
        },
        "/sitemap_index.xml": { type: "application/xml", body: "" },
        "/": { body: "<html></html>" },
    };
    const srv = await startTestServer(routes);
    routes["/sitemap.xml"] = {
        type: "application/xml",
        body: `<urlset><loc>${new URL("/only", srv.origin).href}</loc></urlset>`,
    };
    try {
        const urls = await discoverUrls(config(srv.origin, out));
        assert.ok(urls.includes(new URL("/only", srv.origin).href));
        assert.ok(urls.includes(srv.origin.href));
    } finally {
        await srv.close();
    }
});

test("discoverUrls: foreign nested sitemap is not fetched", async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-dis-"));
    const routes: Record<string, TestRoute> = {};
    const srv = await startTestServer(routes);
    routes["/robots.txt"] = {
        type: "text/plain",
        body: "Sitemap: https://other.com/evil.xml\n",
    };
    routes["/sitemap.xml"] = {
        type: "application/xml",
        body: `<urlset><loc>https://other.com/nested.xml</loc><loc>${new URL("/page-a", srv.origin).href}</loc></urlset>`,
    };
    routes["/sitemap_index.xml"] = { type: "application/xml", body: "<sitemapindex/>" };
    routes["/"] = { body: "<html></html>" };
    try {
        const urls = await discoverUrls(config(srv.origin, out));
        assert.ok(urls.includes(new URL("/page-a", srv.origin).href));
        assert.equal(urls.some((u) => u.includes("other.com")), false);
    } finally {
        await srv.close();
    }
});

test("discoverUrls: multi-hop from home", async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-dis-"));
    const routes: Record<string, TestRoute> = {};
    const srv = await startTestServer(routes);
    const pageE = new URL("/page-e", srv.origin).href;
    routes["/robots.txt"] = { type: "text/plain", body: "" };
    routes["/sitemap.xml"] = {
        type: "application/xml",
        body: `<urlset><loc>${new URL("/page-a", srv.origin).href}</loc></urlset>`,
    };
    routes["/sitemap_index.xml"] = { type: "application/xml", body: "<sitemapindex/>" };
    routes["/"] = { body: `<html><a href="/page-d">d</a></html>` };
    routes["/page-d"] = { body: `<html><a href="/page-e">e</a></html>` };
    routes["/page-e"] = { body: `<html>leaf</html>` };
    try {
        const urls = await discoverUrls(config(srv.origin, out));
        assert.ok(urls.includes(new URL("/page-a", srv.origin).href));
        assert.ok(urls.includes(new URL("/page-d", srv.origin).href));
        assert.ok(urls.includes(pageE));
        assert.equal(
            routes["/sitemap.xml"].body?.includes("/page-e"),
            false,
        );
    } finally {
        await srv.close();
    }
});

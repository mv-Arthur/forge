import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium, type Browser } from "playwright";
import type { CaptureConfig } from "../index.js";
import { captureOne, skipReason } from "./index.js";
import { startTestServer } from "../http/test-server.js";

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
        navTimeout: 8000,
        locale: "ru-RU",
    };
}

test("skipReason: http errors, non-html, html ok", () => {
    assert.equal(skipReason(500, "text/html"), "http_500");
    assert.equal(skipReason(404, "text/html"), "http_404");
    assert.equal(skipReason(200, "application/json"), "content_type_application/json");
    assert.equal(skipReason(200, "image/png"), "content_type_image/png");
    assert.equal(skipReason(200, "text/html; charset=utf-8"), null);
    assert.equal(skipReason(200, "application/xhtml+xml"), null);
    assert.equal(skipReason(null, ""), null);
});

let browser: Browser | undefined;

async function getBrowser(): Promise<Browser> {
    if (!browser) browser = await chromium.launch({ headless: true });
    return browser;
}

after(async () => {
    if (browser) await browser.close();
});

test("captureOne writes png for html", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-shot-"));
    const srv = await startTestServer({
        "/": { body: "<!doctype html><title>Hello</title><body>hi</body>" },
    });
    try {
        const row = await captureOne(
            await getBrowser(),
            srv.origin.href,
            device,
            0,
            1,
            config(srv.origin, out),
        );
        assert.equal(row.status, "ok");
        assert.equal(row.title, "Hello");
        assert.ok(row.bytes && row.bytes > 0);
        assert.equal(row.file, path.join("pages", "desktop", "home.png"));
        assert.ok(fs.existsSync(path.join(out, row.file)));
    } finally {
        await srv.close();
    }
});

test("captureOne skips http 500", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-shot-"));
    const srv = await startTestServer({
        "/bad": { status: 500, body: "err", type: "text/html" },
    });
    try {
        const row = await captureOne(
            await getBrowser(),
            new URL("/bad", srv.origin).href,
            device,
            0,
            1,
            config(srv.origin, out),
        );
        assert.equal(row.status, "skipped");
        assert.equal(row.reason, "http_500");
        assert.equal(fs.existsSync(path.join(out, row.file)), false);
    } finally {
        await srv.close();
    }
});

test("captureOne skips non-html content-type", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-shot-"));
    const srv = await startTestServer({
        "/data.json": { type: "application/json", body: "{}" },
    });
    try {
        const row = await captureOne(
            await getBrowser(),
            new URL("/data.json", srv.origin).href,
            device,
            0,
            1,
            config(srv.origin, out),
        );
        assert.equal(row.status, "skipped");
        assert.match(row.reason ?? "", /content_type_application\/json/);
    } finally {
        await srv.close();
    }
});

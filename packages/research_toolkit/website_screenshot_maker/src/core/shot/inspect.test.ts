import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { startTestServer } from "../http/test-server.js";
import { inspectOne } from "./shot.js";
import type { CaptureConfig } from "../index.js";

const device = {
    id: "desktop",
    width: 400,
    height: 300,
    deviceScaleFactor: 1,
    isMobile: false,
};

test("inspectOne sees JS-injected form", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-ins-"));
    const srv = await startTestServer({
        "/": {
            body: `<!doctype html><title>Shell</title><body>
<header>h</header>
<script>document.body.insertAdjacentHTML('beforeend','<form id="jsf"><input name="n"></form>');</script>
</body>`,
        },
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
    const browser = await chromium.launch({ headless: true });
    try {
        const result = await inspectOne(
            browser,
            srv.origin.href,
            device,
            0,
            1,
            config,
        );
        assert.equal(result.occupancy.has_form, true);
        assert.equal(result.row.status, "ok");
        assert.ok(result.row.bytes && result.row.bytes > 0);
        assert.equal(result.tree.kind, "page");
        assert.equal(result.tree.file, result.row.file);
        assert.equal(result.tree.url, srv.origin.href);
    } finally {
        await browser.close();
        await srv.close();
    }
});

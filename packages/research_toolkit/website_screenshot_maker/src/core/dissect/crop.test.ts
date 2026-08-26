import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { startTestServer } from "../http/test-server.js";
import { cropSlots } from "./crop.js";

test("cropSlots writes form png", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-crop-"));
    const srv = await startTestServer({
        "/": {
            body: `<!doctype html><body>
<header style="height:40px">h</header>
<form style="height:80px"><input name="n"><button type="submit">go</button></form>
</body>`,
        },
    });
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: { width: 400, height: 300 } });
    const page = await ctx.newPage();
    try {
        await page.goto(srv.origin.href, { waitUntil: "domcontentloaded" });
        const crops = await cropSlots(page, out, "home");
        const form = crops.find((c) => c.kind === "form");
        assert.ok(form);
        const abs = path.join(out, form.file);
        assert.ok(fs.existsSync(abs));
        assert.ok(fs.statSync(abs).size > 0);
    } finally {
        await ctx.close();
        await browser.close();
        await srv.close();
    }
});

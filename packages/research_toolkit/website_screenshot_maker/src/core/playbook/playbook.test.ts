import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { startTestServer } from "../http/test-server.js";
import { runPlaybook } from "./playbook.js";

test("playbook writes form-error.png", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-pb-"));
    const srv = await startTestServer({
        "/": {
            body: `<!doctype html><body>
<form style="height:100px" onsubmit="event.preventDefault(); this.setAttribute('data-err','1');">
<input name="n" required>
<button type="submit">go</button>
</form>
</body>`,
        },
    });
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: { width: 400, height: 300 } });
    const page = await ctx.newPage();
    try {
        await page.goto(srv.origin.href, { waitUntil: "domcontentloaded" });
        const crops = await runPlaybook(page, out, "home");
        const err = crops.find((c) => c.kind === "form" && c.state === "error");
        assert.ok(err);
        const abs = path.join(out, err.file);
        assert.ok(fs.existsSync(abs));
        assert.ok(fs.statSync(abs).size > 0);
    } finally {
        await ctx.close();
        await browser.close();
        await srv.close();
    }
});

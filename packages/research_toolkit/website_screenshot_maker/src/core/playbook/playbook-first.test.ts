import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { startTestServer } from "../http/test-server.js";
import { runPlaybook } from "./playbook.js";
import type { CropFile } from "../dissect/crop.js";

function asScope(kind: string, selector: string): CropFile {
    return { kind, state: "default", file: "", selector };
}

const vp = { width: 400, height: 300 };

test("3 form scopes → form-empty and form-empty-2", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-pb-first-"));
    const srv = await startTestServer({
        "/": {
            body: `<!doctype html><body>
<form id="f1" style="height:80px;width:300px"><input name="a"><button type="submit">a</button></form>
<form id="f2" style="height:80px;width:300px"><input name="b"><button type="submit">b</button></form>
<form id="f3" style="height:80px;width:300px"><input name="c"><button type="submit">c</button></form>
</body>`,
        },
    });
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    try {
        await page.goto(srv.origin.href, { waitUntil: "domcontentloaded" });
        const crops = await runPlaybook(page, out, "home", [
            asScope("form", "#f1"),
            asScope("form", "#f2"),
            asScope("form", "#f3"),
        ]);
        const empties = crops.filter((c) => c.kind === "form" && c.state === "empty");
        assert.ok(empties.length >= 1, JSON.stringify(crops));
        const files = fs.existsSync(path.join(out, "crops"))
            ? fs.readdirSync(path.join(out, "crops")).filter((f) => f.includes("form-empty"))
            : [];
        assert.ok(files.some((f) => f.includes("form-empty")), files.join(","));
        assert.ok(files.some((f) => f.includes("form-empty-2")), files.join(","));
    } finally {
        await ctx.close();
        await browser.close();
        await srv.close();
    }
});

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

test("header+form scopes → 1 form-empty", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-pb-once-"));
    const srv = await startTestServer({
        "/": {
            body: `<!doctype html><body>
<header style="height:40px;width:300px">h</header>
<form style="height:80px;width:300px"><input name="n"><button type="submit">go</button></form>
</body>`,
        },
    });
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    try {
        await page.goto(srv.origin.href, { waitUntil: "domcontentloaded" });
        const crops = await runPlaybook(page, out, "home", [
            asScope("header", "header"),
            asScope("form", "form"),
        ]);
        const empties = crops.filter((c) => c.kind === "form" && c.state === "empty");
        assert.equal(empties.length, 1, JSON.stringify(crops));
        const files = fs.existsSync(path.join(out, "crops"))
            ? fs.readdirSync(path.join(out, "crops")).filter((f) => f.includes("form-empty"))
            : [];
        assert.equal(files.length, 1, files.join(","));
    } finally {
        await ctx.close();
        await browser.close();
        await srv.close();
    }
});

test("tabs-kind scope writes tabs crop without form", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-pb-tabs-"));
    const srv = await startTestServer({
        "/": {
            body: `<!doctype html><body>
<div role="tablist" style="height:40px;width:300px">
<button role="tab">A</button>
<button role="tab">B</button>
</div>
</body>`,
        },
    });
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    try {
        await page.goto(srv.origin.href, { waitUntil: "domcontentloaded" });
        const crops = await runPlaybook(page, out, "home", [
            asScope("tabs", "[role=tablist]"),
        ]);
        assert.ok(
            crops.some((c) => c.kind === "tabs"),
            JSON.stringify(crops),
        );
    } finally {
        await ctx.close();
        await browser.close();
        await srv.close();
    }
});

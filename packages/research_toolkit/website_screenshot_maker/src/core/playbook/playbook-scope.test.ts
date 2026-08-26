import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { startTestServer } from "../http/test-server.js";
import { partitionBoxes } from "../dissect/partition.js";
import { runPlaybook } from "./playbook.js";
import type { CropFile } from "../dissect/crop.js";

function asScope(kind: string, selector: string): CropFile {
    return { kind, state: "default", file: "", selector };
}

test("headerOnlyScopes skips form:error; form scope writes it", {
    timeout: 60_000,
}, async () => {
    const srv = await startTestServer({
        "/": {
            body: `<!doctype html><body>
<header style="height:40px;width:300px">h</header>
<form style="height:80px;width:300px" onsubmit="event.preventDefault(); this.setAttribute('data-err','1');">
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
        const parts = await partitionBoxes(page);
        const header = parts.find((p) => p.kind === "header");
        const form = parts.find((p) => p.kind === "form");
        assert.ok(header, `no header in ${JSON.stringify(parts)}`);
        assert.ok(form, `no form in ${JSON.stringify(parts)}`);

        const headerDir = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-pb-h-"));
        const headerOnlyScopes = [asScope(header.kind, header.selector)];
        const headerCrops = await runPlaybook(page, headerDir, "home", headerOnlyScopes);
        const headerErr = headerCrops.find((c) => c.kind === "form" && c.state === "error");
        assert.equal(headerErr, undefined);
        const headerErrFiles = fs.existsSync(path.join(headerDir, "crops"))
            ? fs.readdirSync(path.join(headerDir, "crops")).filter((f) => f.includes("form-error"))
            : [];
        assert.equal(headerErrFiles.length, 0);

        const formDir = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-pb-f-"));
        const formCrops = await runPlaybook(page, formDir, "home", [
            asScope(form.kind, form.selector),
        ]);
        const formErr = formCrops.find((c) => c.kind === "form" && c.state === "error");
        assert.ok(formErr, `form:error missing ${JSON.stringify(formCrops)}`);
        const abs = path.join(formDir, formErr.file);
        assert.ok(fs.existsSync(abs));
        assert.ok(fs.statSync(abs).size > 0);
    } finally {
        await ctx.close();
        await browser.close();
        await srv.close();
    }
});

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { chromium } from "playwright";
import { startTestServer } from "../http/test-server.js";
import { cropAtoms } from "./atoms.js";

const vp = { width: 400, height: 300 };

async function withPage(
    body: string,
    css: string,
    fn: (page: import("playwright").Page, out: string) => Promise<void>,
): Promise<void> {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-atom-"));
    const srv = await startTestServer({
        "/": {
            body: `<!doctype html><html><head><style>${css}</style></head><body>${body}</body></html>`,
        },
    });
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    try {
        await page.goto(srv.origin.href, { waitUntil: "domcontentloaded" });
        await fn(page, out);
    } finally {
        await ctx.close();
        await browser.close();
        await srv.close();
    }
}

test("3 identical buttons → 1 default atom", { timeout: 60_000 }, async () => {
    const btn = `<button style="height:48px;width:200px;background:#1a3d32;color:#fff">Click me now</button>`;
    await withPage(`${btn}${btn}${btn}`, "", async (page, out) => {
        const crops = await cropAtoms(page, out, "home");
        const defs = crops.filter((c) => c.kind === "button" && c.state === "default");
        assert.equal(defs.length, 1, JSON.stringify(crops));
    });
});

test("button without hover rule → no hover file", { timeout: 60_000 }, async () => {
    await withPage(
        `<button style="height:48px;width:200px;background:#1a3d32;color:#fff">Click me now</button>`,
        "",
        async (page, out) => {
            const crops = await cropAtoms(page, out, "home");
            assert.equal(
                crops.filter((c) => c.kind === "button" && c.state === "hover").length,
                0,
                JSON.stringify(crops),
            );
        },
    );
});

test("two buttons: hover stem matches default index", { timeout: 60_000 }, async () => {
    await withPage(
        `<button class="a" style="display:block;height:48px;width:200px;background:#1a3d32;color:#fff">Alpha one</button>
         <button class="b" style="display:block;height:48px;width:240px;margin-top:24px;background:#1a3d32;color:#fff">Bravo two</button>`,
        `button.b:hover { background:#ff0000 !important; }
         button.b:focus { background:#0000ff !important; outline: 2px solid #00f !important; }`,
        async (_page, out) => {
            const crops = await cropAtoms(_page, out, "home");
            const cropDir = path.join(out, "crops");
            const names = fs.existsSync(cropDir) ? fs.readdirSync(cropDir) : [];
            assert.ok(
                names.includes("home-button-2-hover.png"),
                JSON.stringify({ crops, names }),
            );
            assert.equal(
                names.includes("home-button-1-hover.png"),
                false,
                JSON.stringify(names),
            );
            const hover2 = path.join(cropDir, "home-button-2-hover.png");
            const focus2 = path.join(cropDir, "home-button-2-focus.png");
            const def2 = path.join(cropDir, "home-button-2-default.png");
            assert.ok(fs.existsSync(focus2), JSON.stringify(names));
            assert.ok(fs.existsSync(def2), JSON.stringify(names));
            const md5 = (p: string) =>
                crypto.createHash("md5").update(fs.readFileSync(p)).digest("hex");
            assert.notEqual(md5(hover2), md5(def2));
            assert.notEqual(md5(hover2), md5(focus2));
        },
    );
});

test("card-shaped buttons are not atoms; 48px button is", { timeout: 60_000 }, async () => {
    const img =
        `<img width="200" height="120" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==">`;
    await withPage(
        `<button style="height:180px;width:200px">${img}<h2>House card</h2></button>
         <div role="button" style="height:180px;width:200px">${img}<h2>Role card</h2></div>
         <button style="height:48px;width:200px;background:#1a3d32;color:#fff">Go now</button>`,
        "",
        async (_page, out) => {
            const crops = await cropAtoms(_page, out, "home");
            const defs = crops.filter((c) => c.kind === "button" && c.state === "default");
            assert.equal(defs.length, 1, JSON.stringify(crops));
            const cropDir = path.join(out, "crops");
            const abs = path.join(out, defs[0].file);
            assert.ok(fs.existsSync(abs), JSON.stringify(fs.readdirSync(cropDir)));
        },
    );
});

test("white input is not a field atom", { timeout: 60_000 }, async () => {
    await withPage(
        `<input name="n" style="height:32px;width:260px;border:0;background:#fff;color:#fff">
         <button style="height:48px;width:200px;background:#1a3d32;color:#fff">Go now</button>`,
        "",
        async (_page, out) => {
            const crops = await cropAtoms(_page, out, "home");
            assert.equal(
                crops.filter((c) => c.kind === "field").length,
                0,
                JSON.stringify(crops),
            );
            assert.ok(
                crops.some((c) => c.kind === "button" && c.state === "default"),
                JSON.stringify(crops),
            );
        },
    );
});

test("checkbox → two states", { timeout: 60_000 }, async () => {
    await withPage(
        `<label style="display:flex;align-items:center;height:48px;width:260px;background:#eee;gap:8px">
           <input type="checkbox" name="c" style="width:28px;height:28px">
           <span>Accept terms now</span>
         </label>`,
        "",
        async (page, out) => {
            const crops = await cropAtoms(page, out, "home");
            const checks = crops.filter((c) => c.kind === "check");
            const states = new Set(checks.map((c) => c.state));
            assert.ok(states.has("default"), JSON.stringify(crops));
            assert.ok(states.has("selected"), JSON.stringify(crops));
        },
    );
});

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { startTestServer } from "../http/test-server.js";
import { buildPageTree, type CropNode } from "./tree.js";
import { emptyLibrary, internTree } from "../catalog/library.js";

const vp = { width: 400, height: 300 };
const gif =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

function walk(
    node: { kind: string; id?: string; text?: string; children: unknown[] },
    kind: string,
    acc: { kind: string; id?: string; text?: string; children: unknown[] }[] = [],
): typeof acc {
    if (node.kind === kind) acc.push(node);
    for (const ch of node.children) {
        walk(
            ch as { kind: string; id?: string; text?: string; children: unknown[] },
            kind,
            acc,
        );
    }
    return acc;
}

test("page root nests hero parts; same-chrome buttons share id", {
    timeout: 60_000,
}, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-tree-"));
    fs.mkdirSync(path.join(out, "crops"), { recursive: true });
    const srv = await startTestServer({
        "/": {
            body: `<!doctype html><html><head><style>
.hero { width: 380px; height: 240px; background: #234; color: #fff; position: relative; }
.hero h1 { font-size: 22px; margin: 0; padding: 8px; }
.hero p { font-size: 13px; margin: 0; padding: 0 8px 8px; }
.tile { width: 200px; height: 88px; border-radius: 16px; background: #111; color: #fff; display: flex; gap: 8px; padding: 8px; }
.tile img { width: 48px; height: 48px; }
.cta { height: 40px; border-radius: 20px; background: #1a3d32; color: #fff; border: 0; padding: 0 16px; display: inline-flex; align-items: center; gap: 8px; }
.pill { height: 40px; border-radius: 20px; background: #1a3d32; color: #fff; border: 0; padding: 0 16px; }
</style></head><body>
<section class="hero">
  <h1>Prices go up from September</h1>
  <p>Sign the contract now and freeze the cost</p>
  <div class="tile"><img src="${gif}" alt="house"><h2>City-3 project</h2>
    <div class="slider__button" style="height:18px">Sign up now<svg width="12" height="12"><circle cx="6" cy="6" r="4" fill="#fff"/></svg></div>
  </div>
  <button class="cta"><span>More info</span><svg width="16" height="16"><circle cx="8" cy="8" r="6" fill="#fff"/></svg></button>
</section>
<p class="benefits">Independent oversight block here</p>
<button class="pill"><span>See projects</span></button>
<button class="pill"><span>Call me now</span></button>
</body></html>`,
        },
    });
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    try {
        await page.goto(srv.origin.href, { waitUntil: "domcontentloaded" });
        const rel = path.join("crops", "home-hero-1-default.png");
        await page.locator("section.hero").screenshot({
            path: path.join(out, rel),
            type: "png",
        });
        const tree = await buildPageTree(page, {
            url: srv.origin.href,
            pageFile: "pages/desktop/home.png",
            slug: "home",
            outDir: out,
            widgets: [
                {
                    kind: "hero",
                    state: "default",
                    file: rel,
                    selector: "section.hero",
                },
            ],
            atoms: [],
        });
        assert.equal(tree.kind, "page");
        assert.equal(tree.file, "pages/desktop/home.png");
        const hero = tree.children.find((c) => c.kind === "hero");
        assert.ok(hero, JSON.stringify(tree));
        assert.ok(
            hero.children.some((c) => c.kind === "heading"),
            JSON.stringify(hero.children.map((c) => c.kind)),
        );
        assert.ok(
            hero.children.some((c) => c.kind === "text"),
            JSON.stringify(hero.children.map((c) => c.kind)),
        );
        const heroDump = JSON.stringify(hero);
        assert.equal(heroDump.includes("Independent oversight"), false, heroDump);
        assert.equal(heroDump.includes("See projects"), false, heroDump);
        assert.ok(
            walk(hero, "link").some((l) => l.text?.includes("Sign up")) ||
                walk(hero, "button").some((b) => b.text?.includes("Sign up")),
            heroDump,
        );
        const heroBtn = hero.children.find((c) => c.kind === "button");
        assert.ok(heroBtn, JSON.stringify(hero.children.map((c) => c.kind)));
        assert.ok(
            heroBtn.children.some((c) => c.kind === "label") ||
                heroBtn.children.some((c) => c.kind === "icon"),
            JSON.stringify(heroBtn.children),
        );
        internTree(tree, out, emptyLibrary());
        const pills = walk(tree, "button").filter(
            (b) => b.text === "See projects" || b.text === "Call me now",
        );
        assert.equal(pills.length, 2, JSON.stringify(walk(tree, "button")));
        assert.equal(pills[0].id, pills[1].id);
        assert.ok(pills[0].id);
    } finally {
        await ctx.close();
        await browser.close();
        await srv.close();
    }
});

test("inactive swiper slide is not collected; hover state attaches", {
    timeout: 60_000,
}, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-tree-"));
    fs.mkdirSync(path.join(out, "crops"), { recursive: true });
    const srv = await startTestServer({
        "/": {
            body: `<!doctype html><html><head><style>
.pill { height: 40px; border-radius: 20px; background: #1a3d32; color: #fff; border: 0; padding: 0 16px; }
.pill:hover { background: #ff0000 !important; }
.swiper-slide { width: 200px; height: 80px; }
.swiper-slide-active { background: #eee; }
</style></head><body>
<section style="width:380px;height:200px;background:#234;color:#fff">
  <h1>Active heading here</h1>
  <div class="swiper-slide swiper-slide-active"><p>Visible slide copy goes here</p></div>
  <div class="swiper-slide"><p>Hidden slide copy should drop</p></div>
  <button class="pill">Hover me now</button>
</section>
</body></html>`,
        },
    });
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    try {
        await page.goto(srv.origin.href, { waitUntil: "domcontentloaded" });
        const { cropAtoms } = await import("./atoms.js");
        const atoms = await cropAtoms(page, out, "home");
        const rel = path.join("crops", "home-hero-1-default.png");
        await page.locator("section").screenshot({ path: path.join(out, rel), type: "png" });
        const tree = await buildPageTree(page, {
            url: srv.origin.href,
            pageFile: "pages/desktop/home.png",
            slug: "home",
            outDir: out,
            widgets: [
                { kind: "hero", state: "default", file: rel, selector: "section" },
            ],
            atoms,
        });
        const texts = walk(tree, "text").map((t) => t.text);
        assert.equal(texts.some((t) => t?.includes("Hidden slide")), false, JSON.stringify(texts));
        assert.equal(texts.some((t) => t?.includes("Visible slide")), true, JSON.stringify(texts));
        const btn = walk(tree, "button").find((b) => b.text === "Hover me now") as
            | CropNode
            | undefined;
        assert.ok(btn, JSON.stringify(walk(tree, "button")));
        assert.ok(btn.states?.hover, JSON.stringify(btn));
    } finally {
        await ctx.close();
        await browser.close();
        await srv.close();
    }
});

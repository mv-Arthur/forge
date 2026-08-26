import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { startTestServer } from "../http/test-server.js";
import { cropWidgets } from "./widgets.js";

const vp = { width: 400, height: 300 };

async function withPage(
    body: string,
    fn: (page: import("playwright").Page) => Promise<void>,
    viewport = vp,
): Promise<void> {
    const srv = await startTestServer({
        "/": { body: `<!doctype html><html><body>${body}</body></html>` },
    });
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport });
    const page = await ctx.newPage();
    try {
        await page.goto(srv.origin.href, { waitUntil: "domcontentloaded" });
        await fn(page);
    } finally {
        await ctx.close();
        await browser.close();
        await srv.close();
    }
}

test("cropWidgets header+form kinds", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-w-"));
    await withPage(
        `<header style="height:80px;width:300px;background:#e8e8e8">HEADER BLOCK</header>
         <form style="height:200px;width:300px;background:#cccccc;padding:8px">
           <label>Name field</label>
           <input name="n" style="height:32px;width:260px">
           <button type="submit" style="height:36px;width:140px">Submit now</button>
         </form>`,
        async (page) => {
            const crops = await cropWidgets(page, out, "home");
            assert.ok(
                crops.some((c) => c.kind === "header"),
                JSON.stringify(crops),
            );
            assert.ok(
                crops.some((c) => c.kind === "form"),
                JSON.stringify(crops),
            );
        },
    );
});

test("8 sibling articles in main → 1 or 2 cards, main is not hero", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-cards-"));
    const cards = Array.from(
        { length: 8 },
        (_, i) =>
            `<article style="height:120px;width:280px;background:#ddd;margin:4px"><h2>CARD TEXT ${i}</h2><p>body copy here</p></article>`,
    ).join("");
    await withPage(`<main>${cards}</main>`, async (page) => {
        const crops = await cropWidgets(page, out, "list");
        const n = crops.filter((c) => c.kind === "card").length;
        assert.ok(n === 1 || n === 2, `cards=${n} ${JSON.stringify(crops)}`);
        for (const h of crops.filter((c) => c.kind === "hero")) {
            const tag = await page.locator(h.selector).first().evaluate((el) => el.tagName);
            assert.notEqual(tag.toLowerCase(), "main", JSON.stringify(crops));
        }
    });
});

test("8 li with img in main → 1 or 2 cards", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-li-"));
    const pixel =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    const lis = Array.from(
        { length: 8 },
        (_, i) =>
            `<li style="height:120px;width:280px;background:#ddd;margin:4px"><img width="80" height="60" src="${pixel}" alt=""><span>House tile ${i} copy</span></li>`,
    ).join("");
    await withPage(`<main><ul>${lis}</ul></main>`, async (page) => {
        const crops = await cropWidgets(page, out, "list");
        const n = crops.filter((c) => c.kind === "card").length;
        assert.ok(n === 1 || n === 2, `cards=${n} ${JSON.stringify(crops)}`);
    });
});

test("two series of 2 tiles → 1 or 2 cards", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-ser-"));
    const pixel =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    const tile = (label: string) =>
        `<div style="height:120px;width:200px;background:#ddd;margin:4px"><img width="80" height="60" src="${pixel}" alt=""><h2>${label} house tile</h2></div>`;
    await withPage(
        `<main>
           <section><h2>Series Alpha title</h2>${tile("A1")}${tile("A2")}</section>
           <section><h2>Series Bravo title</h2>${tile("B1")}${tile("B2")}</section>
         </main>`,
        async (page) => {
            const crops = await cropWidgets(page, out, "ser");
            const n = crops.filter((c) => c.kind === "card").length;
            assert.ok(n === 1 || n === 2, `cards=${n} ${JSON.stringify(crops)}`);
        },
    );
});

test("anchor tiles with nested img → 1 or 2 cards", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-a-"));
    const pixel =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    const item = (label: string) =>
        `<a href="#" style="display:block;height:120px;width:280px;background:#ddd;margin:4px"><span><img width="80" height="60" src="${pixel}" alt=""></span><h2>${label} house tile</h2></a>`;
    await withPage(
        `<main>${item("One")}${item("Two")}${item("Three")}${item("Four")}</main>`,
        async (page) => {
            const crops = await cropWidgets(page, out, "anc");
            const n = crops.filter((c) => c.kind === "card").length;
            assert.ok(n === 1 || n === 2, `cards=${n} ${JSON.stringify(crops)}`);
        },
    );
});

test("nav with 5 li → 0 cards", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-nav-"));
    await withPage(
        `<nav style="height:80px;width:300px;background:#eee"><ul>${Array.from({ length: 5 }, (_, i) => `<li>Item ${i} link</li>`).join("")}</ul></nav>`,
        async (page) => {
            const crops = await cropWidgets(page, out, "nav");
            assert.equal(
                crops.filter((c) => c.kind === "card").length,
                0,
                JSON.stringify(crops),
            );
        },
    );
});

test("header + 400x255 section → hero", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-hero255-"));
    await withPage(
        `<header style="height:20px;width:400px;background:#eee">HEADER BLOCK</header>
         <section style="height:255px;width:400px;background:#bcd">HERO BANNER COPY GOES HERE</section>`,
        async (page) => {
            const crops = await cropWidgets(page, out, "hero255");
            assert.ok(
                crops.some((c) => c.kind === "hero"),
                JSON.stringify(crops),
            );
        },
    );
});

test("tall main is not a taller-than-viewport hero", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-tall-"));
    await withPage(
        `<main style="min-height:800px;width:400px;background:#bcd">TALL MAIN COLUMN COPY HERE</main>`,
        async (page) => {
            const crops = await cropWidgets(page, out, "tall");
            for (const h of crops.filter((c) => c.kind === "hero")) {
                const oh = await page.locator(h.selector).first().evaluate((el) => (el as HTMLElement).offsetHeight);
                assert.ok(oh <= 300, `hero h=${oh} ${JSON.stringify(crops)}`);
            }
        },
    );
});

test("header + 400x200 section → hero", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-hero-"));
    await withPage(
        `<header style="height:40px;width:400px;background:#eee">HEADER BLOCK</header>
         <section style="height:200px;width:400px;background:#bcd">HERO BANNER COPY GOES HERE</section>`,
        async (page) => {
            const crops = await cropWidgets(page, out, "hero");
            assert.ok(
                crops.some((c) => c.kind === "hero"),
                JSON.stringify(crops),
            );
        },
    );
});

test("footer 10 p → footer and 0 cards", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-ft-"));
    const ps = Array.from({ length: 10 }, (_, i) => `<p>Footer line number ${i}</p>`).join("");
    await withPage(
        `<footer style="width:300px;min-height:280px;background:#234;color:#fff;padding:12px">${ps}</footer>`,
        async (page) => {
            const crops = await cropWidgets(page, out, "ft");
            assert.ok(
                crops.some((c) => c.kind === "footer"),
                JSON.stringify(crops),
            );
            assert.equal(
                crops.filter((c) => c.kind === "card").length,
                0,
                JSON.stringify(crops),
            );
        },
    );
});

test("gallery-next 48px is not gallery; data-gallery 400x240 is", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-gal-"));
    await withPage(
        `<button class="gallery-next" style="height:48px;width:48px">n</button>
         <div data-gallery style="height:240px;width:400px;background:#ccc">GALLERY STRIP CONTENT HERE</div>`,
        async (page) => {
            const crops = await cropWidgets(page, out, "gal");
            const gals = crops.filter((c) => c.kind === "gallery");
            assert.ok(gals.length >= 1, JSON.stringify(crops));
            for (const g of gals) {
                const tag = await page.locator(g.selector).first().evaluate((el) => el.tagName);
                assert.notEqual(tag.toLowerCase(), "button");
            }
        },
    );
});

test("aside form → filters", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-fil-"));
    await withPage(
        `<aside style="width:280px;background:#f0f0f0">
           <form style="height:220px;width:260px;background:#e0e0e0;padding:8px">
             <label>Search filters</label>
             <input name="q" style="height:32px;width:220px">
             <button type="submit" style="height:36px;width:160px">Filter now</button>
           </form>
         </aside>`,
        async (page) => {
            const crops = await cropWidgets(page, out, "fil");
            assert.ok(
                crops.some((c) => c.kind === "filters"),
                JSON.stringify(crops),
            );
        },
    );
});

test("white form with visible white input is not a form widget", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-whiteform-"));
    await withPage(
        `<form style="height:200px;width:400px;background:#fff;border:0">
           <input name="n" style="height:32px;width:360px;border:0;background:#fff;color:#fff">
         </form>`,
        async (page) => {
            const crops = await cropWidgets(page, out, "white");
            assert.equal(
                crops.filter((c) => c.kind === "form").length,
                0,
                JSON.stringify(crops),
            );
        },
    );
});

test("hidden-only form is not a form widget", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-hidform-"));
    await withPage(
        `<form style="height:200px;width:400px;background:#fff">
           <input type="hidden" name="x" value="1">
         </form>`,
        async (page) => {
            const crops = await cropWidgets(page, out, "hid");
            assert.equal(
                crops.filter((c) => c.kind === "form").length,
                0,
                JSON.stringify(crops),
            );
        },
    );
});

test("30 empty divs → 0 widget crops", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-w0-"));
    const chrome = Array.from(
        { length: 30 },
        () => `<div style="height:40px;width:100px"></div>`,
    ).join("");
    await withPage(chrome, async (page) => {
        const crops = await cropWidgets(page, out, "empty");
        assert.equal(crops.length, 0, JSON.stringify(crops));
    });
});

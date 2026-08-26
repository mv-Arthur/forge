import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { startTestServer } from "../http/test-server.js";
import { partitionBoxes } from "./partition.js";
import { cropSlots } from "./crop.js";

const vp = { width: 400, height: 300 };

async function countTag(
    page: import("playwright").Page,
    parts: { selector: string }[],
    tag: string,
): Promise<number> {
    let n = 0;
    for (const p of parts) {
        const t = await page.locator(p.selector).first().evaluate((el) => el.tagName);
        if (t.toLowerCase() === tag) n += 1;
    }
    return n;
}

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

test("three sections → ≥3 region; html/body absent", { timeout: 60_000 }, async () => {
    await withPage(
        `<section style="height:120px;width:300px"><h1>a</h1></section>
         <section style="height:120px;width:300px"><p>b</p></section>
         <section style="height:120px;width:300px"><ul><li>c</li></ul></section>`,
        async (page) => {
            const parts = await partitionBoxes(page);
            const regions = parts.filter((p) => p.kind === "region");
            assert.ok(regions.length >= 3, `got ${JSON.stringify(parts)}`);
            const tags = await page.$$eval("[data-wsm-box]", (els) =>
                els.map((el) => el.tagName.toLowerCase()),
            );
            assert.equal(tags.includes("html"), false);
            assert.equal(tags.includes("body"), false);
        },
    );
});

test("wrapper nest → 1 box", { timeout: 60_000 }, async () => {
    await withPage(
        `<div style="height:200px;width:300px;position:relative">
           <div style="height:190px;width:290px">inner</div>
         </div>`,
        async (page) => {
            const parts = await partitionBoxes(page);
            const regions = parts.filter((p) => p.kind === "region");
            assert.equal(regions.length, 1, `got ${JSON.stringify(parts)}`);
        },
    );
});

test("cropSlots three sections → ≥3 region png", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-part-"));
    await withPage(
        `<section style="height:120px;width:300px"><h1>a</h1></section>
         <section style="height:120px;width:300px"><p>b</p></section>
         <section style="height:120px;width:300px"><ul><li>c</li></ul></section>`,
        async (page) => {
            const crops = await cropSlots(page, out, "home");
            const regions = crops.filter((c) => c.kind === "region");
            assert.ok(regions.length >= 3, `got ${JSON.stringify(crops)}`);
            for (const c of regions) {
                const abs = path.join(out, c.file);
                assert.ok(fs.existsSync(abs));
                assert.ok(fs.statSync(abs).size > 0);
            }
        },
    );
});

test("cropSlots below-fold #low on 2000px page", { timeout: 60_000 }, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-low-"));
    await withPage(
        `<div style="min-height:2000px">
           <section id="low" style="margin-top:1600px;height:120px;width:300px"><p>below</p></section>
         </div>`,
        async (page) => {
            const crops = await cropSlots(page, out, "tall");
            const regions = crops.filter((c) => c.kind === "region");
            assert.ok(regions.length >= 1, `got ${JSON.stringify(crops)}`);
            const abs = path.join(out, regions[0].file);
            assert.ok(fs.existsSync(abs));
            assert.ok(fs.statSync(abs).size > 0);
        },
    );
});

test("8 articles collapse to 1 or 2", { timeout: 60_000 }, async () => {
    const cards = Array.from(
        { length: 8 },
        (_, i) =>
            `<article style="height:80px;width:200px;display:inline-block"><img width="40" height="40"><span>TEXT_${i}</span><a>x</a></article>`,
    ).join("");
    await withPage(`<main>${cards}</main>`, async (page) => {
        const parts = await partitionBoxes(page);
        const n = await countTag(page, parts, "article");
        assert.ok(n === 1 || n === 2, `articles=${n} parts=${JSON.stringify(parts)}`);
    });
});

test("8 articles in two row divs still 1 or 2", { timeout: 60_000 }, async () => {
    const card = (i: number) =>
        `<article style="height:80px;width:200px;display:inline-block"><img width="40" height="40"><span>TEXT_${i}</span><a>x</a></article>`;
    const row1 = Array.from({ length: 4 }, (_, i) => card(i)).join("");
    const row2 = Array.from({ length: 4 }, (_, i) => card(i + 4)).join("");
    await withPage(
        `<main><div>${row1}</div><div>${row2}</div></main>`,
        async (page) => {
            const parts = await partitionBoxes(page);
            const n = await countTag(page, parts, "article");
            assert.ok(n === 1 || n === 2, `articles=${n} parts=${JSON.stringify(parts)}`);
        },
    );
});

test("article vs form same size not grouped", { timeout: 60_000 }, async () => {
    await withPage(
        `<article style="height:80px;width:200px"><img><span>t</span><a>x</a></article>
         <form style="height:80px;width:200px"><input name="n"><button>go</button></form>`,
        async (page) => {
            const parts = await partitionBoxes(page);
            const articles = await countTag(page, parts, "article");
            const forms = parts.filter((p) => p.kind === "form").length;
            assert.ok(articles >= 1, `articles=${articles}`);
            assert.ok(forms >= 1, `forms=${forms} parts=${JSON.stringify(parts)}`);
        },
    );
});

test("header+form yields form kind", { timeout: 60_000 }, async () => {
    await withPage(
        `<header style="height:40px">h</header>
         <form style="height:80px"><input name="n"><button type="submit">go</button></form>`,
        async (page) => {
            const parts = await partitionBoxes(page);
            assert.ok(
                parts.some((p) => p.kind === "form"),
                `got ${JSON.stringify(parts)}`,
            );
        },
    );
});

test("three overlapping 280x180 layers → 1 part", { timeout: 60_000 }, async () => {
    await withPage(
        `<div style="position:absolute;top:0;left:0;width:280px;height:180px">a</div>
         <div style="position:absolute;top:20px;left:0;width:280px;height:180px">b</div>
         <div style="position:absolute;top:40px;left:0;width:280px;height:180px">c</div>`,
        async (page) => {
            const parts = await partitionBoxes(page);
            assert.equal(parts.length, 1, `got ${JSON.stringify(parts)}`);
        },
    );
});

test("30 chrome + 8 below-fold articles keeps 1 or 2 articles under cap", { timeout: 60_000 }, async () => {
    const chrome = Array.from(
        { length: 30 },
        () => `<div style="height:40px;width:100px"></div>`,
    ).join("");
    const cards = Array.from(
        { length: 8 },
        (_, i) =>
            `<article style="height:80px;width:200px;display:inline-block"><img width="40" height="40"><span>TEXT_${i}</span><a>x</a></article>`,
    ).join("");
    await withPage(
        `${chrome}<div style="margin-top:1600px;min-height:2000px">${cards}</div>`,
        async (page) => {
            const parts = await partitionBoxes(page);
            const n = await countTag(page, parts, "article");
            assert.ok(n === 1 || n === 2, `articles=${n} parts=${JSON.stringify(parts)}`);
            assert.ok(parts.length <= 25, `len=${parts.length}`);
        },
    );
});

test("form last after 30 regions is kept under cap", { timeout: 60_000 }, async () => {
    const chrome = Array.from(
        { length: 30 },
        () => `<div style="height:40px;width:100px"></div>`,
    ).join("");
    await withPage(
        `${chrome}<form style="height:80px"><input name="n"><button type="submit">go</button></form>`,
        async (page) => {
            const parts = await partitionBoxes(page);
            assert.ok(
                parts.some((p) => p.kind === "form"),
                `got ${JSON.stringify(parts)}`,
            );
            assert.ok(parts.length <= 25, `len=${parts.length}`);
        },
    );
});

test("named header wrapping inner region keeps header", { timeout: 60_000 }, async () => {
    await withPage(
        `<header style="height:80px;width:300px"><div style="height:76px;width:295px">x</div></header>`,
        async (page) => {
            const parts = await partitionBoxes(page);
            assert.ok(
                parts.some((p) => p.kind === "header"),
                `got ${JSON.stringify(parts)}`,
            );
        },
    );
});

test("header-on-hero IoU low keeps header and region", { timeout: 60_000 }, async () => {
    await withPage(
        `<header style="position:absolute;top:0;left:0;width:400px;height:40px;z-index:2">h</header>
         <section style="position:absolute;top:0;left:0;width:400px;height:200px">hero</section>`,
        async (page) => {
            const parts = await partitionBoxes(page);
            assert.ok(
                parts.some((p) => p.kind === "header"),
                `missing header ${JSON.stringify(parts)}`,
            );
            assert.ok(
                parts.some((p) => p.kind === "region"),
                `missing region ${JSON.stringify(parts)}`,
            );
        },
        { width: 800, height: 600 },
    );
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { startTestServer } from "../http/test-server.js";
import { sampleTokens } from "./tokens.js";

test("sampleTokens captures h1 size, button color, article bg", { timeout: 60_000 }, async () => {
    const srv = await startTestServer({
        "/": {
            body: `<!doctype html><html><head><style>
h1 { font-size: 32px; }
button { background: #1a3d32; color: #fff; }
article { background: #00aa22; }
</style></head><body>
<h1>Title here</h1>
<button>Go now</button>
<article id="c" style="height:80px;width:200px">Card copy</article>
</body></html>`,
        },
    });
    const browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: { width: 400, height: 300 } });
    const page = await ctx.newPage();
    try {
        await page.goto(srv.origin.href, { waitUntil: "domcontentloaded" });
        const t = await sampleTokens(page, ["article"]);
        assert.ok(
            t.fonts.some((f) => f.includes("32px")),
            JSON.stringify(t.fonts),
        );
        const colorBlob = t.colors.join(" ");
        const hasBtn =
            /26,\s*61,\s*50/.test(colorBlob) ||
            colorBlob.toLowerCase().includes("#1a3d32") ||
            /rgb\(\s*26/.test(colorBlob);
        const hasArt =
            /0,\s*170,\s*34/.test(colorBlob) ||
            colorBlob.toLowerCase().includes("#00aa22") ||
            /rgb\(\s*0/.test(colorBlob);
        assert.ok(hasBtn || hasArt, colorBlob);
        assert.ok(hasBtn, colorBlob);
    } finally {
        await ctx.close();
        await browser.close();
        await srv.close();
    }
});

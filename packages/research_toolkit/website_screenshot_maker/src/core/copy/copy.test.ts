import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { startTestServer } from "../http/test-server.js";
import { copy } from "./copy.js";
import type { CaptureConfig } from "../index.js";
import type { CopyDump } from "./types.js";

const device = {
    id: "desktop",
    width: 800,
    height: 600,
    deviceScaleFactor: 1,
    isMobile: false,
};

const HOME = `<!doctype html><html><head><title>Home</title></head><body>
<header>
  <nav>
    <a href="/projects">Проекты</a>
    <a href="/works">Объекты</a>
  </nav>
</header>
<main>
  <p>Дома под ключ</p>
  <h1>Готовые проекты</h1>
  <a href="/projects">Смотреть каталог</a>
  <div><div>12</div><div>лет на рынке</div></div>
  <h2>Популярные проекты</h2>
  <p>Фото, цена и параметры из прайса.</p>
  <form>
    <label for="name">Имя</label>
    <input id="name" name="name" placeholder="Ваше имя">
    <button type="submit">Позвоните мне</button>
  </form>
</main>
<footer>
  <a href="/privacy">Политика</a>
  <img src="/x.png" alt="офис">
</footer>
</body></html>`;

test("copy writes copy.json without PNG and classifies home", {
    timeout: 120_000,
}, async () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "wsm-copy-run-"));
    const sitemap = { type: "application/xml", body: "<urlset></urlset>" };
    const routes: Record<string, { type?: string; body?: string; status?: number }> = {
        "/robots.txt": { type: "text/plain", body: "User-agent: *\n" },
        "/sitemap.xml": sitemap,
        "/sitemap_index.xml": {
            type: "application/xml",
            body: "<sitemapindex/>",
        },
        "/": { body: HOME },
        "/projects": {
            body: `<!doctype html><title>Projects</title><body><h1>Каталог</h1></body>`,
        },
        "/missing": { status: 404, body: "no" },
    };
    const srv = await startTestServer(routes);
    const origin = srv.origin.origin;
    sitemap.body = `<urlset>${[
        `${origin}/`,
        `${origin}/projects`,
        `${origin}/missing`,
    ]
        .map((u) => `<url><loc>${u}</loc></url>`)
        .join("")}</urlset>`;

    const config: CaptureConfig = {
        origin: srv.origin,
        out,
        devices: [device],
        concurrency: 2,
        tabsPerBrowser: 1,
        navTimeout: 8000,
        locale: "ru-RU",
    };
    try {
        const dump = await copy(config, {
            pack: {
                exactPaths: ["/", "/projects", "/missing"],
                includePathPrefixes: [],
            },
        });
        assert.equal(dump.site, origin);
        assert.equal(dump.deviceId, "desktop");
        const file = path.join(out, "copy.json");
        assert.ok(fs.existsSync(file));
        const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as CopyDump;
        assert.equal(parsed.pages.length, dump.pages.length);

        const home = dump.pages.find((p) => new URL(p.url).pathname === "/");
        assert.ok(home);
        assert.equal(home.status, "ok");
        assert.equal(home.title, "Home");
        const roles = home.blocks.map((b) => b.role);
        assert.ok(roles.includes("h1"));
        assert.ok(roles.includes("eyebrow"));
        assert.ok(roles.includes("nav"));
        assert.ok(roles.includes("cta"));
        assert.ok(roles.includes("kpi-value"));
        assert.ok(roles.includes("kpi-label"));
        assert.ok(roles.includes("form-label"));
        assert.ok(roles.includes("placeholder"));
        assert.ok(roles.includes("alt"));
        const h1 = home.blocks.find((b) => b.role === "h1");
        assert.equal(h1?.slot, "hero");
        assert.equal(h1?.text, "Готовые проекты");
        const cta = home.blocks.find((b) => b.role === "cta" && b.slot === "form");
        assert.equal(cta?.text, "Позвоните мне");

        const missing = dump.pages.find((p) => new URL(p.url).pathname === "/missing");
        assert.ok(missing);
        assert.equal(missing.status, "skipped");
        assert.equal(missing.reason, "http_404");

        const pngs = fs.existsSync(path.join(out, "pages"))
            ? fs.readdirSync(path.join(out, "pages"), { recursive: true })
            : [];
        assert.equal(
            pngs.filter((n) => String(n).endsWith(".png")).length,
            0,
        );
    } finally {
        await srv.close();
    }
});

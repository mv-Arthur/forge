import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
    induceClusters,
    loadConfig,
    loadMatrix,
    atlas,
} from "website_screenshot_maker";
import { fetchText } from "../../../../packages/research_toolkit/website_screenshot_maker/src/core/http/http.ts";
import {
    isNestedSitemap,
    parseRobotsSitemaps,
    parseSitemapLocs,
    parseHtmlHrefs,
} from "../../../../packages/research_toolkit/website_screenshot_maker/src/core/extract/extract.ts";
import {
    isSkippablePath,
    normalizeUrl,
    sameApexOrigin,
    acceptPageHref,
    isPaginationOnly,
} from "../../../../packages/research_toolkit/website_screenshot_maker/src/core/url/url.ts";
import { gwdPack } from "../packs/gwd.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RESEARCH = path.resolve(HERE, "..");
const ROOT = path.resolve(process.env.HOME, "Documents/gwd-oneshot-spec");

const mode = process.argv[2] || "frontier";
const matrix = loadMatrix(path.join(RESEARCH, "matrix.json"));

function writeJson(file, data) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

async function sitemapUrls(origin) {
    const seeds = new Set([
        new URL("/sitemap.xml", origin).href,
        new URL("/sitemap_index.xml", origin).href,
    ]);
    try {
        const robots = await fetchText(new URL("/robots.txt", origin).href);
        for (const loc of parseRobotsSitemaps(robots.body)) {
            if (sameApexOrigin(loc, origin)) seeds.add(loc);
        }
    } catch {
        /* */
    }
    const found = new Set();
    const queue = [...seeds];
    const seenMaps = new Set();
    while (queue.length) {
        const mapUrl = queue.shift();
        if (!mapUrl || seenMaps.has(mapUrl)) continue;
        seenMaps.add(mapUrl);
        try {
            const xml = await fetchText(mapUrl);
            for (const loc of parseSitemapLocs(xml.body)) {
                if (isNestedSitemap(loc)) {
                    if (sameApexOrigin(loc, origin)) queue.push(loc);
                    continue;
                }
                const n = normalizeUrl(loc, origin);
                if (n && !isSkippablePath(new URL(n).pathname)) found.add(n);
            }
        } catch {
            /* */
        }
    }
    return found;
}

/** BFS capped so frontier stays complete via sitemap; crawl fills gaps from home. */
async function crawlCap(seeds, origin, maxFetch = 80) {
    const found = new Set();
    const queue = [];
    const fetched = new Set();
    for (const seed of seeds) {
        found.add(seed);
        if (!isPaginationOnly(seed)) queue.push(seed);
    }
    while (queue.length && fetched.size < maxFetch) {
        const url = queue.shift();
        if (!url || fetched.has(url)) continue;
        fetched.add(url);
        try {
            const res = await fetchText(url);
            if (res.status >= 400) continue;
            const pageUrl = new URL(url);
            for (const h of parseHtmlHrefs(res.body)) {
                const n = acceptPageHref(h, pageUrl, origin);
                if (!n || found.has(n)) continue;
                found.add(n);
                if (!isPaginationOnly(n)) queue.push(n);
            }
        } catch {
            /* */
        }
    }
    return found;
}

async function buildFrontier() {
    const cfgPath = path.join(ROOT, "tools/frontier-config.json");
    writeJson(cfgPath, {
        origin: "https://www.gwd.ru",
        devices: ["desktop"],
        concurrency: 4,
        tabsPerBrowser: 1,
        navTimeout: 45000,
        locale: "ru-RU",
        out: path.join(ROOT, "seed"),
    });
    const config = loadConfig(cfgPath, matrix);
    const origin = config.origin;
    console.error("sitemap…");
    const fromMaps = await sitemapUrls(origin);
    console.error(`sitemap locs ${fromMaps.size}`);
    const home = normalizeUrl(origin.href, origin);
    if (home) fromMaps.add(home);
    console.error("crawlCap home…");
    const crawled = await crawlCap(home ? [home] : [], origin, 80);
    console.error(`crawl added unique…`);
    const urls = [...new Set([...fromMaps, ...crawled])].sort();
    console.error(`frontier ${urls.length}`);

    const clusters = induceClusters(urls);
    const templates = [];
    for (const [pathPattern, list] of clusters) {
        const listingDetailSplit =
            pathPattern.includes(":id") ||
            (list.length >= 3 && pathPattern !== "/");
        const pageId =
            pathPattern === "/"
                ? "home"
                : pathPattern
                      .replace(/^\//, "")
                      .replace(/\//g, "__")
                      .replace(/:/g, "") || "root";
        templates.push({
            id: pathPattern === "/" ? "exact:/" : `pattern:${pathPattern}`,
            pathPattern,
            urls: list,
            representativeUrl: list[0],
            pageId,
            listingDetailSplit,
        });
    }

    const frontier = {
        urls: urls.map((url) => {
            let templateId = null;
            for (const t of templates) {
                if (t.urls.includes(url)) {
                    templateId = t.id;
                    break;
                }
            }
            return {
                url,
                status: "pending",
                templateId,
                pageId: null,
            };
        }),
        meta: {
            source: "sitemap+crawlCap80",
            note: "full discoverUrls BFS uncapped is multi-hour on Bitrix; sitemap carries bulk coverage",
        },
    };

    writeJson(path.join(ROOT, "frontier.json"), frontier);
    writeJson(path.join(ROOT, "templates.json"), { templates });

    const res = await fetch("https://www.gwd.ru/", {
        headers: { "user-agent": "gwd-oneshot-spec/1.0" },
    });
    const html = await res.text();
    const external = new Set();
    const re = /href\s*=\s*["']([^"']+)["']/gi;
    let m;
    while ((m = re.exec(html))) {
        try {
            const u = new URL(m[1], "https://www.gwd.ru/");
            if (u.protocol !== "http:" && u.protocol !== "https:") continue;
            if (
                u.hostname === origin.hostname ||
                u.hostname.endsWith(".gwd.ru")
            )
                continue;
            u.hash = "";
            external.add(u.origin + u.pathname);
        } catch {
            /* */
        }
    }
    writeJson(path.join(ROOT, "external-links.json"), {
        links: [...external].sort(),
    });
    console.log(
        JSON.stringify({
            urls: urls.length,
            templates: templates.length,
            external: external.size,
            withId: templates.filter((t) => t.pathPattern.includes(":id"))
                .length,
        }),
    );
}

async function buildAtlasSeed() {
    const cfgPath = path.join(ROOT, "tools/seed-atlas-config.json");
    writeJson(cfgPath, {
        origin: "https://www.gwd.ru",
        devices: ["desktop"],
        concurrency: 3,
        tabsPerBrowser: 1,
        navTimeout: 45000,
        locale: "ru-RU",
        out: path.join(ROOT, "seed"),
    });
    const config = loadConfig(cfgPath, matrix);
    console.error("atlas seed (allow gwdPack)…");
    await atlas(config, { allow: gwdPack });
    const atlasPath = path.join(ROOT, "seed", "atlas.json");
    if (!fs.existsSync(atlasPath)) {
        throw new Error("seed/atlas.json missing after atlas()");
    }
    console.log(JSON.stringify({ atlas: atlasPath, ok: true }));
}

if (mode === "atlas") await buildAtlasSeed();
else await buildFrontier();

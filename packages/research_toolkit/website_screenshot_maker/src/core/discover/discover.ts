import type { CaptureConfig } from "../index.js";
import { crawlPages } from "../crawl/index.js";
import {
    isNestedSitemap,
    parseRobotsSitemaps,
    parseSitemapLocs,
} from "../extract/index.js";
import { fetchText } from "../http/index.js";
import { isSkippablePath, normalizeUrl, sameApexOrigin } from "../url/index.js";

/**
 * Sitemap из robots.txt плюс /sitemap.xml и /sitemap_index.xml.
 */
async function sitemapSeeds(origin: URL): Promise<string[]> {
    const seeds = new Set<string>([
        new URL("/sitemap.xml", origin).href,
        new URL("/sitemap_index.xml", origin).href,
    ]);
    try {
        const robots = await fetchText(new URL("/robots.txt", origin).href);
        for (const loc of parseRobotsSitemaps(robots.body)) {
            if (sameApexOrigin(loc, origin)) seeds.add(loc);
        }
    } catch {
        /* default seeds remain */
    }
    return [...seeds];
}

/**
 * Собрать уникальные HTML-URL: sitemap-индекс ∪ BFS от home.
 */
export async function discoverUrls(config: CaptureConfig): Promise<string[]> {
    const { origin } = config;
    const found = new Set<string>();

    const queue = await sitemapSeeds(origin);
    const seenMaps = new Set<string>();
    while (queue.length) {
        const mapUrl = queue.shift();
        if (!mapUrl || seenMaps.has(mapUrl)) continue;
        seenMaps.add(mapUrl);
        try {
            const xml = await fetchText(mapUrl);
            const locs = parseSitemapLocs(xml.body);
            for (const loc of locs) {
                if (isNestedSitemap(loc)) {
                    if (sameApexOrigin(loc, origin)) queue.push(loc);
                    continue;
                }
                const n = normalizeUrl(loc, origin);
                if (n && !isSkippablePath(new URL(n).pathname)) found.add(n);
            }
        } catch {
            /* skip broken sitemap */
        }
    }

    const home = normalizeUrl(origin.href, origin);
    if (home) found.add(home);

    const crawled = await crawlPages(home ? [home] : [], origin);
    return [...new Set([...found, ...crawled])].sort();
}

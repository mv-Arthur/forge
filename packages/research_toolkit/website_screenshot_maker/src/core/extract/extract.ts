/** Строки Sitemap: из robots.txt. */
export function parseRobotsSitemaps(robots: string): string[] {
    const out: string[] = [];
    const re = /^\s*sitemap\s*:\s*(\S+)/i;
    for (const line of robots.split(/\r?\n/)) {
        const m = line.match(re);
        if (m) out.push(m[1].trim());
    }
    return out;
}

/** URL из <loc> sitemap, включая CDATA. */
export function parseSitemapLocs(xml: string): string[] {
    const re = /<loc>\s*(?:<!\[CDATA\[(.*?)\]\]>|([^<]+?))\s*<\/loc>/gi;
    return [...xml.matchAll(re)].map((m) => (m[1] ?? m[2]).trim()).filter(Boolean);
}

/** href="..." / href='...' , пробелы вокруг = допускаются. */
export function parseHtmlHrefs(html: string): string[] {
    const re = /href\s*=\s*["']([^"']+)["']/gi;
    return [...html.matchAll(re)].map((m) => m[1]);
}

/** Вложенный sitemap (.xml / .xml.gz, с query или без). */
export function isNestedSitemap(url: string): boolean {
    return /\.xml(?:\.gz)?(?:\?|$)/i.test(url);
}

import { matchPath, type SitePack } from "./pack.js";

export function pathnameOf(url: string): string {
    try {
        return new URL(url).pathname;
    } catch {
        return url.startsWith("/") ? url : `/${url}`;
    }
}

/** Group URLs by pack template id. URLs that do not match the pack are dropped. */
export function clusterByPath(
    urls: string[],
    pack?: SitePack,
): Map<string, string[]> {
    const map = new Map<string, string[]>();
    for (const url of urls) {
        const id = matchPath(pathnameOf(url), pack);
        if (id === null) continue;
        const list = map.get(id);
        if (list) list.push(url);
        else map.set(id, [url]);
    }
    return map;
}

/** First, last, and evenly spaced URLs, capped at k. */
export function sampleCluster(urls: string[], k = 6): string[] {
    if (urls.length <= k) return [...urls];
    if (k <= 0) return [];
    if (k === 1) return [urls[0]];
    const out: string[] = [];
    const last = k - 1;
    for (let i = 0; i < k; i++) {
        const idx =
            i === 0
                ? 0
                : i === last
                  ? urls.length - 1
                  : Math.round((i / last) * (urls.length - 1));
        const u = urls[idx];
        if (!out.includes(u)) out.push(u);
    }
    return out.slice(0, k);
}

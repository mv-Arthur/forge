import { parseHtmlHrefs } from "../extract/index.js";
import { fetchText } from "../http/index.js";
import { acceptPageHref, isPaginationOnly } from "../url/index.js";

/**
 * Последовательный BFS по HTML от seeds.
 * Пагинационные URL попадают в found, в очередь fetch — нет.
 */
export async function crawlPages(
    seeds: Iterable<string>,
    origin: URL,
): Promise<Set<string>> {
    const found = new Set<string>();
    const queue: string[] = [];
    const fetched = new Set<string>();

    for (const seed of seeds) {
        found.add(seed);
        if (!isPaginationOnly(seed)) queue.push(seed);
    }

    while (queue.length) {
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
            /* skip broken page */
        }
    }

    return found;
}

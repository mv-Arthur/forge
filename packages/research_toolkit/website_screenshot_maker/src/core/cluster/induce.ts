import { collapsePath } from "./pack.js";
import { pathnameOf } from "./cluster.js";

export type InduceOpts = {
    minPrefixCount?: number;
    minUniqueRatio?: number;
};

function norm(pathname: string): string {
    if (!pathname || pathname === "") return "/";
    if (pathname.length > 1 && pathname.endsWith("/")) {
        return pathname.slice(0, -1) || "/";
    }
    return pathname;
}

function segs(pathname: string): string[] {
    const p = collapsePath(norm(pathname));
    if (p === "/") return [];
    return p.split("/").filter(Boolean);
}

export function induceClusters(
    urls: string[],
    opts?: InduceOpts,
): Map<string, string[]> {
    const minPrefixCount = opts?.minPrefixCount ?? 3;
    const minUniqueRatio = opts?.minUniqueRatio ?? 0.5;
    const entries = urls.map((url) => ({
        url,
        segs: segs(pathnameOf(url)),
        home: norm(pathnameOf(url)) === "/",
    }));

    const uniqueNext = new Map<string, Set<string>>();
    const totalNext = new Map<string, number>();
    function add(prefix: string, next: string): void {
        const set = uniqueNext.get(prefix) ?? new Set();
        set.add(next);
        uniqueNext.set(prefix, set);
        totalNext.set(prefix, (totalNext.get(prefix) ?? 0) + 1);
    }
    for (const e of entries) {
        if (e.home) continue;
        let prefix = "";
        for (const s of e.segs) {
            add(prefix || "/", s);
            prefix = prefix + "/" + s;
        }
    }

    function collapseAt(prefix: string): boolean {
        const uniq = uniqueNext.get(prefix)?.size ?? 0;
        const total = totalNext.get(prefix) ?? 0;
        if (total <= 0) return false;
        return uniq >= minPrefixCount && uniq / total >= minUniqueRatio;
    }

    function templateId(e: { segs: string[]; home: boolean }): string {
        if (e.home) return "/";
        const out: string[] = [];
        let prefix = "";
        for (const s of e.segs) {
            const p = prefix || "/";
            if (s === ":id" || collapseAt(p)) out.push(":id");
            else out.push(s);
            prefix = prefix + "/" + s;
        }
        return "/" + out.join("/");
    }

    const map = new Map<string, string[]>();
    for (const e of entries) {
        const id = templateId(e);
        const list = map.get(id);
        if (list) list.push(e.url);
        else map.set(id, [e.url]);
    }
    return map;
}

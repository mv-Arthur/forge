export type SitePack = {
    exactPaths: string[];
    includePathPrefixes: string[];
};

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normPath(pathname: string): string {
    if (!pathname || pathname === "") return "/";
    if (pathname.length > 1 && pathname.endsWith("/")) {
        return pathname.slice(0, -1) || "/";
    }
    return pathname;
}

/** Digit or uuid path segments become `:id`. */
export function collapsePath(pathname: string): string {
    const p = normPath(pathname);
    if (p === "/") return "/";
    const parts = p.split("/").map((seg) => {
        if (!seg) return seg;
        if (/^\d+$/.test(seg) || UUID_RE.test(seg)) return ":id";
        return seg;
    });
    return parts.join("/") || "/";
}

function prefixMatches(pathname: string, prefix: string): boolean {
    const path = normPath(pathname);
    const pre = normPath(prefix);
    if (pre === "/") return false;
    if (path === pre) return true;
    return path.startsWith(`${pre}/`);
}

/**
 * Template id for a pathname, or null if a pack is set and nothing matches.
 * `exactPaths: ["/"]` matches only home. Prefix `"/catalog"` does not match `/`
 * or `/objects/1`.
 */
export function matchPath(pathname: string, pack?: SitePack): string | null {
    const path = normPath(pathname);
    if (!pack) return collapsePath(path);
    for (const exact of pack.exactPaths) {
        if (normPath(exact) === path) return normPath(exact);
    }
    for (const prefix of pack.includePathPrefixes) {
        if (normPath(prefix) === "/") continue;
        if (prefixMatches(path, prefix)) return normPath(prefix);
    }
    return null;
}

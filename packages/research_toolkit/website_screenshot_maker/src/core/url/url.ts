const ASSET_EXT =
    /\.(jpg|jpeg|png|gif|webp|svg|pdf|zip|css|js|xml|json|mp4|webm)$/i;

/** Хост без www — чтобы example.com и www.example.com считались одним сайтом. */
export function apexHost(hostname: string): string {
    return hostname.replace(/^www\./i, "");
}

/** Тот же apex-хост, что у origin (www схлопывается). */
export function sameApexOrigin(raw: string, origin: URL): boolean {
    try {
        const u = new URL(raw, origin);
        return apexHost(u.hostname) === apexHost(origin.hostname);
    } catch {
        return false;
    }
}

/**
 * Привести URL к канону origin: та же схема и хост, без hash.
 * Query выкидывает, кроме поиска и пагинации.
 * Чужой хост или мусор — null.
 */
export function normalizeUrl(raw: string, origin: URL): string | null {
    try {
        const u = new URL(raw, origin);
        if (apexHost(u.hostname) !== apexHost(origin.hostname)) return null;
        u.protocol = origin.protocol;
        u.hostname = origin.hostname;
        u.hash = "";
        if (u.search && !u.pathname.includes("search")) {
            if (!u.searchParams.has("PAGEN_1") && !u.searchParams.has("page")) {
                u.search = "";
            }
        }
        return u.origin + u.pathname + u.search;
    } catch {
        return null;
    }
}

/**
 * href со страницы: сначала резолв от pageUrl, затем канон origin + skip.
 */
export function acceptPageHref(
    raw: string,
    pageUrl: URL,
    origin: URL,
): string | null {
    let absolute: string;
    try {
        absolute = new URL(raw, pageUrl).href;
    } catch {
        return null;
    }
    const n = normalizeUrl(absolute, origin);
    if (!n || isSkippablePath(new URL(n).pathname)) return null;
    return n;
}

/** Канон только с пагинационным query — в found, не в fetch-queue. */
export function isPaginationOnly(url: string): boolean {
    try {
        const u = new URL(url);
        if (u.pathname.includes("search")) return false;
        return u.searchParams.has("PAGEN_1") || u.searchParams.has("page");
    } catch {
        return false;
    }
}

/** Пропустить admin/API и не-HTML (картинки, css, xml, видео). */
export function isSkippablePath(pathname: string): boolean {
    const bad = [
        "/api/",
        "/admin/",
        "/wp-admin/",
        "/wp-json/",
        "/ws/",
        "/upload/",
        "/uploads/",
    ];
    if (bad.some((b) => pathname.includes(b))) return true;
    if (ASSET_EXT.test(pathname)) return true;
    return false;
}

/**
 * Имя файла из пути URL.
 * `+` → `plus`, чтобы `/7+-rooms/` и `/7-rooms/` не писались в один PNG.
 */
export function slugFromUrl(url: string): string {
    const u = new URL(url);
    let p = u.pathname.replace(/\/+$/, "") || "home";
    p = p.replace(/^\//, "");
    if (!p) p = "home";
    p = p
        .replace(/\+/g, "plus")
        .replace(/[^a-zA-Z0-9._/-]+/g, "-")
        .replace(/\/+/g, "__")
        .replace(/-+/g, "-")
        .slice(0, 180);
    if (u.search) {
        const q = u.search
            .slice(1)
            .replace(/[^a-zA-Z0-9=_&-]+/g, "-")
            .slice(0, 40);
        p += "__q_" + q;
    }
    return p || "home";
}

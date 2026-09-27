const LIKED = "preview:liked-projects";
const COMPARE = "preview:compare-projects";

function read(key: string): string[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(raw)
            ? raw.filter((x) => typeof x === "string")
            : [];
    } catch {
        return [];
    }
}

function write(key: string, slugs: string[]) {
    localStorage.setItem(key, JSON.stringify(slugs));
}

export function isLiked(slug: string): boolean {
    return read(LIKED).includes(slug);
}

export function toggleLiked(slug: string): boolean {
    const cur = new Set(read(LIKED));
    if (cur.has(slug)) cur.delete(slug);
    else cur.add(slug);
    write(LIKED, [...cur]);
    return cur.has(slug);
}

export function isCompared(slug: string): boolean {
    return read(COMPARE).includes(slug);
}

export function toggleCompared(slug: string): boolean {
    const cur = new Set(read(COMPARE));
    if (cur.has(slug)) cur.delete(slug);
    else cur.add(slug);
    write(COMPARE, [...cur]);
    return cur.has(slug);
}

export function likeCount(slug: string, liked = false): number {
    let h = 2166136261;
    for (let i = 0; i < slug.length; i += 1) {
        h ^= slug.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return 140 + ((h >>> 0) % 360) + (liked ? 1 : 0);
}

export function formatLikeCount(n: number): string {
    return n.toLocaleString("ru-RU");
}



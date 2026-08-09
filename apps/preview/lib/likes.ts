const LIKES_KEY = "ncottage-preview-likes";
const COMPARE_KEY = "ncottage-preview-compare";
const COMPARE_MAX = 4;

function readList(key: string): string[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;
        return Array.isArray(parsed)
            ? parsed.filter((x): x is string => typeof x === "string")
            : [];
    } catch {
        return [];
    }
}

function writeList(key: string, slugs: string[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(slugs));
}

export function readLikes(): string[] {
    return readList(LIKES_KEY);
}

export function toggleLike(slug: string): boolean {
    const set = new Set(readLikes());
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    writeList(LIKES_KEY, [...set]);
    return set.has(slug);
}

export function isLiked(slug: string): boolean {
    return readLikes().includes(slug);
}

export function readCompare(): string[] {
    return readList(COMPARE_KEY);
}

/** Stub: keep up to COMPARE_MAX projects for comparison UI. */
export function toggleCompare(slug: string): boolean {
    const list = readCompare();
    const idx = list.indexOf(slug);
    if (idx >= 0) {
        list.splice(idx, 1);
        writeList(COMPARE_KEY, list);
        return false;
    }
    if (list.length >= COMPARE_MAX) {
        list.shift();
    }
    list.push(slug);
    writeList(COMPARE_KEY, list);
    return true;
}

export function isCompared(slug: string): boolean {
    return readCompare().includes(slug);
}

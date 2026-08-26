import path from "path";
import { pathToFileURL } from "url";

const FILE_KEYS = new Set(["file", "page"]);

export function assetFileUrl(outDir: string, rel: string): string {
    if (!rel) return rel;
    if (rel.startsWith("file:")) return rel;
    const abs = path.isAbsolute(rel) ? rel : path.resolve(outDir, rel);
    return pathToFileURL(abs).href;
}

export function withAssetFileUrls<T>(value: T, outDir: string): T {
    const root = path.resolve(outDir);
    const walk = (v: unknown): unknown => {
        if (Array.isArray(v)) return v.map(walk);
        if (!v || typeof v !== "object") return v;
        const o = v as Record<string, unknown>;
        const out: Record<string, unknown> = {};
        for (const [k, val] of Object.entries(o)) {
            if (FILE_KEYS.has(k) && typeof val === "string" && val.length > 0) {
                out[k] = assetFileUrl(root, val);
            } else {
                out[k] = walk(val);
            }
        }
        return out;
    };
    return walk(value) as T;
}

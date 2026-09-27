import path from "node:path";

export const ALLOWED_EXT = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".avif",
    ".mp4",
    ".webm",
]);

const MIME: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
};

export function sanitizeSegment(segment: string): string {
    return segment
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function sanitizeFolder(folder: string): string {
    return folder
        .replaceAll("\\", "/")
        .split("/")
        .map(sanitizeSegment)
        .filter((seg) => seg && seg !== "." && seg !== "..")
        .join("/");
}

export function sanitizeFilename(filename: string): string {
    const base = path.basename(filename.replaceAll("\\", "/"));
    const rawExt = path.extname(base);
    const ext = rawExt.toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
        throw new Error(`Недопустимое расширение: ${ext || "(нет)"}`);
    }
    const stem =
        sanitizeSegment(base.slice(0, base.length - rawExt.length)) || "file";
    return `${stem}${ext}`;
}

export function isAllowedExt(filename: string): boolean {
    return ALLOWED_EXT.has(path.extname(filename).toLowerCase());
}

export function mimeFromExt(filename: string): string {
    return (
        MIME[path.extname(filename).toLowerCase()] ?? "application/octet-stream"
    );
}

export function folderFromKey(key: string): string | null {
    const i = key.lastIndexOf("/");
    return i <= 0 ? null : key.slice(0, i);
}

export function keyFrom(folder: string | null, filename: string): string {
    return folder ? `${folder}/${filename}` : filename;
}

export function publicUrl(key: string): string {
    return `/media/${key}`;
}

export function resolveInside(root: string, rel: string): string {
    const normalized = rel.replaceAll("\\", "/");
    if (path.isAbsolute(normalized) || normalized.split("/").includes("..")) {
        throw new Error("Path escapes media root");
    }
    const abs = path.resolve(root, normalized);
    const relToRoot = path.relative(root, abs);
    if (relToRoot.startsWith("..") || path.isAbsolute(relToRoot)) {
        throw new Error("Path escapes media root");
    }
    return abs;
}

export function nextFilename(filename: string, attempt: number): string {
    if (attempt <= 1) return filename;
    const ext = path.extname(filename);
    const stem = path.basename(filename, ext);
    return `${stem}-${attempt}${ext}`;
}

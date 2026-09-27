export function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

export function previewPath(key: string): string {
    return `/media/${key}`;
}

export function folderLabel(path: string): string {
    return path ? path : "корень";
}

export function isVideo(mime: string): boolean {
    return mime.startsWith("video/");
}

export function isImage(mime: string): boolean {
    return mime.startsWith("image/");
}

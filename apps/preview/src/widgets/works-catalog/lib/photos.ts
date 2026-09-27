import type { EnrichedBuiltObject } from "@/types/catalog";

const PREVIEW_MAX = 5;

function isStill(src: string): boolean {
    return !/\.mp4($|\?)/i.test(src);
}

function isLikelyThumb(src: string): boolean {
    return (
        /-\d{2,3}x\d{2,3}\.(jpe?g|png|webp)(\?|$)/i.test(src) ||
        /\/rectangle-\d+\.jpe?g(\?|$)/i.test(src)
    );
}

export function stillPhotos(object: EnrichedBuiltObject): string[] {
    const raw = [object.heroImage, ...object.gallery].filter(
        (src): src is string => Boolean(src),
    );
    const seen = new Set<string>();
    const all: string[] = [];
    for (const src of raw) {
        if (!isStill(src) || seen.has(src)) continue;
        seen.add(src);
        all.push(src);
    }
    const full = all.filter((src) => !isLikelyThumb(src));
    return full.length > 0 ? full : all;
}

export function previewPhotos(object: EnrichedBuiltObject): string[] {
    return stillPhotos(object).slice(0, PREVIEW_MAX);
}

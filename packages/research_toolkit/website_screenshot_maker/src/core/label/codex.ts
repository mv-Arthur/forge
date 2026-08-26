export type CropRefine = (
    crops: { file: string; kind: string }[],
) => Promise<{ keep: string[]; labels: Record<string, string> }>;

function kindLabels<T extends { file: string; kind: string }>(
    crops: T[],
): Record<string, string> {
    const labels: Record<string, string> = {};
    for (const c of crops) labels[c.file] = c.kind;
    return labels;
}

/** export function refineCrops */
export async function refineCrops<T extends { file: string; kind: string }>(
    crops: T[],
    refine?: CropRefine,
): Promise<{ crops: T[]; labels: Record<string, string> }> {
    const fallback = { crops, labels: kindLabels(crops) };
    if (!refine) return fallback;
    try {
        const out = await refine(crops.map((c) => ({ file: c.file, kind: c.kind })));
        if (!out.keep.length) return fallback;
        const keep = new Set(out.keep);
        const kept = crops.filter((c) => keep.has(c.file));
        if (!kept.length) return fallback;
        return { crops: kept, labels: { ...fallback.labels, ...out.labels } };
    } catch {
        return fallback;
    }
}

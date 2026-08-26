import type { Occupancy } from "../dissect/occupancy.js";
import { occupancyKey } from "../dissect/occupancy.js";

export type OccupancyRow = { url: string; occupancy: Occupancy };

function richness(o: Occupancy): number {
    let n = 0;
    if (o.has_form) n += 1;
    if (o.has_gallery) n += 1;
    if (o.has_tabs) n += 1;
    if (o.has_nav) n += 1;
    if (o.card_bucket === "1-3") n += 1;
    if (o.card_bucket === "4+") n += 2;
    return n;
}

/** Unique occupancy vectors: richest, poorest, optional middle. Cap max. */
export function pickRepresentatives(
    rows: OccupancyRow[],
    max = 3,
): string[] {
    if (rows.length === 0) return [];
    const byKey = new Map<string, OccupancyRow>();
    for (const r of rows) {
        const k = occupancyKey(r.occupancy);
        const prev = byKey.get(k);
        if (!prev || richness(r.occupancy) > richness(prev.occupancy)) {
            byKey.set(k, r);
        }
    }
    const unique = [...byKey.values()].sort(
        (a, b) => richness(b.occupancy) - richness(a.occupancy),
    );
    if (unique.length <= max) return unique.map((r) => r.url);
    if (max === 1) return [unique[0].url];
    const out = [unique[0].url, unique[unique.length - 1].url];
    if (max >= 3 && unique.length >= 3) {
        out.splice(1, 0, unique[Math.floor(unique.length / 2)].url);
    }
    return out.slice(0, max);
}

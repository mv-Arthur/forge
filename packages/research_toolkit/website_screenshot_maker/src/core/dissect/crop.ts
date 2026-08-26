import type { Page } from "playwright";
import fs from "fs";
import path from "path";
import { partitionBoxes } from "./partition.js";
import type { Occupancy } from "./occupancy.js";

export type CropFile = {
    kind: string;
    state: string;
    file: string;
    selector: string;
    text?: string;
    chrome?: string;
};

export async function cropSlots(
    page: Page,
    outDir: string,
    slug: string,
    occupancy?: Occupancy,
): Promise<CropFile[]> {
    fs.mkdirSync(outDir, { recursive: true });
    const parts = [...(await partitionBoxes(page))];
    if (occupancy?.has_form && !parts.some((p) => p.kind === "form")) {
        parts.push({ kind: "form", selector: "form" });
    }
    const counts: Record<string, number> = {};
    const out: CropFile[] = [];
    for (const part of parts) {
        const loc = page.locator(part.selector).first();
        try {
            if (!(await loc.isVisible({ timeout: 400 }))) continue;
            const n = (counts[part.kind] = (counts[part.kind] ?? 0) + 1);
            const rel = path.join("crops", `${slug}-${part.kind}-${n}-default.png`);
            const abs = path.join(outDir, rel);
            fs.mkdirSync(path.dirname(abs), { recursive: true });
            await loc.screenshot({ path: abs, type: "png", animations: "disabled" });
            if (fs.existsSync(abs) && fs.statSync(abs).size > 0) {
                out.push({
                    kind: part.kind,
                    state: "default",
                    file: rel,
                    selector: part.selector,
                });
            }
        } catch {
            /* skip missing/hidden */
        }
    }
    return out;
}

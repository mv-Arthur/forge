import type { Page } from "playwright";
import fs from "fs";
import path from "path";
import { SLOT_SELECTORS } from "./occupancy.js";
import type { CropFile } from "./crop.js";
import { screenshotLocator } from "./locator-png.js";
import { collapseRepeats, dropWrappers, nmsOverlap, type Box } from "./partition.js";

const MIN_PNG = 2048;
const FILTERS_SEL = "aside form, [role=search] form";

type WidgetPart = {
    kind: string;
    selector: string;
    x: number;
    y: number;
    w: number;
    h: number;
    i: number;
    childTags: string[];
    parentKey: string;
};

const COLLECT_SRC = `const slots = arg.slots;
const filtersSel = arg.filtersSel;
const minGalleryFrac = arg.minGalleryFrac;
const skip = new Set(["SCRIPT","STYLE","SVG","HEAD","HTML","BODY"]);
const vw = window.innerWidth;
const vh = window.innerHeight;
const viewArea = Math.max(1, vw * vh);
function contentful(el) {
    if (el.tagName === "FORM") {
        const ctrls = el.querySelectorAll("input:not([type=hidden]), textarea, select, button");
        for (const c of ctrls) {
            const stc = window.getComputedStyle(c);
            if (stc.display === "none" || stc.visibility === "hidden") continue;
            const rc = c.getBoundingClientRect();
            if (rc.width * rc.height > 0) return true;
        }
        return false;
    }
    const t = (el.innerText || "").trim();
    if (t.length >= 2) return true;
    return Boolean(el.querySelector("img, svg, video, canvas, input, button, select, textarea"));
}
function rect(el) {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
}
let n = 0;
const raw = [];
function push(el, kind) {
    if (el.hasAttribute("data-wsm-widget")) return;
    if (!contentful(el)) return;
    const r = rect(el);
    if (r.w * r.h <= 0) return;
    const i = n++;
    el.setAttribute("data-wsm-widget", String(i));
    raw.push({
        kind: kind,
        selector: '[data-wsm-widget="' + i + '"]',
        i: i, x: r.x, y: r.y, w: r.w, h: r.h,
        childTags: [...el.children].map((c) => c.tagName.toLowerCase()),
        parentKey: el.parentElement ? el.parentElement.tagName : "",
    });
}
for (const el of document.querySelectorAll("*")) {
    if (skip.has(el.tagName)) continue;
    const st = window.getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden") continue;
    let kind = null;
    try {
        if (el.matches(filtersSel)) kind = "filters";
    } catch (e) {}
    if (!kind) {
        for (const k of Object.keys(slots)) {
            try {
                if (el.matches(slots[k])) { kind = k; break; }
            } catch (e2) {}
        }
    }
    if (!kind) continue;
    if (kind === "gallery") {
        const r = rect(el);
        if (r.w * r.h < minGalleryFrac * viewArea) continue;
    }
    push(el, kind);
}
let cardCands = [];
for (const el of document.querySelectorAll("*")) {
    if (skip.has(el.tagName)) continue;
    if (el.closest("header, nav, footer")) continue;
    const st = window.getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden") continue;
    let like = el.tagName === "ARTICLE";
    if (!like) {
        const r = rect(el);
        if (r.w >= 80 && r.h >= 80 && r.h <= 0.7 * vh && (el.innerText || "").trim().length >= 8) {
            like = Boolean(el.querySelector("img"));
        }
    }
    if (like) cardCands.push(el);
}
let cardEls = cardCands.filter((el) => !cardCands.some((o) => o !== el && el.contains(o)));
for (const el of cardEls) push(el, "card");
let best = null;
let bestA = 0;
for (const el of document.querySelectorAll("*")) {
    if (skip.has(el.tagName)) continue;
    const st = window.getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden") continue;
    try {
        if (el.matches("header, nav, footer, form")) continue;
    } catch (e) {}
    if (cardEls.indexOf(el) >= 0) continue;
    if (cardEls.some((c) => el.contains(c))) continue;
    const r = rect(el);
    if (r.y >= vh || r.y + r.h <= 0) continue;
    if (r.h > vh) continue;
    const a = r.w * r.h;
    if (a < 0.12 * viewArea) continue;
    if (a > bestA) { bestA = a; best = el; }
}
if (best) push(best, "hero");
return raw;`;

function toBox(p: WidgetPart): Box {
    return {
        i: p.i,
        kind: p.kind,
        x: p.x,
        y: p.y,
        w: p.w,
        h: p.h,
        childTags: p.childTags ?? [],
        parentKey: p.parentKey ?? "",
    };
}

async function screenshotPart(
    page: Page,
    part: WidgetPart,
    outDir: string,
    slug: string,
    counts: Record<string, number>,
): Promise<CropFile | null> {
    const loc = page.locator(part.selector).first();
    try {
        if (!(await loc.isVisible({ timeout: 400 }))) return null;
        if (part.kind === "card") {
            const dead = await loc.evaluate((el) => {
                const imgs = Array.from((el as Element).querySelectorAll("img"));
                if (imgs.length === 0) return false;
                return imgs.every((im) => (im as HTMLImageElement).naturalWidth === 0);
            });
            if (dead) return null;
        }
        const n = (counts[part.kind] = (counts[part.kind] ?? 0) + 1);
        const rel = path.join("crops", `${slug}-${part.kind}-${n}-default.png`);
        const abs = path.join(outDir, rel);
        const min = part.kind === "hero" || part.kind === "card" || part.kind === "gallery"
            ? MIN_PNG
            : 1;
        if (!(await screenshotLocator(loc, abs, { minBytes: min }))) return null;
        if (part.kind === "hero") {
            const buf = fs.readFileSync(abs);
            const pngH = buf.length >= 24 ? buf.readUInt32BE(20) : 0;
            const vhPx = page.viewportSize()?.height ?? 0;
            if (vhPx > 0 && pngH >= 0.92 * vhPx) {
                try {
                    fs.unlinkSync(abs);
                } catch {
                    /* */
                }
                return null;
            }
        }
        return {
            kind: part.kind,
            state: "default",
            file: rel,
            selector: part.selector,
        };
    } catch {
        return null;
    }
}

/** export function cropWidgets */
export async function cropWidgets(
    page: Page,
    outDir: string,
    slug: string,
): Promise<CropFile[]> {
    fs.mkdirSync(outDir, { recursive: true });
    const parts = (await page.evaluate(
        new Function("arg", COLLECT_SRC) as (arg: {
            slots: Record<string, string>;
            filtersSel: string;
            minGalleryFrac: number;
        }) => WidgetPart[],
        { slots: SLOT_SELECTORS, filtersSel: FILTERS_SEL, minGalleryFrac: 0.08 },
    )) as WidgetPart[];
    let kept = collapseRepeats(nmsOverlap(dropWrappers(parts.map(toBox))));
    const cards = kept.filter((b) => b.kind === "card");
    if (cards.length > 2) {
        cards.sort((a, b) => a.y - b.y || a.x - b.x);
        const keepCard = new Set([cards[0].i, cards[cards.length - 1].i]);
        kept = kept.filter((b) => b.kind !== "card" || keepCard.has(b.i));
    }
    const keepIds = new Set(kept.map((b) => b.i));
    const ordered = parts.filter((p) => keepIds.has(p.i));
    const counts: Record<string, number> = {};
    const out: CropFile[] = [];
    for (const part of ordered) {
        const c = await screenshotPart(page, part, outDir, slug, counts);
        if (c) out.push(c);
    }
    return out;
}

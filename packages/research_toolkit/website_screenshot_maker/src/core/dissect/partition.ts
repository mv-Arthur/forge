import type { Page } from "playwright";
import { SLOT_SELECTORS } from "./occupancy.js";

/** 80×40 css-px. Unnamed boxes smaller than this are dropped. */
export const MIN_BOX_AREA = 3200;

const REGION_KIND: PartitionPart["kind"] = "region";

export type PartitionPart = {
    kind: string;
    selector: string;
};

export type Box = {
    i: number;
    kind: string;
    x: number;
    y: number;
    w: number;
    h: number;
    childTags: string[];
    parentKey: string;
};

function area(b: Box): number {
    return Math.max(0, b.w) * Math.max(0, b.h);
}

function intersectionArea(a: Box, b: Box): number {
    const x1 = Math.max(a.x, b.x);
    const y1 = Math.max(a.y, b.y);
    const x2 = Math.min(a.x + a.w, b.x + b.w);
    const y2 = Math.min(a.y + a.h, b.y + b.h);
    return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
}

function preferBox(a: Box, b: Box): Box {
    const aNamed = a.kind !== REGION_KIND;
    const bNamed = b.kind !== REGION_KIND;
    if (aNamed !== bNamed) return aNamed ? a : b;
    return area(a) >= area(b) ? a : b;
}

/** IoU = intersection / union. Named kind wins ties against region. */
export function nmsOverlap(boxes: Box[], minIou = 0.5): Box[] {
    const drop = new Set<number>();
    for (let i = 0; i < boxes.length; i++) {
        if (drop.has(boxes[i].i)) continue;
        for (let j = i + 1; j < boxes.length; j++) {
            if (drop.has(boxes[j].i)) continue;
            const inter = intersectionArea(boxes[i], boxes[j]);
            const union = area(boxes[i]) + area(boxes[j]) - inter;
            if (union <= 0) continue;
            if (inter / union < minIou) continue;
            const keep = preferBox(boxes[i], boxes[j]);
            const lose = keep.i === boxes[i].i ? boxes[j] : boxes[i];
            drop.add(lose.i);
            if (lose.i === boxes[i].i) break;
        }
    }
    return boxes.filter((b) => !drop.has(b.i));
}

function contains(outer: Box, inner: Box): boolean {
    return (
        inner.x >= outer.x - 1 &&
        inner.y >= outer.y - 1 &&
        inner.x + inner.w <= outer.x + outer.w + 1 &&
        inner.y + inner.h <= outer.y + outer.h + 1
    );
}

function dropNearDuplicate(inner: Box, outer: Box, drop: Set<number>): void {
    if (outer.kind !== "region" && inner.kind === "region") drop.add(inner.i);
    else drop.add(outer.i);
}

export function dropWrappers(boxes: Box[]): Box[] {
    const drop = new Set<number>();
    for (let i = 0; i < boxes.length; i++) {
        for (let j = 0; j < boxes.length; j++) {
            if (i === j) continue;
            const a = boxes[i];
            const b = boxes[j];
            const aa = area(a);
            const ab = area(b);
            if (aa <= 0 || ab <= 0) continue;
            if (contains(b, a) && aa / ab >= 0.9) dropNearDuplicate(a, b, drop);
            if (contains(a, b) && ab / aa >= 0.9) dropNearDuplicate(b, a, drop);
        }
    }
    return boxes.filter((b) => !drop.has(b.i));
}

function sameRepeat(a: Box, b: Box): boolean {
    if (a.childTags.length < 1) return false;
    if (a.childTags.join(",") !== b.childTags.join(",")) return false;
    const dw = Math.abs(a.w - b.w) / Math.max(a.w, b.w, 1);
    const dh = Math.abs(a.h - b.h) / Math.max(a.h, b.h, 1);
    return dw <= 0.2 && dh <= 0.2;
}

export function collapseRepeats(boxes: Box[]): Box[] {
    const keep = new Set(boxes.map((b) => b.i));
    const used = new Set<number>();
    for (let i = 0; i < boxes.length; i++) {
        if (used.has(boxes[i].i)) continue;
        const cluster = [boxes[i]];
        for (let j = i + 1; j < boxes.length; j++) {
            if (sameRepeat(boxes[i], boxes[j])) cluster.push(boxes[j]);
        }
        if (cluster.length < 3) continue;
        cluster.sort((a, b) => a.y - b.y || a.x - b.x);
        const keepIds = new Set([cluster[0].i, cluster[cluster.length - 1].i]);
        for (const c of cluster) {
            used.add(c.i);
            if (!keepIds.has(c.i)) keep.delete(c.i);
        }
    }
    return boxes.filter((b) => keep.has(b.i));
}

export const CROP_CAP = 25;

export function selectBudget(boxes: Box[], cap = CROP_CAP): Box[] {
    if (boxes.length <= cap) return boxes;
    const named = boxes.filter((b) => b.kind !== "region");
    const unnamed = boxes
        .filter((b) => b.kind === "region")
        .slice()
        .sort((a, b) => b.y - a.y || area(b) - area(a));
    const reserveIds = new Set<number>();
    const reserve: Box[] = [];
    for (const b of named) {
        reserve.push(b);
        reserveIds.add(b.i);
    }
    for (const b of unnamed.slice(0, 2)) {
        if (reserveIds.has(b.i)) continue;
        reserve.push(b);
        reserveIds.add(b.i);
    }
    const out = [...reserve];
    for (const b of unnamed) {
        if (out.length >= cap) break;
        if (reserveIds.has(b.i)) continue;
        out.push(b);
    }
    return out;
}

const COLLECT_SRC = `const slots = arg.slots;
const minArea = arg.minArea;
const skip = new Set(["SCRIPT","STYLE","SVG","HEAD","HTML","BODY"]);
const vw = window.innerWidth;
const vh = window.innerHeight;
const viewArea = Math.max(1, vw * vh);
const parentIds = new WeakMap();
let pid = 0;
function parentKey(el) {
    const p = el.parentElement;
    if (!p) return "root";
    if (!parentIds.has(p)) parentIds.set(p, String(++pid));
    return p.tagName.toLowerCase() + ":" + parentIds.get(p);
}
function nameKind(el) {
    for (const k of Object.keys(slots)) {
        try {
            if (el.matches(slots[k])) return k;
        } catch (e) {}
    }
    return "region"; // kind: "region"
}
const raw = [];
for (const el of document.querySelectorAll("*")) {
    if (skip.has(el.tagName)) continue;
    const st = window.getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    const a = r.width * r.height;
    if (a <= 0) continue;
    const kind = nameKind(el);
    const named = kind !== "region"; // kind: "region" default
    if (named) {
        if (a <= 1) continue;
    } else {
        if (a < minArea) continue;
        if (a >= 0.5 * viewArea) continue;
    }
    raw.push({
        el,
        kind,
        childTags: [...el.children].map((c) => c.tagName.toLowerCase()),
        parentKey: parentKey(el),
        x: r.x,
        y: r.y,
        w: r.width,
        h: r.height,
    });
}
raw.forEach((b, i) => {
    b.el.setAttribute("data-wsm-box", String(i));
});
return raw.map((b, i) => ({
    i,
    kind: b.kind,
    childTags: b.childTags,
    parentKey: b.parentKey,
    x: b.x,
    y: b.y,
    w: b.w,
    h: b.h,
}));`;

/** export function partitionBoxes */
export async function partitionBoxes(page: Page): Promise<PartitionPart[]> {
    const raw = (await page.evaluate(
        new Function("arg", COLLECT_SRC) as (arg: {
            slots: Record<string, string>;
            minArea: number;
        }) => Box[],
        { slots: SLOT_SELECTORS, minArea: MIN_BOX_AREA },
    )) as Box[];
    const kept = selectBudget(collapseRepeats(nmsOverlap(dropWrappers(raw))));
    return kept.map((b) => ({
        kind: b.kind,
        selector: `[data-wsm-box="${b.i}"]`,
    }));
}

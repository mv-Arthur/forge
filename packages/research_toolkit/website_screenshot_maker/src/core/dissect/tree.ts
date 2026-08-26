import type { Page } from "playwright";
import fs from "fs";
import path from "path";
import type { CropFile } from "./crop.js";
import { screenshotLocator } from "./locator-png.js";

export type CropStateFile = {
    file: string;
};

export type CropNode = {
    kind: string;
    state: string;
    file: string;
    selector?: string;
    url?: string;
    text?: string;
    chrome?: string;
    id?: string;
    states?: Record<string, CropStateFile>;
    children: CropNode[];
};

type Box = { x: number; y: number; w: number; h: number };

type CollectedPart = {
    kind: string;
    selector: string;
    text: string;
    chrome: string;
    x: number;
    y: number;
    w: number;
    h: number;
    parentSelector: string | null;
};

type CollectOut = {
    widgets: {
        kind: string;
        selector: string;
        x: number;
        y: number;
        w: number;
        h: number;
        parentSelector: string | null;
    }[];
    parts: CollectedPart[];
};

function area(b: Box): number {
    return Math.max(0, b.w) * Math.max(0, b.h);
}

function contains(outer: Box, inner: Box): boolean {
    if (area(inner) >= area(outer) * 0.92) return false;
    return (
        inner.x >= outer.x - 4 &&
        inner.y >= outer.y - 4 &&
        inner.x + inner.w <= outer.x + outer.w + 4 &&
        inner.y + inner.h <= outer.y + outer.h + 4
    );
}

function seedCounts(outDir: string): Record<string, number> {
    const dir = path.join(outDir, "crops");
    const counts: Record<string, number> = {};
    if (!fs.existsSync(dir)) return counts;
    const re = /-([a-z]+)-(\d+)-[a-z0-9-]+\.png$/;
    for (const n of fs.readdirSync(dir)) {
        const m = n.match(re);
        if (!m) continue;
        const kind = m[1];
        const num = Number(m[2]);
        counts[kind] = Math.max(counts[kind] ?? 0, num);
    }
    return counts;
}

export function emptyPageTree(url: string, file: string): CropNode {
    return {
        kind: "page",
        state: "default",
        file,
        selector: "html",
        url,
        children: [],
    };
}

const COLLECT_SRC = `const widgets = arg.widgets;
function vis(el) {
    const st = window.getComputedStyle(el);
    if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const slide = el.closest(".swiper-slide");
    if (slide && !slide.classList.contains("swiper-slide-active") && !slide.classList.contains("swiper-slide-duplicate-active")) return false;
    if (el.closest(".swiper-pagination, [class*='pagination']")) return false;
    return true;
}
function rect(el) {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
}
function chromeOf(el) {
    const s = window.getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const hasIcon = el.querySelector("svg, img, i, [class*='icon']") ? "1" : "0";
    const ff = (s.fontFamily || "").split(",")[0].trim().replace(/['"]/g, "");
    return [s.color, s.backgroundColor, s.borderRadius, String(Math.round(r.height / 4) * 4), String(Math.round(parseFloat(s.paddingTop) || 0)), String(Math.round(parseFloat(s.paddingLeft) || 0)), (s.boxShadow && s.boxShadow !== "none") ? "s" : "n", s.fontSize, s.fontWeight, ff, s.borderTopColor + ":" + s.borderTopWidth, hasIcon].join("|");
}
function textOf(el) {
    return ((el.innerText || el.value || "") + "").trim().replace(/\\s+/g, " ").slice(0, 160);
}
function looksLikeCta(el) {
    const t = textOf(el);
    if (t.length < 2 || t.length > 40) return false;
    const r = rect(el);
    if (r.h < 14 || r.h > 72 || r.w < 24) return false;
    const cls = (el.className || "").toString().toLowerCase();
    if (cls.includes("button") || cls.includes("btn") || cls.includes("cta")) return true;
    return Boolean(el.querySelector("svg")) && t.length <= 32;
}
function looksLikeButton(el) {
    const r = rect(el);
    if (r.h < 18 || r.h > 80 || r.w < 18) return false;
    if (el.querySelector("h1,h2,h3") && el.querySelector("img") && r.h > 80) return false;
    const s = window.getComputedStyle(el);
    const br = parseFloat(s.borderRadius) || 0;
    const bg = s.backgroundColor;
    const opaque = bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
    const tag = el.tagName;
    if (tag === "BUTTON" || el.getAttribute("role") === "button" || el.getAttribute("type") === "submit") return r.h <= 80;
    if (tag === "A") return opaque && br >= 8 && r.h >= 28 && r.h <= 72;
    return false;
}
function isLeafText(el) {
    if (el.closest("button, [role=button], input, textarea, select")) return false;
    const t = textOf(el);
    if (t.length < 2) return false;
    const kids = [];
    for (let i = 0; i < el.children.length; i++) {
        if (vis(el.children[i])) kids.push(el.children[i]);
    }
    if (kids.length === 0) return true;
    for (let i = 0; i < kids.length; i++) {
        const tag = kids[i].tagName;
        if (tag !== "SPAN" && tag !== "BR" && tag !== "STRONG" && tag !== "B" && tag !== "EM" && tag !== "I") return false;
    }
    return true;
}
function textKind(el) {
    const fs = parseFloat(window.getComputedStyle(el).fontSize) || 0;
    const fw = window.getComputedStyle(el).fontWeight;
    const bold = fw === "bold" || fw === "700" || fw === "600" || Number(fw) >= 600;
    if (fs >= 26 || (fs >= 20 && bold)) return "heading";
    if (textOf(el).length >= 8) return "text";
    return null;
}
function isInnerCard(el, widgetArea) {
    const cls = (el.className || "").toString();
    if (cls.includes("slider-container") || cls.includes("slider-pagination")) return false;
    if (cls.includes("swiper") && !cls.includes("swiper-slide")) return false;
    const slide = el.closest(".swiper-slide");
    if (slide && slide !== el) return false;
    const r = rect(el);
    if (r.w < 80) return false;
    if (r.w * r.h > 0.45 * widgetArea) return false;
    if (textOf(el).length < 8) return false;
    if (el.querySelector("svg, [class*='icon']") && r.h >= 48 && r.h <= 160 && r.w >= 100 && !el.querySelector("img")) return true;
    if (r.h < 80) return false;
    if (!el.querySelector("img, svg, video")) return false;
    if (cls.includes("swiper-slide-active")) return true;
    if (el.tagName === "ARTICLE") return true;
    const br = parseFloat(window.getComputedStyle(el).borderRadius) || 0;
    return br >= 8;
}
function widgetParentSel(el) {
    let best = null;
    let bestA = Infinity;
    for (let i = 0; i < widgetEls.length; i++) {
        const o = widgetEls[i];
        if (o.el === el) continue;
        if (!o.el.contains(el)) continue;
        const a = o.w * o.h;
        if (a < bestA) { bestA = a; best = o; }
    }
    return best ? best.selector : null;
}
const widgetEls = [];
for (const w of widgets) {
    let el = null;
    try { el = document.querySelector(w.selector); } catch (e) { continue; }
    if (!el || !vis(el)) continue;
    const r = rect(el);
    widgetEls.push({ kind: w.kind, selector: w.selector, el: el, x: r.x, y: r.y, w: r.w, h: r.h });
}
widgetEls.sort(function(a, b) { return (b.w * b.h) - (a.w * a.h); });
let n = 0;
const parts = [];
function push(el, kind, parentSel) {
    if (el.hasAttribute("data-wsm-part")) return null;
    if (!vis(el)) return null;
    const r = rect(el);
    if (r.w * r.h <= 0) return null;
    const i = n++;
    el.setAttribute("data-wsm-part", String(i));
    let selector = '[data-wsm-part="' + i + '"]';
    if (el.hasAttribute("data-wsm-atom")) selector = '[data-wsm-atom="' + el.getAttribute("data-wsm-atom") + '"]';
    else if (el.hasAttribute("data-wsm-widget")) selector = '[data-wsm-widget="' + el.getAttribute("data-wsm-widget") + '"]';
    parts.push({ kind: kind, selector: selector, text: textOf(el), chrome: chromeOf(el), x: r.x, y: r.y, w: r.w, h: r.h, parentSelector: parentSel || null });
    return selector;
}
const seenBtn = new Set();
function pushButton(el, parentSel) {
    if (seenBtn.has(el)) return;
    const r = rect(el);
    if (r.h > 80 || (el.querySelector("img") && el.querySelector("h1,h2,h3"))) return;
    const t = textOf(el);
    if (!t && r.w < 36 && r.h < 36) return;
    seenBtn.add(el);
    const btnSel = push(el, "button", parentSel);
    if (!btnSel) return;
    const icons = el.querySelectorAll("svg, img, i, [class*='icon']");
    for (let i = 0; i < icons.length; i++) {
        const ir = rect(icons[i]);
        if (ir.w >= 6 && ir.h >= 6 && ir.w <= 80 && ir.h <= 80) push(icons[i], "icon", btnSel);
    }
    const spans = el.querySelectorAll("span, b, strong, em, p, label");
    for (let i = 0; i < spans.length; i++) {
        if (spans[i].querySelector("svg, img")) continue;
        const tx = textOf(spans[i]);
        if (tx.length >= 1 && tx.length <= 80) push(spans[i], "label", btnSel);
    }
}
function hostWidget(r, el) {
    let best = null;
    let bestA = Infinity;
    for (let i = 0; i < widgetEls.length; i++) {
        const w = widgetEls[i];
        if (w.el === el) continue;
        const oa = w.w * w.h;
        const ia = r.w * r.h;
        if (ia >= oa * 0.92) continue;
        if (r.x < w.x - 4 || r.y < w.y - 4) continue;
        if (r.x + r.w > w.x + w.w + 4) continue;
        if (r.y + r.h > w.y + w.h + 4) continue;
        if (oa < bestA) { bestA = oa; best = w; }
    }
    return best;
}
const nodes = Array.from(document.querySelectorAll("section,footer,h1,h2,h3,h4,p,button,a,img,svg,input,textarea,select,article,div,span,li,[role=button],[type=submit]"));
for (let i = 0; i < nodes.length; i++) {
    const el = nodes[i];
    if (!vis(el)) continue;
    const r = rect(el);
    const w = hostWidget(r, el);
    const parentSel = w ? w.selector : null;
    const warea = w ? Math.max(1, w.w * w.h) : Math.max(1, window.innerWidth * window.innerHeight);
    if (r.w * r.h > 0.85 * warea) continue;
    const tag = el.tagName;
    if (tag === "SECTION" || tag === "FOOTER") {
        let isW = false;
        for (let wi = 0; wi < widgetEls.length; wi++) {
            if (widgetEls[wi].el === el) { isW = true; break; }
        }
        if (!isW) {
            const sh = document.documentElement.scrollHeight;
            const kind = tag === "FOOTER" ? "footer" : "section";
            if (r.h >= 80 && r.w >= 200 && r.h < 0.85 * sh) push(el, kind, parentSel);
        }
        continue;
    }
    if (tag === "BUTTON" || el.getAttribute("role") === "button" || el.getAttribute("type") === "submit" || (tag === "A" && looksLikeButton(el))) {
        pushButton(el, parentSel);
        continue;
    }
    if (tag === "A" && textOf(el).length >= 2 && textOf(el).length <= 48 && r.h <= 48) {
        push(el, "link", parentSel);
        continue;
    }
    if (tag === "DIV") {
        const kids = [];
        for (let ki = 0; ki < el.children.length; ki++) {
            if (vis(el.children[ki])) kids.push(el.children[ki]);
        }
        if (kids.length >= 3 && kids.length <= 8 && r.w >= 0.5 * window.innerWidth && r.h >= 48 && r.h <= 220) {
            const h0 = rect(kids[0]).h;
            let similar = true;
            for (let ki = 1; ki < kids.length; ki++) {
                if (Math.abs(rect(kids[ki]).h - h0) > 24) { similar = false; break; }
            }
            if (similar) {
                push(el, "section", parentSel);
                continue;
            }
        }
    }
    if ((tag === "DIV" || tag === "SPAN") && looksLikeCta(el) && !el.closest("button, [role=button], a.btn, a[class*='btn']")) {
        if (el.querySelector("button, [role=button], a.btn, a[class*='btn']")) continue;
        push(el, "link", parentSel);
        continue;
    }
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        if (el.getAttribute("type") === "hidden") continue;
        push(el, "field", parentSel);
        continue;
    }
    if (tag === "H1" || tag === "H2" || tag === "H3" || tag === "H4") {
        if (textOf(el).length >= 2) push(el, "heading", parentSel);
        continue;
    }
    if (tag === "P") {
        if (el.closest("button, [role=button]")) continue;
        const k = textKind(el) || (textOf(el).length >= 8 ? "text" : null);
        if (k) push(el, k, parentSel);
        continue;
    }
    if (tag === "IMG") {
        if (r.w >= 24 && r.h >= 24 && r.w * r.h < 0.4 * warea) push(el, r.w <= 40 && r.h <= 40 ? "icon" : "image", parentSel);
        continue;
    }
    if (tag === "SVG") {
        if (r.w <= 64 && r.h <= 64 && r.w >= 6 && !el.closest("button, [role=button], a")) push(el, "icon", parentSel);
        continue;
    }
    if (isInnerCard(el, warea)) {
        let nested = false;
        for (let k = 0; k < nodes.length; k++) {
            if (nodes[k] !== el && vis(nodes[k]) && el.contains(nodes[k]) && isInnerCard(nodes[k], warea)) { nested = true; break; }
        }
        if (!nested) push(el, "card", parentSel);
        continue;
    }
    if ((tag === "DIV" || tag === "SPAN" || tag === "LI") && isLeafText(el)) {
        const k = textKind(el);
        if (k) push(el, k, parentSel);
    }
}
const orphans = document.querySelectorAll("button, [role=button], [type=submit], a, h1, h2, h3");
for (let i = 0; i < orphans.length; i++) {
    const el = orphans[i];
    if (!vis(el)) continue;
    let inW = false;
    for (let j = 0; j < widgetEls.length; j++) {
        if (widgetEls[j].el.contains(el) || widgetEls[j].el === el) { inW = true; break; }
    }
    if (inW) continue;
    const tag = el.tagName;
    if (tag === "H1" || tag === "H2" || tag === "H3") {
        if (textOf(el).length >= 2) push(el, "heading", null);
        continue;
    }
    if (looksLikeButton(el)) pushButton(el, null);
}
const outWidgets = [];
for (let i = 0; i < widgetEls.length; i++) {
    const w = widgetEls[i];
    outWidgets.push({ kind: w.kind, selector: w.selector, x: w.x, y: w.y, w: w.w, h: w.h, parentSelector: widgetParentSel(w.el) });
}
return { widgets: outWidgets, parts: parts };`;

type Item = { node: CropNode; box: Box; parentSelector: string | null };

export function collapseCloneChildren(node: CropNode): void {
    for (const ch of node.children) collapseCloneChildren(ch);
    const seen = new Set<string>();
    const out: CropNode[] = [];
    for (const ch of node.children) {
        const key = `${ch.kind}|${ch.chrome ?? ""}|${(ch.text ?? "").trim()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(ch);
    }
    node.children = out;
}

export function mergeAtomStates(
    root: CropNode,
    atoms: { id?: string; state: string; file: string }[],
): void {
    const byId: Record<string, Record<string, CropStateFile>> = {};
    for (const a of atoms) {
        if (!a.id || a.state === "default") continue;
        byId[a.id] ??= {};
        byId[a.id][a.state] = { file: a.file };
    }
    const walk = (n: CropNode): void => {
        if (n.id && byId[n.id] && n.file) {
            n.states ??= { default: { file: n.file } };
            for (const [st, val] of Object.entries(byId[n.id])) {
                if (!n.states[st]) n.states[st] = val;
            }
        }
        for (const c of n.children) walk(c);
    };
    walk(root);
}

export function publicTree(node: CropNode): CropNode {
    const out: CropNode = {
        kind: node.kind,
        state: node.state,
        file: node.file,
        children: node.children.map(publicTree),
    };
    if (node.url) out.url = node.url;
    if (node.text) out.text = node.text;
    if (node.id) out.id = node.id;
    if (node.states) out.states = node.states;
    return out;
}

function attachAtomStates(root: CropNode, atoms: CropFile[]): void {
    const bySel = new Map<string, CropNode>();
    const walk = (n: CropNode): void => {
        if (n.selector) bySel.set(n.selector, n);
        for (const c of n.children) walk(c);
    };
    walk(root);
    for (const a of atoms) {
        if (!a.selector || a.state === "default") continue;
        const node = bySel.get(a.selector);
        if (!node || !node.file) continue;
        node.states ??= { default: { file: node.file } };
        node.states[a.state] = { file: a.file };
    }
}

function attachKindStates(root: CropNode, extras: CropFile[]): void {
    const find = (n: CropNode, kind: string): CropNode | undefined => {
        if (n.kind === kind) return n;
        for (const c of n.children) {
            const hit = find(c, kind);
            if (hit) return hit;
        }
    };
    for (const e of extras) {
        if (e.state === "default") continue;
        const node = find(root, e.kind);
        if (!node || !node.file) continue;
        node.states ??= { default: { file: node.file } };
        node.states[e.state] = { file: e.file };
    }
}

function nestItems(items: Item[]): CropNode[] {
    const bySel = new Map<string, number>();
    for (let i = 0; i < items.length; i++) {
        const sel = items[i].node.selector;
        if (sel && !bySel.has(sel)) bySel.set(sel, i);
    }
    const parentOf: (number | null)[] = items.map(() => null);
    for (let i = 0; i < items.length; i++) {
        let best: number | null = null;
        let bestA = Infinity;
        for (let j = 0; j < items.length; j++) {
            if (i === j) continue;
            if (!contains(items[j].box, items[i].box)) continue;
            const a = area(items[j].box);
            if (a < bestA) {
                bestA = a;
                best = j;
            }
        }
        if (best != null) {
            parentOf[i] = best;
            continue;
        }
        const ps = items[i].parentSelector;
        if (ps) {
            const p = bySel.get(ps);
            if (p != null && p !== i) parentOf[i] = p;
        }
    }
    const bands = items
        .map((it, i) => ({ i, kind: it.node.kind, y: it.box.y }))
        .filter((b) =>
            ["section", "footer"].includes(b.kind) && items[b.i].box.h >= 200,
        )
        .sort((a, b) => a.y - b.y);
    const skipBand = new Set([
        "hero",
        "section",
        "header",
        "nav",
        "form",
        "footer",
        "page",
    ]);
    for (let i = 0; i < items.length; i++) {
        if (parentOf[i] != null) continue;
        if (skipBand.has(items[i].node.kind)) continue;
        const mid = items[i].box.y + items[i].box.h / 2;
        let owner: number | null = null;
        for (let b = bands.length - 1; b >= 0; b--) {
            if (mid >= bands[b].y - 8) {
                owner = bands[b].i;
                break;
            }
        }
        if (owner != null && owner !== i) parentOf[i] = owner;
    }
    for (let i = 0; i < items.length; i++) {
        const p = parentOf[i];
        if (p == null) continue;
        items[p].node.children.push(items[i].node);
    }
    const roots = items
        .filter((_, i) => parentOf[i] == null)
        .sort(
            (a, b) => a.box.y - b.box.y || a.box.x - b.box.x,
        )
        .map((it) => it.node);
    for (const it of items) {
        it.node.children.sort((a, b) => {
            const ia = items.find((x) => x.node === a);
            const ib = items.find((x) => x.node === b);
            if (!ia || !ib) return 0;
            return ia.box.y - ib.box.y || ia.box.x - ib.box.x;
        });
    }
    return roots;
}

export async function buildPageTree(
    page: Page,
    opts: {
        url: string;
        pageFile: string;
        slug: string;
        outDir: string;
        widgets: CropFile[];
        atoms: CropFile[];
        extras?: CropFile[];
    },
): Promise<CropNode> {
    const root = emptyPageTree(opts.url, opts.pageFile);
    const widgetArgs = opts.widgets
        .filter((w) => w.state === "default" || !w.state)
        .map((w) => ({ kind: w.kind, selector: w.selector }));
    const collected = (await page.evaluate(
        new Function("arg", COLLECT_SRC) as (arg: {
            widgets: { kind: string; selector: string }[];
        }) => CollectOut,
        { widgets: widgetArgs },
    )) as CollectOut;

    const fileBySel = new Map<string, string>();
    for (const w of opts.widgets) {
        if (w.selector && w.file) fileBySel.set(w.selector, w.file);
    }
    for (const a of opts.atoms) {
        if (a.state === "default" && a.selector && a.file) fileBySel.set(a.selector, a.file);
    }

    const counts = seedCounts(opts.outDir);
    const items: Item[] = [];

    const widgetFile = new Map<string, string>();
    for (const w of opts.widgets) {
        if ((w.state === "default" || !w.state) && w.selector) widgetFile.set(w.selector, w.file);
    }
    for (const w of collected.widgets) {
        const file = widgetFile.get(w.selector);
        if (!file) continue;
        items.push({
            box: { x: w.x, y: w.y, w: w.w, h: w.h },
            parentSelector: w.parentSelector ?? null,
            node: {
                kind: w.kind,
                state: "default",
                file,
                selector: w.selector,
                children: [],
            },
        });
    }

    for (const p of collected.parts) {
        if (items.length >= 400) break;
        let file = fileBySel.get(p.selector) ?? "";
        if (!file) {
            const n = (counts[p.kind] = (counts[p.kind] ?? 0) + 1);
            const rel = path.join("crops", `${opts.slug}-${p.kind}-${n}-default.png`);
            const abs = path.join(opts.outDir, rel);
            const loc = page.locator(p.selector).first();
            const ok = await screenshotLocator(loc, abs, {
                minBytes: 1,
                unique: false,
                blank: p.kind === "heading" || p.kind === "text" || p.kind === "label" || p.kind === "icon"
                    ? false
                    : true,
            });
            if (!ok) continue;
            file = rel;
            fileBySel.set(p.selector, file);
        }
        items.push({
            box: { x: p.x, y: p.y, w: p.w, h: p.h },
            parentSelector: p.parentSelector ?? null,
            node: {
                kind: p.kind,
                state: "default",
                file,
                selector: p.selector,
                text: p.text || undefined,
                chrome: p.chrome || undefined,
                children: [],
            },
        });
    }

    root.children = nestItems(items);
    collapseCloneChildren(root);
    attachAtomStates(root, opts.atoms);
    if (opts.extras?.length) attachKindStates(root, opts.extras);
    return root;
}

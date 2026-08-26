import type { Page } from "playwright";
import fs from "fs";
import path from "path";
import { screenshotLocator } from "./locator-png.js";
import type { CropFile } from "./crop.js";

const MIN_PNG = 80;
const ATOM_CAP = 12;

const ATOM_GROUPS: { kind: string; sel: string }[] = [
    { kind: "button", sel: "button, [type=submit], [role=button], a.btn, a[class*='btn']" },
    { kind: "check", sel: "input[type=checkbox], input[type=radio], [role=checkbox], [role=radio]" },
    { kind: "tab", sel: "[role=tab]" },
    { kind: "slider", sel: "[role=slider], input[type=range]" },
    { kind: "combo", sel: "[role=combobox]" },
    { kind: "field", sel: "input:not([type=hidden]), textarea, select" },
];

type AtomPart = {
    kind: string;
    selector: string;
    key: string;
    text: string;
    chrome: string;
};

const COLLECT_SRC = `const groups = arg.groups;
function chromeOf(el) {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const hasIcon = el.querySelector("svg, img, i, [class*='icon']") ? "1" : "0";
    const ff = (s.fontFamily || "").split(",")[0].trim().replace(/['\"]/g, "");
    return [s.color, s.backgroundColor, s.borderRadius, String(Math.round(r.height / 4) * 4), String(Math.round(parseFloat(s.paddingTop) || 0)), String(Math.round(parseFloat(s.paddingLeft) || 0)), (s.boxShadow && s.boxShadow !== "none") ? "s" : "n", s.fontSize, s.fontWeight, ff, s.borderTopColor + ":" + s.borderTopWidth, hasIcon].join("|");
}
function contentful(el) {
    const t = (el.innerText || "").trim();
    if (t.length >= 2) return true;
    const tag = el.tagName;
    if (tag === "INPUT" || tag === "BUTTON" || tag === "SELECT" || tag === "TEXTAREA") return true;
    return Boolean(el.querySelector("img, svg, video, canvas, input, button, select, textarea"));
}
const seen = new Set();
const raw = [];
let n = 0;
for (const g of groups) {
    let els;
    try { els = document.querySelectorAll(g.sel); } catch (e) { continue; }
    for (const el of els) {
        if (el.hasAttribute("data-wsm-atom")) continue;
        const st = window.getComputedStyle(el);
        if (st.display === "none" || st.visibility === "hidden") continue;
        const r = el.getBoundingClientRect();
        if (r.width * r.height <= 0) continue;
        if (g.kind === "button" && (r.height > 80 || (el.querySelector("img") && el.querySelector("h1,h2,h3")))) continue;
        if (!contentful(el)) continue;
        const role = el.getAttribute("role") || "";
        const hasText = (el.innerText || el.value || "").trim().length > 0 ? "1" : "0";
        const key = el.tagName + ":" + role + ":" + Math.round(r.width / 20) + ":" + Math.round(r.height / 20) + ":" + hasText;
        if (seen.has(key)) continue;
        seen.add(key);
        const i = n++;
        el.setAttribute("data-wsm-atom", String(i));
        raw.push({
            kind: g.kind,
            selector: '[data-wsm-atom="' + i + '"]',
            key: key,
            text: ((el.innerText || el.value || "") + "").trim().slice(0, 160),
            chrome: chromeOf(el),
        });
        if (raw.length >= arg.cap) return raw;
    }
}
return raw;`;

type StyleSnap = {
    color: string;
    backgroundColor: string;
    borderColor: string;
    boxShadow: string;
    outline: string;
};

async function shotLoc(
    page: Page,
    selector: string,
    outDir: string,
    rel: string,
): Promise<boolean> {
    const loc = page.locator(selector).first();
    try {
        if (!(await loc.isVisible({ timeout: 400 }))) return false;
        const abs = path.join(outDir, rel);
        return screenshotLocator(loc, abs, { minBytes: MIN_PNG });
    } catch {
        return false;
    }
}

async function readStyle(page: Page, selector: string): Promise<StyleSnap | null> {
    try {
        return (await page.locator(selector).first().evaluate((el) => {
            const s = getComputedStyle(el);
            return {
                color: s.color,
                backgroundColor: s.backgroundColor,
                borderColor: s.borderColor,
                boxShadow: s.boxShadow,
                outline: s.outline,
            };
        })) as StyleSnap;
    } catch {
        return null;
    }
}

function styleEqual(a: StyleSnap | null, b: StyleSnap | null): boolean {
    if (!a || !b) return true;
    return (
        a.color === b.color &&
        a.backgroundColor === b.backgroundColor &&
        a.borderColor === b.borderColor &&
        a.boxShadow === b.boxShadow &&
        a.outline === b.outline
    );
}

/** export function cropAtoms */
export async function cropAtoms(
    page: Page,
    outDir: string,
    slug: string,
): Promise<CropFile[]> {
    fs.mkdirSync(outDir, { recursive: true });
    const parts = (await page.evaluate(
        new Function("arg", COLLECT_SRC) as (arg: {
            groups: { kind: string; sel: string }[];
            cap: number;
        }) => AtomPart[],
        { groups: ATOM_GROUPS, cap: ATOM_CAP },
    )) as AtomPart[];
    const counts: Record<string, number> = {};
    const out: CropFile[] = [];
    for (const part of parts) {
        const n = (counts[part.kind] = (counts[part.kind] ?? 0) + 1);
        const rel = path.join("crops", `${slug}-${part.kind}-${n}-default.png`);
        if (await shotLoc(page, part.selector, outDir, rel)) {
            out.push({
                kind: part.kind,
                state: "default",
                file: rel,
                selector: part.selector,
                text: part.text || undefined,
                chrome: part.chrome || undefined,
            });
        }
    }
    const extra = await runAtomPlaybook(page, outDir, slug, out);
    return [...out, ...extra];
}

export async function runAtomPlaybook(
    page: Page,
    outDir: string,
    slug: string,
    atoms: CropFile[],
): Promise<CropFile[]> {
    try {
        await page.evaluate(() => {
            document.addEventListener(
                "submit",
                (e) => e.preventDefault(),
                { capture: true, once: false },
            );
        });
    } catch {
        /* */
    }
    const extra: CropFile[] = [];
    for (const a of atoms) {
        const loc = page.locator(a.selector).first();
        const before = await readStyle(page, a.selector);
        const defAbs = path.join(outDir, a.file);
        const defBuf = fs.existsSync(defAbs) ? fs.readFileSync(defAbs) : null;
        let prevBuf: Buffer | null = null;

        const addState = async (state: string, act: () => Promise<void>, useStyleGate: boolean) => {
            try {
                await act();
                await page.waitForTimeout(40);
                const after = await readStyle(page, a.selector);
                if (useStyleGate && styleEqual(before, after)) return;
                const rel = a.file.replace("-default.png", `-${state}.png`);
                const abs = path.join(outDir, rel);
                if (!(await shotLoc(page, a.selector, outDir, rel))) return;
                const buf = fs.readFileSync(abs);
                if (defBuf && Buffer.compare(defBuf, buf) === 0) {
                    try {
                        fs.unlinkSync(abs);
                    } catch {
                        /* */
                    }
                    return;
                }
                if (prevBuf && Buffer.compare(prevBuf, buf) === 0) {
                    try {
                        fs.unlinkSync(abs);
                    } catch {
                        /* */
                    }
                    return;
                }
                extra.push({
                    kind: a.kind,
                    state,
                    file: rel,
                    selector: a.selector,
                    text: a.text,
                    chrome: a.chrome,
                });
                prevBuf = buf;
            } catch {
                /* */
            }
        };

        if (a.kind === "button") {
            await addState("hover", async () => {
                await loc.hover({ timeout: 400 });
            }, true);
            try {
                const box = await loc.boundingBox();
                if (box) {
                    await page.mouse.move(box.x + box.width + 12, box.y + box.height + 12);
                }
                const vs = page.viewportSize();
                await page.mouse.move(1, Math.max(1, (vs?.height ?? 300) - 1));
                const t0 = Date.now();
                while (Date.now() - t0 < 200) {
                    const now = await readStyle(page, a.selector);
                    if (styleEqual(before, now)) break;
                    await page.waitForTimeout(20);
                }
            } catch {
                /* */
            }
            await addState("focus", async () => {
                await loc.focus({ timeout: 400 });
            }, true);
        }
        if (a.kind === "field") {
            await addState("focus", async () => {
                await loc.focus({ timeout: 400 });
            }, true);
        }
        if (a.kind === "check") {
            await addState("selected", async () => {
                await loc.click({ timeout: 800 });
            }, false);
        }
        if (a.kind === "combo") {
            await addState("open", async () => {
                await loc.click({ timeout: 800 });
            }, false);
        }
        if (a.kind === "slider") {
            await addState("mid", async () => {
                await loc.evaluate((el) => {
                    const n = el as HTMLInputElement;
                    if (n.type === "range") {
                        const min = Number(n.min || 0);
                        const max = Number(n.max || 100);
                        n.value = String((min + max) / 2);
                        n.dispatchEvent(new Event("input", { bubbles: true }));
                    }
                });
            }, false);
        }
    }
    const dis = page.locator("button[disabled], [type=submit][disabled]").first();
    try {
        if ((await dis.count()) > 0 && (await dis.isVisible({ timeout: 200 }))) {
            const rel = path.join("crops", `${slug}-button-1-disabled.png`);
            if (await shotLoc(page, "button[disabled], [type=submit][disabled]", outDir, rel)) {
                extra.push({
                    kind: "button",
                    state: "disabled",
                    file: rel,
                    selector: "button[disabled], [type=submit][disabled]",
                    chrome: undefined,
                });
            }
        }
    } catch {
        /* */
    }
    return extra;
}

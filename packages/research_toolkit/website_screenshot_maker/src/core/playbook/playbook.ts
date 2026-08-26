import type { Page } from "playwright";
import fs from "fs";
import path from "path";
import { isNearDuplicatePair } from "../dissect/blank-png.js";
import { screenshotLocator } from "../dissect/locator-png.js";
import type { CropFile } from "../dissect/crop.js";

async function scoped(
    page: Page,
    rootSel: string | null,
    innerSel: string,
): Promise<import("playwright").Locator> {
    if (!rootSel) return page.locator(innerSel).first();
    const root = page.locator(rootSel);
    if ((await root.count()) === 0) return page.locator(innerSel).first();
    const nested = root.locator(innerSel);
    try {
        if ((await nested.count()) > 0) return nested.first();
        const selfMatch = await root.evaluate(
            (el, sel) => (el as Element).matches(sel),
            innerSel,
        );
        if (selfMatch) return root;
    } catch {
        /* */
    }
    return nested.first();
}

async function shot(
    page: Page,
    rootSel: string | null,
    innerSel: string,
    outDir: string,
    slug: string,
    kind: string,
    state: string,
    fileState?: string,
): Promise<CropFile | null> {
    const loc = await scoped(page, rootSel, innerSel);
    try {
        if (!(await loc.isVisible({ timeout: 800 }))) return null;
        const stem = fileState ?? state;
        const rel = path.join("crops", `${slug}-${kind}-${stem}.png`);
        const abs = path.join(outDir, rel);
        if (!(await screenshotLocator(loc, abs, { minBytes: 1, blank: false, visibleTimeout: 800 }))) {
            return null;
        }
        return { kind, state, file: rel, selector: innerSel };
    } catch {
        return null;
    }
}

/** Playbook slot states: form:empty, form:error, tabs:each, dialog:open */
export const PLAYBOOK_STATES = [
    "form:empty",
    "form:error",
    "tabs:each",
    "dialog:open",
] as const;

const ACTION_CAP = 6;

const PLAY_KINDS = new Set(["form", "tabs", "dialog"]);

function playbookRoots(
    scopes: CropFile[] | undefined,
    hasForm: boolean,
): { kind: string; selector: string }[] {
    if (scopes == null || scopes.length === 0) {
        return hasForm ? [{ kind: "form", selector: "form" }] : [];
    }
    return scopes
        .filter((s) => PLAY_KINDS.has(s.kind))
        .map((s) => ({ kind: s.kind, selector: s.selector }));
}

export async function runPlaybook(
    page: Page,
    outDir: string,
    slug: string,
    scopes?: CropFile[],
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
    const hasForm = (await page.locator("form").count()) > 0;
    const roots = playbookRoots(scopes, hasForm);
    const out: CropFile[] = [];
    let emptyCount = 0;
    let errorCount = 0;

    for (const root of roots) {
        if (out.length >= ACTION_CAP) break;
        const rootSel = root.selector;
        const formRoot = page.locator(rootSel);
        const formLoc = await scoped(page, rootSel, "form");

        if (root.kind === "form") {
            const defFile = scopes?.find((s) => s.kind === "form" && s.selector === rootSel)?.file;
            const hasDefault = Boolean(defFile && fs.existsSync(path.join(outDir, defFile)));
            if (!hasDefault) {
                emptyCount += 1;
                const empty = await shot(
                    page,
                    rootSel,
                    "form",
                    outDir,
                    slug,
                    "form",
                    "empty",
                    emptyCount === 1 ? "empty" : `empty-${emptyCount}`,
                );
                if (empty) out.push(empty);
            }

            try {
                const form = formLoc;
                if (await form.isVisible({ timeout: 400 })) {
                    const btn = form.locator("[type=submit], button").first();
                    if (await btn.count()) await btn.click({ timeout: 1000 });
                    else await form.evaluate((el) => (el as HTMLFormElement).requestSubmit());
                    await page.waitForTimeout(200);
                    errorCount += 1;
                    const err = await shot(
                        page,
                        rootSel,
                        "form",
                        outDir,
                        slug,
                        "form",
                        "error",
                        errorCount === 1 ? "error" : `error-${errorCount}`,
                    );
                    if (err) {
                        const errAbs = path.join(outDir, err.file);
                        const defAbs = defFile ? path.join(outDir, defFile) : "";
                        if (defAbs && isNearDuplicatePair(errAbs, defAbs)) {
                            try {
                                fs.unlinkSync(errAbs);
                            } catch {
                                /* */
                            }
                        } else {
                            out.push(err);
                        }
                    }
                }
            } catch {
                /* */
            }
        }

        if (root.kind === "tabs") {
            const tabs = formRoot.locator("[role=tab]");
            const n = await tabs.count();
            for (let i = 0; i < n; i++) {
                if (out.length >= ACTION_CAP) break;
                try {
                    await tabs.nth(i).click({ timeout: 800 });
                    await page.waitForTimeout(150);
                    const c = await shot(
                        page,
                        rootSel,
                        "[role=tablist]",
                        outDir,
                        slug,
                        "tabs",
                        `tab-${i}`,
                    );
                    if (c) out.push(c);
                } catch {
                    /* */
                }
            }
        }

        if (root.kind === "dialog") {
            try {
                const opener = formRoot
                    .locator("button")
                    .filter({ hasText: /open|dialog|modal/i })
                    .first();
                if (await opener.isVisible({ timeout: 300 })) {
                    await opener.click({ timeout: 800 });
                    await page.waitForTimeout(200);
                    const d = await shot(
                        page,
                        rootSel,
                        "[role=dialog]",
                        outDir,
                        slug,
                        "dialog",
                        "open",
                    );
                    if (d) out.push(d);
                }
            } catch {
                /* */
            }
        }
    }

    return out.slice(0, ACTION_CAP);
}

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
    inspectOne,
    loadConfig,
    loadMatrix,
    type InspectResult,
} from "website_screenshot_maker";
import { isBlankPng } from "../../../../packages/research_toolkit/website_screenshot_maker/src/core/dissect/blank-png.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const OUT = path.join(ROOT, ".out", "live-nms");
const URLS = [
    "https://www.gwd.ru/",
    "https://www.gwd.ru/projects/populyarnye-proekty/",
];

function md5(file: string): string {
    return createHash("md5").update(fs.readFileSync(file)).digest("hex");
}

function pngHeight(file: string): number {
    const buf = fs.readFileSync(file);
    return buf.length >= 24 ? buf.readUInt32BE(20) : 0;
}

function kindCounts(
    crops: InspectResult["crops"],
    atoms: InspectResult["atoms"],
): Record<string, number> {
    const m: Record<string, number> = {};
    for (const c of [...crops, ...atoms]) {
        const k = `${c.kind}:${c.state}`;
        m[k] = (m[k] ?? 0) + 1;
    }
    return m;
}

function kindSum(kinds: Record<string, number>, prefix: string): number {
    let n = 0;
    for (const [k, v] of Object.entries(kinds)) {
        if (k.startsWith(prefix)) n += v;
    }
    return n;
}

function checkPairs(cropDir: string): void {
    if (!fs.existsSync(cropDir)) throw new Error("no crops dir");
    const names = fs.readdirSync(cropDir);
    const re = /^(.*-button-\d+)-(default|hover|focus)\.png$/;
    const groups = new Map<string, { default?: string; hover?: string; focus?: string }>();
    for (const name of names) {
        const m = name.match(re);
        if (!m) continue;
        const g = groups.get(m[1]) ?? {};
        g[m[2] as "default" | "hover" | "focus"] = path.join(cropDir, name);
        groups.set(m[1], g);
    }
    for (const [key, g] of groups) {
        if (g.hover && g.focus && md5(g.hover) === md5(g.focus)) {
            throw new Error(`${key} hover md5 equals focus`);
        }
        if (g.default && g.hover && md5(g.hover) === md5(g.default)) {
            throw new Error(`${key} hover md5 equals default`);
        }
    }
}

function checkHeroHeight(cropDir: string, maxH: number): void {
    if (!fs.existsSync(cropDir)) return;
    for (const name of fs.readdirSync(cropDir)) {
        if (!name.includes("-hero-") || !name.endsWith("-default.png")) continue;
        const h = pngHeight(path.join(cropDir, name));
        if (h >= 0.92 * maxH) {
            throw new Error(`hero ${name} pngH=${h} >= ${0.92 * maxH}`);
        }
    }
}

async function inspectAll(): Promise<{
    rows: InspectResult[];
    height: number;
}> {
    const matrix = loadMatrix(path.join(ROOT, "matrix.json"));
    const config = loadConfig(path.join(ROOT, "config.json"), matrix);
    const desktop = matrix.find((d) => d.id === "desktop");
    if (!desktop) throw new Error("matrix missing desktop");
    config.out = OUT;
    config.devices = [desktop];
    fs.rmSync(OUT, { recursive: true, force: true });
    fs.mkdirSync(path.join(OUT, "crops"), { recursive: true });
    const browser = await chromium.launch({ headless: true });
    const rows: InspectResult[] = [];
    try {
        for (let i = 0; i < URLS.length; i++) {
            rows.push(await inspectOne(browser, URLS[i], desktop, i, URLS.length, config));
        }
    } finally {
        await browser.close();
    }
    return { rows, height: desktop.height };
}

function evaluate(rows: InspectResult[], height: number): void {
    const summary = rows.map((r) => {
        const kinds = kindCounts(r.crops, r.atoms);
        return {
            url: r.row.url,
            slug: r.row.slug,
            status: r.row.status,
            occupancy: r.occupancy,
            cropCount: r.crops.length,
            atomCount: r.atoms.length,
            kinds,
            crops: r.crops,
            atoms: r.atoms,
        };
    });
    fs.writeFileSync(path.join(OUT, "smoke-summary.json"), JSON.stringify(summary, null, 2));
    const catalog = summary.find((s) => s.url.includes("populyarnye-proekty"));
    const home = summary.find(
        (s) => s.slug === "home" || s.url.replace(/\/$/, "") === "https://www.gwd.ru",
    );
    if (!catalog) throw new Error("no catalog row");
    if (!home) throw new Error("no home row");
    if (kindSum(catalog.kinds, "card:") < 1) {
        throw new Error(`catalog card: ${JSON.stringify(catalog.kinds)}`);
    }
    if (kindSum(home.kinds, "hero:") < 1) {
        throw new Error(`home hero: ${JSON.stringify(home.kinds)}`);
    }
    checkPairs(path.join(OUT, "crops"));
    checkHeroHeight(path.join(OUT, "crops"), height);
    const cropDir = path.join(OUT, "crops");
    const blanks = fs.readdirSync(cropDir).filter((n) => n.endsWith(".png") && isBlankPng(path.join(cropDir, n)));
    if (blanks.length > 0) throw new Error(`blank crops: ${blanks.join(",")}`);
    const hashes = new Map<string, string>();
    for (const n of fs.readdirSync(cropDir).filter((x) => x.endsWith(".png"))) {
        const h = createHash("md5").update(fs.readFileSync(path.join(cropDir, n))).digest("hex");
        const prev = hashes.get(h);
        if (prev) throw new Error(`duplicate png ${prev} == ${n}`);
        hashes.set(h, n);
    }
}

async function main(): Promise<void> {
    let last: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const { rows, height } = await inspectAll();
            evaluate(rows, height);
            console.log("LIVE_QUALITY_OK");
            return;
        } catch (e) {
            last = e;
            console.error(`smoke-quality attempt ${attempt + 1} failed`, e);
        }
    }
    throw last;
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

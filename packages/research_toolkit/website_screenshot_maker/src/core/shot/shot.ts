import { type Browser } from "playwright";
import fs from "fs";
import path from "path";
import type { Device } from "../../device/index.js";
import type { CaptureConfig } from "../index.js";
import type { CaptureRow } from "../manifest/index.js";
import { visitPage } from "../browse/index.js";
import { cropWidgets } from "../dissect/widgets.js";
import { cropAtoms } from "../dissect/atoms.js";
import { buildPageTree, emptyPageTree, type CropNode } from "../dissect/tree.js";
import { sampleTokens, emptyTokens } from "../dissect/tokens.js";
import {
    emptyOccupancy,
    sampleOccupancy,
    SLOT_SELECTORS,
    type Occupancy,
} from "../dissect/occupancy.js";
import { runPlaybook } from "../playbook/playbook.js";
import { slugFromUrl } from "../url/index.js";
import { errMsg } from "../util/index.js";

export { skipReason } from "../browse/index.js";
export type { Occupancy };

export type InspectResult = {
    row: CaptureRow;
    occupancy: Occupancy;
    slotSelectors: Record<string, string>;
    crops: import("../dissect/crop.js").CropFile[];
    atoms: import("../dissect/crop.js").CropFile[];
    tokens: import("../dissect/tokens.js").TokenSet;
    tree: CropNode;
};

function pendingRow(
    url: string,
    device: Device,
    index: number,
    relPng: string,
): CaptureRow {
    return {
        url,
        normalizedUrl: url,
        slug: slugFromUrl(url),
        file: relPng,
        fullPage: true,
        deviceId: device.id,
        viewport: { width: device.width, height: device.height },
        status: "pending",
        httpStatus: null,
        scrollHeight: null,
        bytes: null,
        skipped: false,
        reason: null,
        capturedAt: null,
        index,
    };
}

function markSkip(row: CaptureRow, reason: string, httpStatus?: number | null): void {
    row.skipped = true;
    row.status = "skipped";
    row.reason = reason;
    if (httpStatus !== undefined) row.httpStatus = httpStatus;
}

async function fillPageMeta(
    page: import("playwright").Page,
    row: CaptureRow,
    absPng: string,
): Promise<void> {
    const dims = await page.evaluate(() => ({
        scrollHeight: document.documentElement.scrollHeight,
        title: document.title,
    }));
    row.scrollHeight = dims.scrollHeight;
    row.title = dims.title;
    await page.screenshot({
        path: absPng,
        fullPage: true,
        type: "png",
        animations: "disabled",
    });
    const st = fs.statSync(absPng);
    row.bytes = st.size;
    row.status = "ok";
    row.capturedAt = new Date().toISOString();
}

function dropTinyPng(absPng: string): void {
    if (fs.existsSync(absPng) && fs.statSync(absPng).size < 100) {
        try {
            fs.unlinkSync(absPng);
        } catch {
            /* */
        }
    }
}

export async function captureOne(
    browser: Browser,
    url: string,
    device: Device,
    index: number,
    total: number,
    config: CaptureConfig,
): Promise<CaptureRow> {
    const relPng = path.join("pages", device.id, `${slugFromUrl(url)}.png`);
    const absPng = path.join(config.out, relPng);
    fs.mkdirSync(path.dirname(absPng), { recursive: true });
    const row = pendingRow(url, device, index, relPng);
    let close: (() => Promise<void>) | undefined;
    try {
        const visit = await visitPage(browser, url, device, config);
        close = visit.close;
        row.httpStatus = visit.httpStatus;
        if (visit.skip) {
            markSkip(row, visit.skip, visit.httpStatus);
            return row;
        }
        await fillPageMeta(visit.page, row, absPng);
        console.log(
            `[${index + 1}/${total}] OK ${url} ${row.bytes}B h=${row.scrollHeight}`,
        );
    } catch (e) {
        markSkip(row, errMsg(e).slice(0, 300));
        console.log(`[${index + 1}/${total}] SKIP ${url} :: ${row.reason}`);
        dropTinyPng(absPng);
    } finally {
        if (close) await close();
    }
    return row;
}

export async function inspectOne(
    browser: Browser,
    url: string,
    device: Device,
    index: number,
    total: number,
    config: CaptureConfig,
): Promise<InspectResult> {
    const slug = slugFromUrl(url);
    const relPng = path.join("pages", device.id, `${slug}.png`);
    const absPng = path.join(config.out, relPng);
    fs.mkdirSync(path.dirname(absPng), { recursive: true });
    const row = pendingRow(url, device, index, relPng);
    let occupancy: Occupancy = emptyOccupancy();
    const crops: InspectResult["crops"] = [];
    let atoms: InspectResult["atoms"] = [];
    let tokens = emptyTokens();
    let tree = emptyPageTree(url, relPng);
    let close: (() => Promise<void>) | undefined;
    try {
        const visit = await visitPage(browser, url, device, config);
        close = visit.close;
        row.httpStatus = visit.httpStatus;
        if (visit.skip) {
            markSkip(row, visit.skip, visit.httpStatus);
            return { row, occupancy, slotSelectors: SLOT_SELECTORS, crops, atoms, tokens, tree };
        }
        await fillPageMeta(visit.page, row, absPng);
        occupancy = await sampleOccupancy(visit.page);
        const cropDir = config.out;
        const slotCrops = await cropWidgets(visit.page, cropDir, slug);
        crops.push(...slotCrops);
        crops.push(...(await runPlaybook(visit.page, cropDir, slug, slotCrops)));
        try {
            atoms = await cropAtoms(visit.page, cropDir, slug);
        } catch {
            atoms = [];
        }
        try {
            tokens = await sampleTokens(
                visit.page,
                slotCrops.map((c) => c.selector),
            );
        } catch {
            tokens = emptyTokens();
        }
        try {
            tree = await buildPageTree(visit.page, {
                url,
                pageFile: relPng,
                slug,
                outDir: cropDir,
                widgets: slotCrops,
                atoms,
                extras: crops.filter((c) => c.state !== "default"),
            });
        } catch {
            tree = emptyPageTree(url, relPng);
        }
        console.log(
            `[${index + 1}/${total}] INSPECT ${url} form=${occupancy.has_form} crops=${crops.length} tree=${tree.children.length}`,
        );
    } catch (e) {
        markSkip(row, errMsg(e).slice(0, 300));
        console.log(`[${index + 1}/${total}] SKIP ${url} :: ${row.reason}`);
        dropTinyPng(absPng);
    } finally {
        if (close) await close();
    }
    return { row, occupancy, slotSelectors: SLOT_SELECTORS, crops, atoms, tokens, tree };
}

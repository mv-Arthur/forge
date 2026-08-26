import { type Browser } from "playwright";
import type { Device } from "../../device/index.js";
import type { CaptureConfig } from "../index.js";
import { visitPage } from "../browse/index.js";
import { slugFromUrl } from "../url/index.js";
import { errMsg } from "../util/index.js";
import { collectCopyNodes } from "./collect.js";
import { blocksFromRaw } from "./classify.js";
import type { CopyPage } from "./types.js";

function emptyPage(url: string, slug: string, templateId: string): CopyPage {
    return {
        url,
        slug,
        templateId,
        title: "",
        status: "skipped",
        reason: null,
        blocks: [],
    };
}

export async function copyOne(
    browser: Browser,
    url: string,
    device: Device,
    index: number,
    total: number,
    config: CaptureConfig,
    templateId: string,
): Promise<CopyPage> {
    const slug = slugFromUrl(url);
    const pageOut = emptyPage(url, slug, templateId);
    let close: (() => Promise<void>) | undefined;
    try {
        const visit = await visitPage(browser, url, device, config);
        close = visit.close;
        if (visit.skip) {
            pageOut.reason = visit.skip;
            console.log(`[${index + 1}/${total}] SKIP ${url} :: ${visit.skip}`);
            return pageOut;
        }
        pageOut.title = await visit.page.title();
        pageOut.blocks = blocksFromRaw(await collectCopyNodes(visit.page));
        pageOut.status = "ok";
        console.log(
            `[${index + 1}/${total}] COPY ${url} blocks=${pageOut.blocks.length}`,
        );
        return pageOut;
    } catch (e) {
        pageOut.reason = errMsg(e).slice(0, 300);
        console.log(`[${index + 1}/${total}] SKIP ${url} :: ${pageOut.reason}`);
        return pageOut;
    } finally {
        if (close) await close();
    }
}

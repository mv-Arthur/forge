import { chromium, type Browser } from "playwright";
import fs from "fs";
import path from "path";
import type { CaptureConfig } from "../index.js";
import { discoverUrls } from "../discover/index.js";
import type { CaptureRow } from "../manifest/index.js";
import { writeManifest } from "../manifest/index.js";
import { captureOne } from "../shot/index.js";
import { slugFromUrl } from "../url/index.js";
import { errMsg } from "../util/index.js";

export function browserWorkerCount(concurrency: number, jobCount: number): number {
    return Math.min(concurrency, Math.max(jobCount, 0));
}

/** Найти URL, снять их параллельно, записать финальный манифест. */
export async function capture(config: CaptureConfig): Promise<void> {
    fs.mkdirSync(config.out, { recursive: true });
    fs.mkdirSync(path.join(config.out, "pages"), { recursive: true });

    console.log("Discovering URLs…", config.origin.href);
    const urls = await discoverUrls(config);
    console.log(`Discovered ${urls.length} unique URLs`);

    const jobs = config.devices.flatMap((device) =>
        urls.map((url) => ({ device, url })),
    );

    const results: CaptureRow[] = [];
    let i = 0;
    const n = browserWorkerCount(config.concurrency, jobs.length);
    const tabs = Math.max(1, config.tabsPerBrowser);

    async function worker(): Promise<void> {
        let browser: Browser | undefined;
        let launching: Promise<Browser> | undefined;

        async function getBrowser(): Promise<Browser> {
            if (browser) return browser;
            launching ??= chromium.launch({ headless: true });
            browser = await launching;
            return browser;
        }

        async function tab(): Promise<void> {
            while (i < jobs.length) {
                const idx = i++;
                const job = jobs[idx];
                try {
                    const b = await getBrowser();
                    const row = await captureOne(
                        b,
                        job.url,
                        job.device,
                        idx,
                        jobs.length,
                        config,
                    );
                    results.push(row);
                } catch (e) {
                    const slug = slugFromUrl(job.url);
                    results.push({
                        url: job.url,
                        normalizedUrl: job.url,
                        slug,
                        file: path.join("pages", job.device.id, `${slug}.png`),
                        fullPage: true,
                        deviceId: job.device.id,
                        viewport: {
                            width: job.device.width,
                            height: job.device.height,
                        },
                        status: "skipped",
                        httpStatus: null,
                        scrollHeight: null,
                        bytes: null,
                        skipped: true,
                        reason: errMsg(e).slice(0, 300),
                        capturedAt: null,
                        index: idx,
                    });
                }
                if (results.length % 25 === 0) {
                    writeManifest(results, urls.length, false, config);
                }
            }
        }

        try {
            await Promise.allSettled(Array.from({ length: tabs }, () => tab()));
        } finally {
            if (browser !== undefined) await browser.close();
        }
    }

    await Promise.allSettled(Array.from({ length: n }, () => worker()));

    writeManifest(results, urls.length, true, config);
    console.log("Done. OUT=", config.out);
}

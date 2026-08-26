import { chromium, type Browser } from "playwright";
import fs from "fs";
import type { CaptureConfig } from "../index.js";
import { discoverUrls } from "../discover/index.js";
import { clusterByPath, sampleCluster, pathnameOf } from "../cluster/cluster.js";
import { induceClusters } from "../cluster/induce.js";
import { matchPath, type SitePack } from "../cluster/pack.js";
import { browserWorkerCount } from "../capture/index.js";
import { errMsg } from "../util/index.js";
import { copyOne } from "./copy-one.js";
import { writeCopy } from "./dump.js";
import type { CopyDump, CopyPage } from "./types.js";

export type CopyOpts = {
    pack?: SitePack;
    allow?: SitePack;
};

const SAMPLE_PER_TEMPLATE = 3;

export async function copy(
    config: CaptureConfig,
    opts?: CopyOpts,
): Promise<CopyDump> {
    fs.mkdirSync(config.out, { recursive: true });
    const device = config.devices[0];
    let urls = await discoverUrls(config);
    if (opts?.allow) {
        urls = urls.filter((u) => matchPath(pathnameOf(u), opts.allow) !== null);
    }
    const clusters = opts?.pack
        ? clusterByPath(urls, opts.pack)
        : induceClusters(urls);

    const jobs: { templateId: string; url: string }[] = [];
    for (const [templateId, list] of clusters) {
        for (const url of sampleCluster(list, SAMPLE_PER_TEMPLATE)) {
            jobs.push({ templateId, url });
        }
    }

    const pages: CopyPage[] = [];
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
                    pages.push(
                        await copyOne(
                            b,
                            job.url,
                            device,
                            idx,
                            jobs.length,
                            config,
                            job.templateId,
                        ),
                    );
                } catch (e) {
                    console.log(`copy fail ${job.url} :: ${errMsg(e)}`);
                }
            }
        }
        try {
            await Promise.allSettled(Array.from({ length: tabs }, () => tab()));
        } finally {
            if (browser !== undefined) await browser.close();
        }
    }

    await Promise.allSettled(Array.from({ length: Math.max(n, 0) }, () => worker()));

    pages.sort((a, b) => a.url.localeCompare(b.url));
    const dump: CopyDump = {
        site: config.origin.origin,
        generatedAt: new Date().toISOString(),
        deviceId: device.id,
        pages,
    };
    writeCopy(dump, config.out);
    return dump;
}

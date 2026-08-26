import { chromium, type Browser } from "playwright";
import fs from "fs";
import path from "path";
import type { CaptureConfig } from "../index.js";
import { discoverUrls } from "../discover/index.js";
import { clusterByPath, sampleCluster, pathnameOf } from "../cluster/cluster.js";
import { induceClusters } from "../cluster/induce.js";
import { pickRepresentatives } from "../cluster/representatives.js";
import { matchPath, type SitePack } from "../cluster/pack.js";
import { inspectOne } from "../shot/shot.js";
import { writeAtlas, type Atlas, type AtlasTemplate } from "../catalog/catalog.js";
import {
    emptyLibrary,
    internAndStamp,
    internTree,
} from "../catalog/library.js";
import { heuristicLabeler, type Labeler } from "../label/label.js";
import { refineCrops, type CropRefine } from "../label/codex.js";
import { mergeTokens, emptyTokens } from "../dissect/tokens.js";
import { browserWorkerCount } from "../capture/index.js";
import { errMsg } from "../util/index.js";
import type { InspectResult } from "../shot/shot.js";

export type AtlasOpts = {
    labeler?: Labeler;
    pack?: SitePack;
    allow?: SitePack;
    refine?: CropRefine;
};

export async function atlas(
    config: CaptureConfig,
    opts?: AtlasOpts,
): Promise<Atlas> {
    fs.mkdirSync(config.out, { recursive: true });
    const labeler = opts?.labeler ?? heuristicLabeler;
    let urls = await discoverUrls(config);
    if (opts?.allow) {
        urls = urls.filter((u) => matchPath(pathnameOf(u), opts.allow) !== null);
    }
    const clusters = opts?.pack
        ? clusterByPath(urls, opts.pack)
        : induceClusters(urls);
    const device = config.devices[0];
    const sampleJobs: { templateId: string; url: string }[] = [];
    for (const [templateId, list] of clusters) {
        for (const url of sampleCluster(list, 6)) {
            sampleJobs.push({ templateId, url });
        }
    }

    const inspected = new Map<string, InspectResult>();
    let i = 0;
    const n = browserWorkerCount(config.concurrency, sampleJobs.length);
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
            while (i < sampleJobs.length) {
                const idx = i++;
                const job = sampleJobs[idx];
                try {
                    const b = await getBrowser();
                    const result = await inspectOne(
                        b,
                        job.url,
                        device,
                        idx,
                        sampleJobs.length,
                        config,
                    );
                    inspected.set(job.url, result);
                } catch (e) {
                    console.log(`atlas inspect fail ${job.url} :: ${errMsg(e)}`);
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

    const templates: AtlasTemplate[] = [];
    const library = emptyLibrary();
    let usedCustom = false;
    for (const [templateId, list] of clusters) {
        const sampleRows = list
            .map((u) => inspected.get(u))
            .filter((r): r is InspectResult => Boolean(r));
        const reps = pickRepresentatives(
            sampleRows.map((r) => ({ url: r.row.url, occupancy: r.occupancy })),
            3,
        );
        const widgets: AtlasTemplate["widgets"] = [];
        const atoms: AtlasTemplate["atoms"] = [];
        for (const url of reps) {
            const r = inspected.get(url);
            if (!r) continue;
            for (const c of r.crops) {
                widgets.push({
                    kind: c.kind,
                    state: c.state,
                    file: c.file,
                    label: c.kind,
                });
            }
            for (const c of r.atoms ?? []) {
                atoms.push({
                    kind: c.kind,
                    state: c.state,
                    file: c.file,
                    label: c.kind,
                });
            }
        }
        const refined = await refineCrops(widgets, opts?.refine);
        const labeled = await labeler({
            templateId,
            sampleUrls: reps,
            slotKinds: [...new Set(refined.crops.map((s) => s.kind))],
        });
        if (opts?.labeler) usedCustom = true;
        for (const s of refined.crops) {
            s.label = refined.labels[s.file] ?? labeled.slotLabels[s.kind] ?? s.kind;
        }
        const pageFile = reps[0] ? inspected.get(reps[0])?.row.file ?? "" : "";
        const tok = mergeTokens(
            sampleRows.map((r) => r.tokens ?? emptyTokens()),
        );
        const widgetIds = internAndStamp(
            refined.crops,
            "widget",
            config.out,
            library,
        );
        const atomIds = internAndStamp(atoms, "atom", config.out, library);
        const tree = reps[0] ? inspected.get(reps[0])?.tree : undefined;
        if (tree) internTree(tree, config.out, library);
        templates.push({
            id: templateId,
            pathPattern: templateId,
            urls: list,
            occupancy: sampleRows.map((r) => r.occupancy),
            representatives: reps,
            slots: refined.crops,
            label: labeled.templateLabel,
            page: pageFile,
            widgets: refined.crops,
            atoms,
            widgetIds,
            atomIds,
            tokens: tok,
            tree,
        });
    }

    const atlasDoc: Atlas = {
        site: config.origin.origin,
        labelSource: usedCustom ? "custom" : "heuristic",
        templates,
    };
    writeAtlas(atlasDoc, config.out);
    fs.writeFileSync(
        path.join(config.out, "tokens.json"),
        JSON.stringify(mergeTokens(templates.map((t) => t.tokens)), null, 2),
    );
    return atlasDoc;
}

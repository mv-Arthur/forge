import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
    inspectOne,
    internAndStamp,
    internTree,
    loadConfig,
    loadMatrix,
    mergeAtomStates,
    publicTree,
    withAssetFileUrls,
    type CropLibrary,
} from "website_screenshot_maker";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const OUT = path.join(ROOT, ".out", "live-one");
const PAGE = "https://www.gwd.ru/";

function countNodes(
    node: { kind: string; children?: unknown[] },
    acc = { n: 0, kinds: {} as Record<string, number> },
): typeof acc {
    acc.n += 1;
    acc.kinds[node.kind] = (acc.kinds[node.kind] ?? 0) + 1;
    for (const ch of node.children ?? []) {
        countNodes(ch as { kind: string; children?: unknown[] }, acc);
    }
    return acc;
}

async function main(): Promise<void> {
    const matrix = loadMatrix(path.join(ROOT, "matrix.json"));
    const config = loadConfig(path.join(ROOT, "config.json"), matrix);
    const desktop = matrix.find((d) => d.id === "desktop");
    if (!desktop) throw new Error("matrix missing desktop");
    config.out = OUT;
    config.devices = [desktop];
    fs.rmSync(OUT, { recursive: true, force: true });
    fs.mkdirSync(path.join(OUT, "crops"), { recursive: true });

    const browser = await chromium.launch({ headless: true });
    let result;
    try {
        result = await inspectOne(browser, PAGE, desktop, 0, 1, config);
    } finally {
        await browser.close();
    }

    const library: CropLibrary = { crops: {} };
    internTree(result.tree, OUT, library);
    const atomSlots: {
        kind: string;
        state: string;
        file: string;
        chrome?: string;
        id?: string;
    }[] = result.atoms.map((a) => ({
        kind: a.kind,
        state: a.state,
        file: a.file,
        chrome: a.chrome,
    }));
    internAndStamp(atomSlots, "atom", OUT, library);
    mergeAtomStates(result.tree, atomSlots);
    fs.writeFileSync(
        path.join(OUT, "page.json"),
        JSON.stringify(withAssetFileUrls(publicTree(result.tree), OUT), null, 2),
    );
    const stats = countNodes(result.tree);
    console.log(JSON.stringify({
        url: PAGE,
        out: OUT,
        status: result.row.status,
        file: result.tree.file,
        children: result.tree.children.length,
        nodes: stats.n,
        kinds: stats.kinds,
    }, null, 2));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});

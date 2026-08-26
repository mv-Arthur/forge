/**
 * CLI-потребитель website_screenshot_maker.
 *
 *   npx tsx src/cli.ts
 *   npx tsx src/cli.ts ./config.json
 *   npx tsx src/cli.ts atlas
 *   npx tsx src/cli.ts atlas ./config.json
 *   npx tsx src/cli.ts copy
 */
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "node:child_process";
import {
    atlas,
    capture,
    copy,
    heuristicLabeler,
    loadConfig,
    loadMatrix,
    type CropRefine,
    type Labeler,
} from "website_screenshot_maker";
import { parseCliArgs } from "./args.js";
import { gwdPack } from "../packs/gwd.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const DEFAULT_CONFIG = path.join(ROOT, "config.json");
const DEFAULT_MATRIX = path.join(ROOT, "matrix.json");

function usage(): never {
    console.error("usage: npx tsx src/cli.ts [atlas|copy] [config.json]");
    console.error("default: apps/preview/research/config.json");
    process.exit(1);
}

if (process.argv.includes("-h") || process.argv.includes("--help")) usage();

const parsed = parseCliArgs(process.argv.slice(2));
const configPath = parsed.configPath || DEFAULT_CONFIG;
const matrix = loadMatrix(DEFAULT_MATRIX);
const config = loadConfig(configPath, matrix);

async function httpLabeler(url: string): Promise<Labeler> {
    return async (input) => {
        const res = await fetch(url, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(input),
        });
        if (!res.ok) return heuristicLabeler(input);
        const data = (await res.json()) as {
            templateLabel?: string;
            slotLabels?: Record<string, string>;
        };
        if (!data.templateLabel) return heuristicLabeler(input);
        return {
            templateLabel: data.templateLabel,
            slotLabels: data.slotLabels ?? {},
        };
    };
}

function codexRefine(): CropRefine {
    return async (crops) => {
        const r = spawnSync(
            "codex",
            ["exec", "-i", ...crops.map((c) => c.file)],
            {
                encoding: "utf8",
                input: JSON.stringify({ crops }),
            },
        );
        if (r.status !== 0) throw new Error(r.stderr || "codex exec failed");
        const data = JSON.parse(r.stdout) as {
            keep?: string[];
            labels?: Record<string, string>;
        };
        if (!Array.isArray(data.keep)) throw new Error("codex json missing keep");
        return { keep: data.keep, labels: data.labels ?? {} };
    };
}

if (parsed.mode === "atlas") {
    const labelUrl = process.env.ATLAS_LABEL_URL;
    const labeler = labelUrl ? await httpLabeler(labelUrl) : undefined;
    const refine = process.env.ATLAS_CODEX ? codexRefine() : undefined;
    await atlas(config, { allow: gwdPack, labeler, refine });
} else if (parsed.mode === "copy") {
    await copy(config, { allow: gwdPack });
} else {
    await capture(config);
}

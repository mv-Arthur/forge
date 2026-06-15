import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(currentDir, "../..");
const distDir = resolve(currentDir, "dist");
const args = process.argv.slice(2);
const buildOnly = args[0] === "--build-only";

runBuildStep("pnpm", ["--filter", "@forge/shared", "build"]);
runBuildStep("pnpm", ["--filter", "@forge/iron-solver", "build"]);
runBuildStep("pnpm", [
    "exec",
    "tsc",
    "-p",
    "infrastructure/run_iron_solver/tsconfig.json",
]);

ensureDistPackageJson();

if (buildOnly) {
    process.exit(0);
}

const run = spawnSync("node", [resolve(distDir, "index.js"), ...args], {
    cwd: repoRoot,
    stdio: "inherit",
    env: process.env,
});

process.exit(run.status ?? 1);

function runBuildStep(command, args) {
    const result = spawnSync(command, args, {
        cwd: repoRoot,
        stdio: "inherit",
    });

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

function ensureDistPackageJson() {
    mkdirSync(distDir, { recursive: true });
    writeFileSync(
        resolve(distDir, "package.json"),
        `${JSON.stringify({ type: "module" }, null, 4)}\n`,
        "utf8"
    );
}

import { build } from "esbuild";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

// Все dependencies кроме workspace-пакетов — external
const external = Object.keys(pkg.dependencies || {}).filter(
    (dep) => !dep.startsWith("@forge/")
);

await build({
    entryPoints: ["dist/main.js"],
    bundle: true,
    platform: "node",
    target: "node22",
    outfile: "bundle/main.js",
    format: "cjs",
    sourcemap: true,
    minify: true,
    external,
});

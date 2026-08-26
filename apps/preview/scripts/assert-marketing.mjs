#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");
const outDir = path.join(root, ".next", "assert-out");

function emit(rel) {
    const srcPath = path.join(root, rel);
    const src = fs.readFileSync(srcPath, "utf8");
    const { outputText } = ts.transpileModule(src, {
        compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
            esModuleInterop: true,
        },
        fileName: srcPath,
    });
    const dest = path.join(outDir, rel.replace(/\.ts$/, ".mjs"));
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const rewritten = outputText.replace(
        /from ["'](\.[^"']+)["']/g,
        (_m, spec) => {
            const withExt = spec.endsWith(".js")
                ? spec.replace(/\.js$/, ".mjs")
                : `${spec}.mjs`;
            return `from "${withExt}"`;
        },
    );
    fs.writeFileSync(dest, rewritten);
    return dest;
}

fs.rmSync(outDir, { recursive: true, force: true });
for (const rel of [
    "lib/copy.ts",
    "lib/catalogFilter.ts",
    "lib/settings.ts",
    "lib/format.ts",
    "lib/names.ts",
]) {
    emit(rel);
}

const { formatPrice } = await import(
    pathToFileURL(path.join(outDir, "lib/format.mjs")).href
);
const { CATALOG_OPEN, openCatalogFilter, projectPassesCatalogFilter } =
    await import(
        pathToFileURL(path.join(outDir, "lib/catalogFilter.mjs")).href
    );
const { buildSubtitle, humanizeDisplayName, humanObjectTitle } = await import(
    pathToFileURL(path.join(outDir, "lib/names.mjs")).href
);
const { COMPANY_OFFER_HEADING } = await import(
    pathToFileURL(path.join(outDir, "lib/copy.mjs")).href
);

function assert(cond, msg) {
    if (!cond) {
        console.error("FAIL", msg);
        process.exit(1);
    }
    console.log("OK", msg);
}

assert(
    formatPrice(8_302_684).includes("млн"),
    `formatPrice(8302684) yields millions, got ${formatPrice(8_302_684)}`,
);
assert(
    formatPrice(8_302_684) === "8,3 млн ₽",
    `formatPrice(8302684) === 8,3 млн ₽, got ${formatPrice(8_302_684)}`,
);

assert(
    humanizeDisplayName("Проект Аркада", null, null) === "Аркада",
    "strip Проект prefix",
);
assert(
    humanizeDisplayName("дома 16x20 метров", null, null) === "Дом 16×20",
    "house dimension title",
);

const subA = buildSubtitle({
    floors: "2",
    area: 190,
    bedrooms: 4,
    dimensions: "9х9",
});
const subB = buildSubtitle({
    floors: "2",
    area: 223,
    bedrooms: 3,
    dimensions: "10х12",
});
assert(subA !== subB, `distinct subtitles: ${subA} vs ${subB}`);
assert(
    !/дом из газобетона/i.test(subA),
    "subtitle is not the generic tech line",
);

assert(
    humanObjectTitle(
        "Дом из газобетона в п. Порзолово",
        "пос. Порзолово",
        "built",
    ) === "Дом в пос. Порзолово",
    "human object title uses location",
);

const open = openCatalogFilter({ maxArea: 679, maxPrice: 37_600_000 });
const rows = [
    {
        area: 50,
        priceFrom: 1_000_000,
        technologies: [],
        floors: null,
        bedrooms: null,
        bathrooms: null,
        hasTerrace: false,
    },
    {
        area: 679,
        priceFrom: 37_600_000,
        technologies: [],
        floors: null,
        bedrooms: null,
        bathrooms: null,
        hasTerrace: false,
    },
    {
        area: null,
        priceFrom: null,
        technologies: [],
        floors: null,
        bedrooms: null,
        bathrooms: null,
        hasTerrace: false,
    },
];
for (const row of rows) {
    assert(
        projectPassesCatalogFilter(row, open),
        `open filter keeps row area=${row.area} price=${row.priceFrom}`,
    );
    assert(
        projectPassesCatalogFilter(row, CATALOG_OPEN),
        `CATALOG_OPEN keeps row area=${row.area} price=${row.priceFrom}`,
    );
}

assert(
    COMPANY_OFFER_HEADING.includes("под ключ"),
    "company offer heading names the offer",
);

console.log("MARKETING_OK");

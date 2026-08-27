#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");
let fail = 0;

function walk(dir, acc = []) {
    if (!fs.existsSync(dir)) return acc;
    for (const name of fs.readdirSync(dir)) {
        if (name === "node_modules" || name === ".next") continue;
        const p = path.join(dir, name);
        const st = fs.statSync(p);
        if (st.isDirectory()) walk(p, acc);
        else acc.push(p);
    }
    return acc;
}

function rel(p) {
    return path.relative(root, p);
}

function failMsg(file, msg) {
    console.error(`FAIL ${rel(file)}: ${msg}`);
    fail += 1;
}

function ok(msg) {
    console.log(`OK ${msg}`);
}

const widgetFiles = walk(path.join(src, "widgets"));
const appFiles = walk(path.join(src, "app"));
const actionFiles = walk(path.join(src, "actions"));

for (const file of widgetFiles) {
    const text = fs.readFileSync(file, "utf8");
    const base = path.basename(file);
    const isTsx = file.endsWith(".tsx");
    const isContainer = base.endsWith(".container.tsx");
    const isIsland = file.includes(`${path.sep}__`);
    const isLib = file.includes(`${path.sep}lib${path.sep}`);

    if (isLib) {
        if (!file.endsWith(".ts") || file.endsWith(".tsx")) {
            failMsg(file, "widget lib must be .ts");
        }
        if (/from ["']@\/actions\//.test(text) || /\bfetch\s*\(/.test(text)) {
            failMsg(file, "widget lib is not pure");
        }
        continue;
    }

    if (isContainer) {
        if (!/^["']use client["']/.test(text.trim())) {
            failMsg(file, "container must start with use client");
        }
        if (/\.container["']/.test(text) || /from ["'][^"']*\.container["']/.test(text)) {
            failMsg(file, "container must not import another container");
        }
        continue;
    }

    if (isTsx && !isIsland) {
        if (/^["']use client["']/.test(text.trim())) {
            failMsg(file, "dumb widget must not be use client");
        }
        if (/\buse(State|Effect|Memo|Callback|Ref|Id|Pathname)\b/.test(text)) {
            failMsg(file, "dumb widget must not use hooks");
        }
        if (/\bfetch\s*\(/.test(text)) {
            failMsg(file, "dumb widget must not fetch");
        }
        if (/from ["']@\/actions\//.test(text)) {
            failMsg(file, "dumb widget must not import actions");
        }
        if (/from ["'][^"']*\.container["']/.test(text)) {
            failMsg(file, "dumb widget must not import container");
        }
    }

    if (isTsx && isIsland) {
        if (/from ["']@\/actions\//.test(text)) {
            failMsg(file, "island must not import actions");
        }
        if (/from ["'][^"']*\.container["']/.test(text)) {
            failMsg(file, "island must not import container");
        }
        if (/\bfetch\s*\(/.test(text)) {
            failMsg(file, "island must not fetch");
        }
    }
}

for (const file of appFiles) {
    const base = path.basename(file);
    if (base !== "page.tsx" && base !== "layout.tsx") continue;
    const text = fs.readFileSync(file, "utf8");
    if (/^["']use client["']/.test(text.trim())) {
        failMsg(file, "route shell must stay a server component");
    }
    if (/from ["']@\/server\//.test(text)) {
        failMsg(file, "route shell must not import @/server");
    }
}

for (const file of actionFiles) {
    if (!file.endsWith(".ts") || file.endsWith(".types.ts")) continue;
    const text = fs.readFileSync(file, "utf8");
    if (!text.includes('"use server"') && !text.includes("'use server'")) {
        failMsg(file, "action entrypoint must have use server");
    }
    if (!/import ["']server-only["']/.test(text)) {
        failMsg(file, "action entrypoint must import server-only");
    }
    if (/from ["']@\/widgets\//.test(text) || /from ["']@\/app\//.test(text)) {
        failMsg(file, "action must not import widgets or app");
    }
}

if (fail === 0) {
    ok(`arch (${widgetFiles.length} widget files, ${actionFiles.length} action files)`);
    process.exit(0);
}
process.exit(1);

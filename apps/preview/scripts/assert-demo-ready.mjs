#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function walk(dir, acc = []) {
    for (const name of fs.readdirSync(dir)) {
        if (name === "node_modules" || name === ".next") continue;
        const p = path.join(dir, name);
        const st = fs.statSync(p);
        if (st.isDirectory()) walk(p, acc);
        else if (/\.(tsx|ts|jsx|js|css)$/.test(name)) acc.push(p);
        }
    return acc;
}

const customerDirs = ["app", "components"].map((d) => path.join(root, d));
const customerFiles = customerDirs.flatMap((d) => walk(d));
const customerText = customerFiles
    .map((f) => fs.readFileSync(f, "utf8"))
    .join("\n");

const forbidden = [
    ["фикстур", /фикстур/i],
    ["STUB", /\bSTUB\b/],
    ["превью заявк", /превью\s+заявк/i],
    ["fake INN", /7801234567/],
    ["97%", /97\s*%/],
    ["recommendRate", /recommendRate/],
    ["площадок", /площадок/],
    ["рендер", /рендер/i],
    ["портфолио", /портфолио/i],
    ["из каталога", /из каталога/],
    ["Все объекты", /Все объекты/],
    ["Вживую", /Вживую/],
    ["Жду звонка", /Жду звонка/],
    ["минимальный пакет", /минимальный пакет/],
    ["число ниже", /число ниже/],
    ["код серии", /код серии/],
    ["выборке", /выборке/],
    ["Галерея объекта", /Галерея объекта/],
    ["Приедем на объект", /Приедем на объект/],
    ["Ещё объекты", /Ещё объекты/],
    ["Слот ~1 час", /Слот ~1 час/],
    ["Свяжемся быстрее", /Свяжемся быстрее/],
    ["Построенные объекты", /Построенные объекты/],
    ["PDF-презентац", /презентац/i],
    ["состав пакетов", /состав пакетов/],
    ["Наши работы", /Наши работы/],
    ["Все работы", /Все работы/],
    ["Каталог домов", /Каталог домов/],
    ["Загрузка каталога", /Загрузка каталога/],
    ["Вид каталога", /Вид каталога/],
    ["15 минут", /15 минут/],
    ["Здесь будет 3D", /Здесь будет 3D/],
    ["подключается отдельно", /подключается отдельно/],
    ["место под съёмку", /место под съёмку/],
    ["Фотохроника", /Фотохроника/],
    ["каждую неделю", /каждую неделю/],
    ["Скинем PDF", /Скинем PDF/],
    ["Хит badge", />Хит</],
];

let fail = 0;
const inventedBrands = [
    "YTONG",
    "Porotherm",
    "Paroc",
    "Tyvek",
    "TOREX",
    "Kährs",
    "Ravak",
    "Caparol",
    "Grand Line",
    "Buderus",
    "Cedral",
    "Kerama",
    "Roca",
    "Технониколь",
];
for (const brand of inventedBrands) {
    if (customerText.includes(brand)) {
        console.error("FAIL brand", brand);
        fail += 1;
    } else {
        console.log("OK absent brand", brand);
    }
}

for (const [name, re] of forbidden) {
    if (re.test(customerText)) {
        console.error("FAIL", name);
        fail += 1;
    } else {
        console.log("OK absent", name);
    }
}

const footer = fs.readFileSync(
    path.join(root, "components/Footer.tsx"),
    "utf8",
);
if (!footer.includes("7802663069") && !footer.includes("settings.inn")) {
    console.error("FAIL INN missing");
    fail += 1;
} else {
    console.log("OK INN wired");
}

const settings = fs.readFileSync(path.join(root, "lib/settings.ts"), "utf8");
if (!settings.includes('inn: "7802663069"')) {
    console.error("FAIL settings.inn");
    fail += 1;
} else {
    console.log("OK settings.inn");
}
if (/recommendRate/.test(settings)) {
    console.error("FAIL settings still has recommendRate");
    fail += 1;
} else {
    console.log("OK no recommendRate");
}

const page = fs.readFileSync(path.join(root, "app/page.tsx"), "utf8");
const tokens = fs.readFileSync(path.join(root, "styles/www-tokens.css"), "utf8");
const layout = fs.readFileSync(path.join(root, "app/layout.tsx"), "utf8");
const hero = fs.readFileSync(
    path.join(root, "components/HeroSlider.tsx"),
    "utf8",
);
const lead = fs.readFileSync(
    path.join(root, "components/GwdLeadForm.tsx"),
    "utf8",
);
const header = fs.readFileSync(
    path.join(root, "components/www/header/SiteHeader.tsx"),
    "utf8",
);
const projects = JSON.parse(
    fs.readFileSync(
        path.join(root, "data/fixtures/projects.normalized.json"),
        "utf8",
    ),
);
const objects = JSON.parse(
    fs.readFileSync(
        path.join(root, "data/fixtures/built-objects.normalized.json"),
        "utf8",
    ),
);

const sections = [...page.matchAll(/data-section="([^"]+)"/g)].map((m) => m[1]);
const joined = sections.join(" ");

const checks = [
    ["accent", tokens.includes("#9c4a2d")],
    [
        "no_gwd_green",
        !tokens.includes("#246A50") && !layout.toLowerCase().includes("manrope"),
    ],
    ["home_order", /hero.*side-banner-slider.*popular.*lead/.test(joined)],
    ["home_trust", joined.includes("trust")],
    [
        "company_h1",
        page.includes("Дома под ключ в Санкт-Петербурге и Ленобласти"),
    ],
    ["h1_not_only_sku", !/heading=\{[^}]*displayName/.test(page)],
    ["hero_dot", hero.includes("data-hero-dot")],
    ["lead", lead.includes("data-gwd-lead")],
    [
        "object_carousel",
        fs.existsSync(path.join(root, "components/ObjectCarousel.tsx")),
    ],
    ["fixtures", projects.length === 329 && objects.length === 90],
    ["display_font", layout.includes("Cormorant")],
    ["site_logo", header.includes("logo-header.png")],
    ["nav_about", header.includes('href: "/about"')],
    ["nav_contacts", header.includes('href: "/contacts"')],
    [
        "fab_message",
        fs
            .readFileSync(
                path.join(root, "components/FloatingContact.tsx"),
                "utf8",
            )
            .includes("MessageIcon"),
    ],
];

for (const [name, ok] of checks) {
    if (!ok) {
        console.error("FAIL", name);
        fail += 1;
    } else {
        console.log("OK", name);
    }
}

const marketing = spawnSync(
    process.execPath,
    [path.join(root, "scripts/assert-marketing.mjs")],
    { cwd: root, encoding: "utf8" },
);
if (marketing.stdout) process.stdout.write(marketing.stdout);
if (marketing.stderr) process.stderr.write(marketing.stderr);
if (marketing.status !== 0) {
    console.error("FAIL marketing");
    fail += 1;
}

if (fail) process.exit(1);
console.log("DEMO_STRUCTURAL_OK");

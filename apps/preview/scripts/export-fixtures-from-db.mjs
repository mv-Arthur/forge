#!/usr/bin/env node
/**
 * Scoped Beget MySQL → apps/preview fixtures (1 JSON row per publish product).
 * Usage:
 *   node scripts/export-fixtures-from-db.mjs            # full export
 *   node scripts/export-fixtures-from-db.mjs --parity-only
 *   node scripts/export-fixtures-from-db.mjs --help
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FIXTURES = path.join(ROOT, "data", "fixtures");
const ENV_FILE = path.join(ROOT, ".beget-db.env");
const LAST_EXTRACT = "/tmp/goalplan-sync-preview-fixtures-last-extract";
const OBJECT_PARENT = 459;
const BATCH = 80;
const ENCODING = "one_row_per_product_for_mergeProjects";

const EXACT_META_KEYS = [
    "_price",
    "_regular_price",
    "_thumbnail_id",
    "_product_image_gallery",
    "custom_product_title",
    "label_project_name",
    "card_some_text",
    "link_sibling_1",
    "link_sibling_2",
    "link_sibling_3",
    "link_sibling_4",
    "technology_check_carcas",
    "technology_check_gazobet",
    "technology_check_seep",
    "technology_check_kirpich",
    "technology_check_fahverc",
];

const TECH_TERM_MAP = {
    "doma-iz-gazobetona": "gas_concrete",
    "karkasnye-doma": "frame",
    "kirpichnye-doma": "brick",
    "doma-iz-kirpicha": "brick",
    "sip-doma": "sip",
    "doma-iz-sip-panelei": "sip",
    "fahverkovye-doma": "fachwerk",
};

const TECH_ETAPI = {
    gas_concrete: "gazobet",
    frame: "carcas",
    sip: "seep",
    brick: "kirpich",
    fachwerk: "favherc",
};

const TECH_CAT = {
    gas_concrete: "doma-iz-gazobetona",
    frame: "karkasnye-doma",
    sip: "doma-iz-sip-panelei",
    brick: "doma-iz-kirpicha",
    fachwerk: "fahverkovye-doma",
};

function die(msg, code = 1) {
    console.error(msg);
    process.exit(code);
}

function loadEnv(file) {
    if (!fs.existsSync(file)) die(`Missing env file: ${file}`);
    const env = {};
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const i = t.indexOf("=");
        if (i < 0) continue;
        let v = t.slice(i + 1).trim();
        // Mirror bash smoke: PASS="${BEGET_DB_PASS#\'}"; PASS="${PASS%\'}"
        if (v.length >= 2 && (v.startsWith("'") || v.startsWith('"')) && v.endsWith(v[0])) {
            v = v.slice(1, -1);
        }
        env[t.slice(0, i).trim()] = v;
    }
    for (const k of [
        "BEGET_DB_HOST",
        "BEGET_DB_PORT",
        "BEGET_DB_USER",
        "BEGET_DB_NAME",
        "BEGET_DB_PASS",
    ]) {
        if (!env[k]) die(`Missing ${k} in env file`);
    }
    return env;
}

function resolveMysql() {
    if (process.env.MYSQL_BIN && fs.existsSync(process.env.MYSQL_BIN)) {
        return process.env.MYSQL_BIN;
    }
    const brew = "/opt/homebrew/opt/mysql-client/bin/mysql";
    if (fs.existsSync(brew)) return brew;
    const which = spawnSync("which", ["mysql"], { encoding: "utf8" });
    if (which.status === 0 && which.stdout.trim()) return which.stdout.trim();
    die("mysql client not found");
}

function mysqlQuery(mysqlBin, env, sql, attempt = 1) {
    const args = [
        "-h",
        env.BEGET_DB_HOST,
        "-P",
        env.BEGET_DB_PORT,
        "-u",
        env.BEGET_DB_USER,
        `-p${env.BEGET_DB_PASS}`,
        env.BEGET_DB_NAME,
        "--default-character-set=utf8mb4",
        "--connect-timeout=30",
        "--batch",
        "--raw",
        "-e",
        sql,
    ];
    const r = spawnSync(mysqlBin, args, {
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
    });
    if (r.status !== 0) {
        const err = (r.stderr || r.stdout || "mysql failed")
            .replaceAll(env.BEGET_DB_PASS, "***")
            .slice(0, 500);
        if (attempt < 5 && /Can't connect|Lost connection|timed out|Error 20/i.test(err)) {
            const waitMs = attempt * 2000;
            console.error(`mysql retry ${attempt}/5 after ${waitMs}ms: ${err.split("\n")[0]}`);
            spawnSync("sleep", [String(waitMs / 1000)]);
            return mysqlQuery(mysqlBin, env, sql, attempt + 1);
        }
        die(`mysql error: ${err}`);
    }
    return r.stdout || "";
}

function parseTsv(stdout) {
    const lines = stdout.replace(/\r/g, "").split("\n").filter(Boolean);
    if (lines.length === 0) return [];
    const headers = lines[0].split("\t");
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split("\t");
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = cols[j] === "NULL" || cols[j] === undefined ? null : cols[j];
        }
        rows.push(obj);
    }
    return rows;
}

function chunks(arr, n) {
    const out = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
}

function slugify(input) {
    const s = String(input || "")
        .toLowerCase()
        .replace(/ё/g, "e")
        .replace(/[а-я]/g, (ch) => {
            const map = {
                а: "a",
                б: "b",
                в: "v",
                г: "g",
                д: "d",
                е: "e",
                ж: "zh",
                з: "z",
                и: "i",
                й: "y",
                к: "k",
                л: "l",
                м: "m",
                н: "n",
                о: "o",
                п: "p",
                р: "r",
                с: "s",
                т: "t",
                у: "u",
                ф: "f",
                х: "h",
                ц: "c",
                ч: "ch",
                ш: "sh",
                щ: "sch",
                ъ: "",
                ы: "y",
                ь: "",
                э: "e",
                ю: "yu",
                я: "ya",
            };
            return map[ch] ?? "";
        })
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-");
    return s || "project";
}

function stripTechPrefix(name) {
    return String(name || "")
        .replace(/^каркасный\s+/i, "")
        .replace(/^газобетонный\s+/i, "")
        .replace(/^кирпичный\s+/i, "")
        .replace(/^сип-?/i, "")
        .replace(/^фахверковый\s+/i, "")
        .replace(/^дом\s+/i, "")
        .replace(/^проект\s+/i, "")
        .trim();
}

function parseArea(raw) {
    if (raw == null) return null;
    const m = String(raw).replace(",", ".").match(/(\d+(?:\.\d+)?)/);
    return m ? Math.round(Number(m[1])) : null;
}

function parseIntSafe(raw) {
    if (raw == null || raw === "") return null;
    const n = parseInt(String(raw).replace(/[^\d]/g, ""), 10);
    return Number.isFinite(n) ? n : null;
}

function mapFloors(raw) {
    if (raw == null) return null;
    const s = String(raw).trim();
    if (s === "1" || s === "1.0") return "1";
    if (s === "2" || s === "2.0") return "2";
    if (s === "1.5" || /мансард|1\.5/i.test(s)) return "1.5";
    if (/мансард/i.test(s)) return "mansard";
    return null;
}

function normalizeImageUrl(guid) {
    if (!guid) return null;
    let u = String(guid).trim();
    if (u.startsWith("//")) u = "https:" + u;
    u = u.replace(/^http:\/\//i, "https://");
    try {
        const url = new URL(u);
        if (url.hostname === "ncottage.test" || url.hostname.endsWith(".local")) {
            url.hostname = "ncottage.ru";
        }
        if (url.hostname !== "ncottage.ru" && url.hostname !== "www.ncottage.ru") {
            // keep but prefer ncottage host rewrite for known upload paths
            if (url.pathname.includes("/uploads/") || url.pathname.includes("/app/uploads/")) {
                return `https://ncottage.ru${url.pathname}`;
            }
        }
        return url.toString();
    } catch {
        return u.startsWith("https://") ? u : null;
    }
}

function displayPrice(variant) {
    const pkgs = (variant.packages || [])
        .map((p) => p.price)
        .filter((n) => Number.isFinite(n) && n > 0);
    if (pkgs.length) return Math.min(...pkgs);
    const pf = Number(variant.priceFrom);
    return Number.isFinite(pf) && pf > 0 ? Math.round(pf) : 0;
}

function help() {
    console.log(`export-fixtures-from-db.mjs
  (default)     extract from Beget + write fixtures
  --parity-only compare fixtures to live DB counts/IDs/prices
  --help        this help
Env: apps/preview/.beget-db.env (BEGET_DB_*)
Mysql: MYSQL_BIN or /opt/homebrew/opt/mysql-client/bin/mysql
Last extract pointer: ${LAST_EXTRACT}
`);
}

function extract(mysqlBin, env) {
    const extractDir = fs.mkdtempSync(
        path.join(process.env.TMPDIR || "/tmp", "ncottage-extract-"),
    );
    console.error(`EXTRACT_DIR=${extractDir}`);

    // Strip tabs/newlines so --batch TSV columns stay aligned.
    const products = parseTsv(
        mysqlQuery(
            mysqlBin,
            env,
            `SELECT ID, post_name, post_title,
                REPLACE(REPLACE(REPLACE(IFNULL(post_content,''), '\\t', ' '), '\\n', ' '), '\\r', ' ') AS post_content,
                REPLACE(REPLACE(REPLACE(IFNULL(post_excerpt,''), '\\t', ' '), '\\n', ' '), '\\r', ' ') AS post_excerpt
             FROM wp_posts
             WHERE post_type='product' AND post_status='publish'
             ORDER BY ID`,
        ),
    );
    const objects = parseTsv(
        mysqlQuery(
            mysqlBin,
            env,
            `SELECT ID, post_name, post_title,
                REPLACE(REPLACE(REPLACE(IFNULL(post_content,''), '\\t', ' '), '\\n', ' '), '\\r', ' ') AS post_content,
                REPLACE(REPLACE(REPLACE(IFNULL(post_excerpt,''), '\\t', ' '), '\\n', ' '), '\\r', ' ') AS post_excerpt
             FROM wp_posts
             WHERE post_type='page' AND post_status='publish' AND post_parent=${OBJECT_PARENT}
             ORDER BY ID`,
        ),
    );
    console.error(`PRODUCTS_EXTRACTED=${products.length}`);
    console.error(`OBJECTS_EXTRACTED=${objects.length}`);
    if (products.length === 0) die("No products extracted");
    if (objects.length === 0) die("No objects extracted");

    fs.writeFileSync(
        path.join(extractDir, "products.jsonl"),
        products.map((r) => JSON.stringify(r)).join("\n") + "\n",
    );
    fs.writeFileSync(
        path.join(extractDir, "objects.jsonl"),
        objects.map((r) => JSON.stringify(r)).join("\n") + "\n",
    );

    const productIds = products.map((p) => String(p.ID)).filter((id) => /^\d+$/.test(id));
    const objectIds = objects.map((o) => String(o.ID)).filter((id) => /^\d+$/.test(id));
    if (productIds.length !== products.length) {
        die(`Product ID parse mismatch: ${productIds.length} vs ${products.length}`);
    }
    if (objectIds.length !== objects.length) {
        die(`Object ID parse mismatch: ${objectIds.length} vs ${objects.length}`);
    }
    const allIds = [...productIds, ...objectIds];

    const metaByPost = new Map();
    let etapiMetaRows = 0;
    const exactList = EXACT_META_KEYS.map((k) => `'${k.replace(/'/g, "''")}'`).join(",");

    for (const batch of chunks(allIds, BATCH)) {
        const inList = batch.join(",");
        const sql = `SELECT post_id, meta_key, meta_value
          FROM wp_postmeta
          WHERE post_id IN (${inList})
            AND (
              meta_key IN (${exactList})
              OR meta_key LIKE 'etapi_%'
              OR meta_key LIKE 'built_%'
            )`;
        const rows = parseTsv(mysqlQuery(mysqlBin, env, sql));
        for (const r of rows) {
            const pid = String(r.post_id);
            if (!metaByPost.has(pid)) metaByPost.set(pid, {});
            metaByPost.get(pid)[r.meta_key] = r.meta_value;
            if (String(r.meta_key).startsWith("etapi_")) etapiMetaRows++;
        }
        console.error(`META_BATCH size=${batch.length} rows=${rows.length}`);
    }
    console.error(`ETAPI_META_ROWS=${etapiMetaRows}`);
    fs.writeFileSync(
        path.join(extractDir, "meta.json"),
        JSON.stringify(Object.fromEntries(metaByPost)),
    );

    // terms for products
    const termsByProduct = new Map();
    for (const batch of chunks(productIds, BATCH)) {
        const inList = batch.join(",");
        const sql = `SELECT tr.object_id AS post_id, tt.taxonomy, t.name, t.slug
          FROM wp_term_relationships tr
          JOIN wp_term_taxonomy tt ON tt.term_taxonomy_id = tr.term_taxonomy_id
          JOIN wp_terms t ON t.term_id = tt.term_id
          WHERE tr.object_id IN (${inList})
            AND (tt.taxonomy LIKE 'pa\\_%' OR tt.taxonomy = 'product_cat')`;
        const rows = parseTsv(mysqlQuery(mysqlBin, env, sql));
        for (const r of rows) {
            const pid = String(r.post_id);
            if (!termsByProduct.has(pid)) termsByProduct.set(pid, []);
            termsByProduct.get(pid).push({
                taxonomy: r.taxonomy,
                name: r.name,
                slug: r.slug,
            });
        }
    }
    fs.writeFileSync(
        path.join(extractDir, "terms.json"),
        JSON.stringify(Object.fromEntries(termsByProduct)),
    );

    // price lookup
    const lookup = new Map();
    for (const batch of chunks(productIds, BATCH)) {
        const inList = batch.join(",");
        const sql = `SELECT product_id, min_price, max_price
          FROM wp_wc_product_meta_lookup
          WHERE product_id IN (${inList})`;
        const rows = parseTsv(mysqlQuery(mysqlBin, env, sql));
        for (const r of rows) {
            lookup.set(String(r.product_id), {
                min_price: Number(r.min_price) || 0,
                max_price: Number(r.max_price) || 0,
            });
        }
    }
    fs.writeFileSync(
        path.join(extractDir, "lookup.json"),
        JSON.stringify(Object.fromEntries(lookup)),
    );

    // collect media ids
    const mediaIds = new Set();
    for (const [pid, meta] of metaByPost) {
        if (meta._thumbnail_id) mediaIds.add(String(meta._thumbnail_id));
        if (meta._product_image_gallery) {
            for (const id of String(meta._product_image_gallery).split(",")) {
                const t = id.trim();
                if (t) mediaIds.add(t);
            }
        }
        for (const [k, v] of Object.entries(meta)) {
            if (/slider_carousel_image$/.test(k) && v) mediaIds.add(String(v));
        }
    }

    // child attachments of objects
    const childByParent = new Map();
    for (const batch of chunks(objectIds, BATCH)) {
        const inList = batch.join(",");
        const sql = `SELECT ID, post_parent, guid
          FROM wp_posts
          WHERE post_type='attachment' AND post_parent IN (${inList})
          ORDER BY menu_order, ID`;
        const rows = parseTsv(mysqlQuery(mysqlBin, env, sql));
        for (const r of rows) {
            mediaIds.add(String(r.ID));
            const pp = String(r.post_parent);
            if (!childByParent.has(pp)) childByParent.set(pp, []);
            childByParent.get(pp).push({ id: String(r.ID), guid: r.guid });
        }
    }

    const attachments = new Map();
    const mediaList = [...mediaIds].filter(Boolean);
    for (const batch of chunks(mediaList, BATCH)) {
        const inList = batch.join(",");
        const sql = `SELECT ID, guid FROM wp_posts WHERE ID IN (${inList})`;
        const rows = parseTsv(mysqlQuery(mysqlBin, env, sql));
        for (const r of rows) {
            attachments.set(String(r.ID), normalizeImageUrl(r.guid));
        }
    }
    fs.writeFileSync(
        path.join(extractDir, "attachments.json"),
        JSON.stringify(Object.fromEntries(attachments)),
    );
    fs.writeFileSync(
        path.join(extractDir, "object_children.json"),
        JSON.stringify(Object.fromEntries(childByParent)),
    );

    // pointer dir for plan verify
    try {
        fs.rmSync(LAST_EXTRACT, { recursive: true, force: true });
    } catch {
        /* ignore */
    }
    fs.mkdirSync(LAST_EXTRACT, { recursive: true });
    for (const f of fs.readdirSync(extractDir)) {
        fs.copyFileSync(path.join(extractDir, f), path.join(LAST_EXTRACT, f));
    }
    fs.writeFileSync(path.join(LAST_EXTRACT, "path.txt"), extractDir + "\n");

    return {
        extractDir,
        products,
        objects,
        metaByPost,
        termsByProduct,
        lookup,
        attachments,
        childByParent,
    };
}

function techFromTerms(terms) {
    const techTerms = (terms || []).filter(
        (t) => t.taxonomy === "pa_tehnologii-stroitelstva",
    );
    for (const t of techTerms) {
        if (TECH_TERM_MAP[t.slug]) return TECH_TERM_MAP[t.slug];
    }
    // fallback product_cat
    for (const t of terms || []) {
        if (t.taxonomy === "product_cat" && TECH_TERM_MAP[t.slug]) {
            return TECH_TERM_MAP[t.slug];
        }
    }
    return null;
}

function termValue(terms, taxonomy) {
    const t = (terms || []).find((x) => x.taxonomy === taxonomy);
    return t ? t.name : null;
}

function packagesFromMeta(meta, tech) {
    const prefix = TECH_ETAPI[tech];
    if (!prefix) return [];
    const baseKey = `etapi_${prefix}_`;
    let b = 0,
        s = 0,
        c = 0;
    let any = false;
    for (const [k, v] of Object.entries(meta || {})) {
        if (!k.startsWith(baseKey)) continue;
        const n = Number(v);
        if (!Number.isFinite(n)) continue;
        if (k.endsWith("_etap_card_bprice")) {
            b += n;
            any = true;
        } else if (k.endsWith("_etap_card_sprice")) {
            s += n;
            any = true;
        } else if (k.endsWith("_etap_card_cprice")) {
            c += n;
            any = true;
        }
    }
    if (!any) return [];
    const pkgs = [];
    if (b > 0) pkgs.push({ name: "Базовая", price: Math.round(b) });
    if (s > 0) pkgs.push({ name: "Стандарт", price: Math.round(s) });
    if (c > 0) pkgs.push({ name: "Комфорт", price: Math.round(c) });
    return pkgs;
}

function featuresFromTerms(terms) {
    const features = [];
    const terrace = termValue(terms, "pa_terrasa");
    if (terrace && /да|yes|1/i.test(terrace)) features.push("terrace");
    const light = termValue(terms, "pa_vtoroj-svet");
    if (light && /да|yes|1/i.test(light)) features.push("second_light");
    const garage = termValue(terms, "pa_garazh");
    if (garage && /да|yes|1/i.test(garage)) features.push("garage");
    return features;
}

function designSlugForProduct(p, meta, tech, siblingMetaById) {
    // Prefer shared label across siblings
    const labels = [];
    const ownLabel = meta.label_project_name || stripTechPrefix(p.post_title);
    if (ownLabel) labels.push(ownLabel);
    for (const key of [
        "link_sibling_1",
        "link_sibling_2",
        "link_sibling_3",
        "link_sibling_4",
    ]) {
        const sid = meta[key];
        if (!sid || sid === "0") continue;
        const sm = siblingMetaById.get(String(sid));
        if (sm?.label_project_name) labels.push(sm.label_project_name);
    }
    // most common non-empty label, else own
    const freq = new Map();
    for (const l of labels) {
        const k = String(l).trim();
        if (!k) continue;
        freq.set(k, (freq.get(k) || 0) + 1);
    }
    let best = ownLabel || p.post_name;
    let bestN = 0;
    for (const [k, n] of freq) {
        if (n > bestN) {
            best = k;
            bestN = n;
        }
    }
    return slugify(stripTechPrefix(best));
}

function transform(data) {
    const {
        products,
        objects,
        metaByPost,
        termsByProduct,
        lookup,
        attachments,
        childByParent,
    } = data;

    // index meta for sibling labels
    const siblingMetaById = metaByPost;

    // first pass: design slug per product
    const rows = [];
    for (const p of products) {
        const pid = String(p.ID);
        const meta = metaByPost.get(pid) || {};
        const terms = termsByProduct.get(pid) || [];
        // Prefer URL/post_name signals (reliable) over pa_ terms (often multi-tagged).
        let tech = null;
        const nameBlob = `${p.post_name} ${p.post_title}`.toLowerCase();
        if (/karkas/.test(nameBlob)) tech = "frame";
        else if (/\bsip\b|sip-/.test(nameBlob)) tech = "sip";
        else if (/kirpich/.test(nameBlob)) tech = "brick";
        else if (/fahverk|fachwerk/.test(nameBlob)) tech = "fachwerk";
        else if (/gazobeton|penobeton/.test(nameBlob)) tech = "gas_concrete";
        if (!tech) tech = techFromTerms(terms);
        if (!tech) {
            if (meta.technology_check_gazobet === "1") tech = "gas_concrete";
            else if (meta.technology_check_carcas === "1") tech = "frame";
            else if (meta.technology_check_seep === "1") tech = "sip";
            else if (meta.technology_check_kirpich === "1") tech = "brick";
            else if (meta.technology_check_fahverc === "1") tech = "fachwerk";
            else tech = "gas_concrete";
        }
        let designSlug = designSlugForProduct(p, meta, tech, siblingMetaById);
        const lu = lookup.get(pid) || { min_price: 0, max_price: 0 };
        let priceFrom = Math.round(lu.min_price || Number(meta._price) || 0);
        const packages = packagesFromMeta(meta, tech);
        if (priceFrom <= 0 && packages.length) {
            priceFrom = Math.min(...packages.map((x) => x.price));
        }
        const priceHigh = Math.round(
            lu.max_price ||
                (packages.length ? Math.max(...packages.map((x) => x.price)) : priceFrom) ||
                priceFrom,
        );
        const cat = TECH_CAT[tech] || "doma-iz-gazobetona";
        const url = `https://ncottage.ru/proekty/${cat}/${p.post_name}/`;

        const renders = [];
        const thumb = meta._thumbnail_id
            ? attachments.get(String(meta._thumbnail_id))
            : null;
        if (thumb) renders.push(thumb);
        if (meta._product_image_gallery) {
            for (const id of String(meta._product_image_gallery).split(",")) {
                const u = attachments.get(id.trim());
                if (u && !renders.includes(u)) renders.push(u);
            }
        }

        const area = parseArea(termValue(terms, "pa_obshaya-ploshhad-doma"));
        const bedrooms = parseIntSafe(
            termValue(terms, "pa_kolichestvo-spalen"),
        );
        const bathrooms = parseIntSafe(
            termValue(terms, "pa_kolichestvo-vannyh-komnat"),
        );
        const floors = mapFloors(termValue(terms, "pa_kolichestvo-etazhej"));
        const dimensions = termValue(terms, "pa_razmer-doma");
        const categories = (terms || [])
            .filter((t) => t.taxonomy === "product_cat")
            .map((t) => t.slug);
        const name =
            meta.custom_product_title ||
            meta.label_project_name ||
            p.post_title ||
            p.post_name;

        const features = featuresFromTerms(terms);
        const description =
            (p.post_excerpt && p.post_excerpt.trim()) ||
            (p.post_content
                ? String(p.post_content).replace(/<[^>]+>/g, " ").slice(0, 500)
                : null);

        rows.push({
            sourceProductId: Number(p.ID),
            slug: designSlug,
            name,
            dimensions: dimensions || null,
            area,
            bedrooms,
            bathrooms,
            floors,
            categories,
            technologies: [tech],
            features,
            description,
            renders,
            floorPlans: [],
            variants: [
                {
                    technology: tech,
                    slug: designSlug,
                    priceFrom,
                    priceLow: priceFrom,
                    priceHigh: priceHigh || priceFrom,
                    offerCount: packages.length || 1,
                    packages,
                    mortgageFrom: priceFrom > 0 ? Math.round((priceFrom * 0.06) / 12 / 1.5) : null,
                    category: cat,
                    url,
                    sourceProductId: Number(p.ID),
                },
            ],
        });
    }

    // same-tech collision: unique design slug per product so mergeProjects cannot drop any
    const seenTechSlug = new Map(); // key slug::tech -> first product id
    for (const r of rows) {
        const tech = r.technologies[0];
        const k = `${r.slug}::${tech}`;
        if (!seenTechSlug.has(k)) {
            seenTechSlug.set(k, r.sourceProductId);
            continue;
        }
        const newSlug = `${r.slug}-${tech}-${r.sourceProductId}`;
        r.slug = newSlug;
        r.variants[0].slug = newSlug;
    }

    // objects
    const objectRows = [];
    const extras = {};
    for (const o of objects) {
        const oid = String(o.ID);
        const meta = metaByPost.get(oid) || {};
        const title =
            meta.built_item_built_item_title || o.post_title || o.post_name;
        const gallery = [];
        const children = childByParent.get(oid) || [];
        for (const c of children) {
            const u = normalizeImageUrl(c.guid) || attachments.get(c.id);
            if (u && !gallery.includes(u)) gallery.push(u);
        }
        // slider images as fallback
        for (const [k, v] of Object.entries(meta)) {
            if (/slider_carousel_image$/.test(k) && v) {
                const u = attachments.get(String(v));
                if (u && !gallery.includes(u)) gallery.push(u);
            }
        }
        const thumb = meta._thumbnail_id
            ? attachments.get(String(meta._thumbnail_id))
            : null;
        if (thumb && !gallery.includes(thumb)) gallery.unshift(thumb);

        // location from built_table
        let location = null;
        const tableN = parseInt(meta.built_item_built_table || "0", 10) || 0;
        for (let i = 0; i < tableN; i++) {
            const lab = meta[`built_item_built_table_${i}_built_table_lable`];
            const val = meta[`built_item_built_table_${i}_built_table_value`];
            if (lab && /местополож|локац|адрес|район/i.test(lab) && val) {
                location = val;
            }
        }

        const blob = `${title} ${o.post_content || ""}`;
        const status = /идет\s+строительство|строится|in[- ]progress/i.test(blob)
            ? "in-progress"
            : "built";

        let technology = null;
        if (/газобетон/i.test(blob)) technology = "gas_concrete";
        else if (/каркас/i.test(blob)) technology = "frame";
        else if (/сип|sip/i.test(blob)) technology = "sip";
        else if (/кирпич/i.test(blob)) technology = "brick";
        else if (/фахверк/i.test(blob)) technology = "fachwerk";

        let floors = null;
        if (/одноэтаж/i.test(blob)) floors = "1";
        else if (/двухэтаж|2[- ]?этаж/i.test(blob)) floors = "2";
        else if (/мансард/i.test(blob)) floors = "mansard";

        objectRows.push({
            title,
            slug: o.post_name,
            technology,
            location,
            floors,
            status,
            gallery,
            renders: gallery.slice(0, 5),
            floorPlans: [],
            url: `https://ncottage.ru/objects/${o.post_name}/`,
        });
        extras[o.post_name] = {
            area: null,
            floors: floors ? (floors === "2" ? 2 : floors === "1" ? 1 : null) : null,
            bedrooms: null,
            bathrooms: null,
            kitchen: null,
            term: null,
            sauna: null,
            garage: null,
            metaDescription: null,
        };
    }

    return { projects: rows, objects: objectRows, extras };
}

function writeFixtures(projects, objects, extras, productIds, objectSlugs) {
    fs.mkdirSync(FIXTURES, { recursive: true });
    // strip sourceProductId from public variants optional — keep on variants for parity
    const projectsOut = projects.map((p) => {
        const { sourceProductId, ...rest } = p;
        return rest;
    });
    fs.writeFileSync(
        path.join(FIXTURES, "projects.normalized.json"),
        JSON.stringify(projectsOut, null, 4) + "\n",
    );
    fs.writeFileSync(
        path.join(FIXTURES, "built-objects.normalized.json"),
        JSON.stringify(objects, null, 4) + "\n",
    );
    fs.writeFileSync(
        path.join(FIXTURES, "built-objects.extras.json"),
        JSON.stringify(extras, null, 4) + "\n",
    );
    const manifest = {
        products_count: productIds.length,
        objects_count: objectSlugs.length,
        product_ids: productIds,
        object_slugs: objectSlugs,
        encoding: ENCODING,
        exported_at: new Date().toISOString(),
    };
    fs.writeFileSync(
        path.join(FIXTURES, ".export-manifest.json"),
        JSON.stringify(manifest, null, 2) + "\n",
    );
    console.error(
        `WROTE projects=${projectsOut.length} objects=${objects.length} products_count=${manifest.products_count}`,
    );
}

function simulateMerge(projects) {
    // mirror data.ts mergeProjects tech dedupe
    const bySlug = new Map();
    let dropped = 0;
    for (const p of projects) {
        const existing = bySlug.get(p.slug);
        if (!existing) {
            bySlug.set(p.slug, {
                slug: p.slug,
                variants: [...p.variants],
                technologies: [...p.technologies],
            });
            continue;
        }
        const seen = new Set(existing.variants.map((v) => v.technology));
        for (const v of p.variants) {
            if (seen.has(v.technology)) {
                dropped++;
                continue;
            }
            seen.add(v.technology);
            existing.variants.push(v);
            if (!existing.technologies.includes(v.technology)) {
                existing.technologies.push(v.technology);
            }
        }
    }
    let variantCount = 0;
    for (const g of bySlug.values()) variantCount += g.variants.length;
    return { groups: bySlug.size, variants: variantCount, dropped };
}

function parityOnly(mysqlBin, env) {
    const manifestPath = path.join(FIXTURES, ".export-manifest.json");
    const projectsPath = path.join(FIXTURES, "projects.normalized.json");
    const objectsPath = path.join(FIXTURES, "built-objects.normalized.json");
    if (!fs.existsSync(manifestPath) || !fs.existsSync(projectsPath)) {
        die("Fixtures/manifest missing; run full export first");
    }
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
    const objects = JSON.parse(fs.readFileSync(objectsPath, "utf8"));

    const dbProducts = parseTsv(
        mysqlQuery(
            mysqlBin,
            env,
            `SELECT ID FROM wp_posts WHERE post_type='product' AND post_status='publish'`,
        ),
    ).map((r) => Number(r.ID));
    const dbObjects = parseTsv(
        mysqlQuery(
            mysqlBin,
            env,
            `SELECT post_name FROM wp_posts WHERE post_type='page' AND post_status='publish' AND post_parent=${OBJECT_PARENT}`,
        ),
    ).map((r) => r.post_name);

    const fixtureProductIds = new Set(
        (manifest.product_ids || []).map(Number),
    );
    // also collect from variants if present
    for (const p of projects) {
        for (const v of p.variants || []) {
            if (v.sourceProductId) fixtureProductIds.add(Number(v.sourceProductId));
        }
    }
    const fixtureObjectSlugs = new Set(
        objects.map((o) => o.slug).concat(manifest.object_slugs || []),
    );

    const dbPset = new Set(dbProducts);
    const dbOset = new Set(dbObjects);

    let productsMissing = 0;
    let productsExtra = 0;
    for (const id of dbPset) if (!fixtureProductIds.has(id)) productsMissing++;
    for (const id of fixtureProductIds) if (!dbPset.has(id)) productsExtra++;

    let objectsMissing = 0;
    let objectsExtra = 0;
    for (const s of dbOset) if (!fixtureObjectSlugs.has(s)) objectsMissing++;
    for (const s of fixtureObjectSlugs) if (!dbOset.has(s)) objectsExtra++;

    const PRODUCTS_DB = dbProducts.length;
    const PRODUCTS_FIXTURE = projects.length;
    const OBJECTS_DB = dbObjects.length;
    const OBJECTS_FIXTURE = objects.length;

    const merge = simulateMerge(projects);

    // price sample
    const sampleIds = [...fixtureProductIds].slice(0, 10);
    let priceOk = true;
    if (sampleIds.length === 0) priceOk = false;
    else {
        const inList = sampleIds.join(",");
        const luRows = parseTsv(
            mysqlQuery(
                mysqlBin,
                env,
                `SELECT product_id, min_price FROM wp_wc_product_meta_lookup WHERE product_id IN (${inList})`,
            ),
        );
        const luMap = new Map(
            luRows.map((r) => [Number(r.product_id), Math.round(Number(r.min_price) || 0)]),
        );
        // map product id -> variant
        const varById = new Map();
        for (const p of projects) {
            for (const v of p.variants || []) {
                if (v.sourceProductId) varById.set(Number(v.sourceProductId), v);
            }
        }
        // if no sourceProductId on variants, match via manifest order not available — fail samples without id
        for (const id of sampleIds) {
            const v = varById.get(id);
            if (!v) {
                priceOk = false;
                break;
            }
            const lookup = Math.round(luMap.get(id) || 0);
            const pkgs = (v.packages || [])
                .map((p) => p.price)
                .filter((n) => Number.isFinite(n) && n > 0);
            const ruleExpected = pkgs.length
                ? Math.min(...pkgs)
                : lookup || Math.round(Number(v.priceFrom) || 0);
            const actual = displayPrice(v);
            if (Math.abs(actual - ruleExpected) > 1) {
                priceOk = false;
                break;
            }
            if (!pkgs.length && lookup > 0 && Math.abs(Math.round(v.priceFrom) - lookup) > 1) {
                priceOk = false;
                break;
            }
            if (ruleExpected <= 0) {
                priceOk = false;
                break;
            }
        }
    }

    console.log(`PRODUCTS_DB=${PRODUCTS_DB}`);
    console.log(`PRODUCTS_FIXTURE=${PRODUCTS_FIXTURE}`);
    console.log(`OBJECTS_DB=${OBJECTS_DB}`);
    console.log(`OBJECTS_FIXTURE=${OBJECTS_FIXTURE}`);
    console.log(`PRODUCTS_MISSING=${productsMissing}`);
    console.log(`PRODUCTS_EXTRA=${productsExtra}`);
    console.log(`OBJECTS_MISSING=${objectsMissing}`);
    console.log(`OBJECTS_EXTRA=${objectsExtra}`);
    console.log(`POST_MERGE_VARIANTS=${merge.variants}`);
    console.log(`PRODUCTS_DROPPED_SAME_TECH=${merge.dropped}`);
    console.log(priceOk ? "PRICE_SAMPLE_OK" : "PRICE_SAMPLE_FAIL");

    const countsOk =
        PRODUCTS_FIXTURE === PRODUCTS_DB &&
        OBJECTS_FIXTURE === OBJECTS_DB &&
        productsMissing === 0 &&
        productsExtra === 0 &&
        objectsMissing === 0 &&
        objectsExtra === 0 &&
        merge.dropped === 0 &&
        priceOk;

    if (countsOk) {
        console.log("PARITY_OK");
        return 0;
    }
    console.log("PARITY_FAIL");
    return 1;
}

function main() {
    const args = process.argv.slice(2);
    if (args.includes("--help") || args.includes("-h")) {
        help();
        process.exit(0);
    }
    const mysqlBin = resolveMysql();
    const env = loadEnv(ENV_FILE);

    if (args.includes("--parity-only")) {
        process.exit(parityOnly(mysqlBin, env));
    }

    const data = extract(mysqlBin, env);
    const { projects, objects, extras } = transform(data);
    if (projects.length !== data.products.length) {
        die(`Transform lost products: ${projects.length} vs ${data.products.length}`);
    }
    const productIds = data.products.map((p) => Number(p.ID));
    const objectSlugs = objects.map((o) => o.slug);

    // attach sourceProductId is already on variants
    writeFixtures(projects, objects, extras, productIds, objectSlugs);

    // self-check slugify purity
    if (slugify("Рейн") !== slugify("Рейн")) die("slugify impure");

    // run parity inline
    const code = parityOnly(mysqlBin, env);
    process.exit(code);
}

main();

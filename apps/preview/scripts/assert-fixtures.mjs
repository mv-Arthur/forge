#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../data/fixtures");
const m = JSON.parse(fs.readFileSync(path.join(root, ".export-manifest.json"), "utf8"));
const p = JSON.parse(fs.readFileSync(path.join(root, "projects.normalized.json"), "utf8"));
const o = JSON.parse(fs.readFileSync(path.join(root, "built-objects.normalized.json"), "utf8"));
const e = JSON.parse(fs.readFileSync(path.join(root, "built-objects.extras.json"), "utf8"));
if (p.length !== m.products_count) throw new Error("projects count mismatch");
if (o.length !== m.objects_count) throw new Error("objects count mismatch");
if (!p.every((x) => (x.variants || []).length === 1)) throw new Error("variants.length must be 1");
if (JSON.stringify([...Object.keys(e)].sort()) !== JSON.stringify(o.map((x) => x.slug).sort())) {
  throw new Error("extras keys != object slugs");
}
const nonempty = o.filter((x) => x.gallery && x.gallery.length).length;
if (nonempty / o.length < 0.5) throw new Error("gallery ratio < 0.5");
const bySlug = new Map();
let dropped = 0;
for (const row of p) {
  const tech = row.variants[0].technology;
  if (!bySlug.has(row.slug)) bySlug.set(row.slug, new Set());
  const set = bySlug.get(row.slug);
  if (set.has(tech)) dropped++;
  else set.add(tech);
}
if (dropped !== 0) throw new Error(`same-tech drop ${dropped}`);
console.log("ASSERT_FIXTURES_OK", { products: p.length, objects: o.length, designs: bySlug.size });

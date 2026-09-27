import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { RawProject, Technology } from "../src/types/catalog.ts";
import {
    buildSerialPage,
    isHandShowcaseSlug,
    isSerialProject,
    packageFloorPrice,
    planSvg,
    roomProgram,
    roomProgramAlt,
    storyCount,
    type SerialLocalImages,
    type SerialShowcaseInput,
} from "../src/lib/serialShowcase.ts";
import { applyShownMaterial } from "../src/lib/shownMaterial.ts";
import { sortByTechnology } from "../src/lib/technology.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SHOWCASE = path.join(ROOT, "data/fixtures/detail-showcase.json");
const PROJECTS = path.join(
    ROOT,
    "../ncottage-legacy-data/fixtures/projects.normalized.json"
);
const MEDIA = path.join(ROOT, "data/fixtures/media/detail");

function mergeSerialRaw(list: RawProject[]): RawProject[] {
    const bySlug = new Map<string, RawProject>();
    const primaryTech = new Map<string, Technology>();
    for (const p of list) {
        if (!isSerialProject(p)) continue;
        const existing = bySlug.get(p.slug);
        if (!existing) {
            if (p.technologies[0]) primaryTech.set(p.slug, p.technologies[0]);
            bySlug.set(p.slug, {
                ...p,
                technologies: [...p.technologies],
                categories: [...p.categories],
                features: [...p.features],
                renders: [...p.renders],
                floorPlans: [...p.floorPlans],
                variants: [...p.variants],
            });
            continue;
        }
        const seen = new Set(existing.variants.map((v) => v.technology));
        const variants = [...existing.variants];
        for (const v of p.variants) {
            if (seen.has(v.technology)) continue;
            seen.add(v.technology);
            variants.push(v);
        }
        bySlug.set(p.slug, {
            ...existing,
            variants,
            technologies: Array.from(
                new Set([...existing.technologies, ...p.technologies])
            ),
            features: Array.from(
                new Set([...existing.features, ...p.features])
            ),
            renders:
                existing.renders.length >= p.renders.length
                    ? existing.renders
                    : p.renders,
            area: existing.area ?? p.area,
            bedrooms: existing.bedrooms ?? p.bedrooms,
            bathrooms: existing.bathrooms ?? p.bathrooms,
            floors: existing.floors ?? p.floors,
            dimensions: existing.dimensions ?? p.dimensions,
        });
    }
    return Array.from(bySlug.values()).map((p) => {
        p.variants = sortByTechnology(
            p.variants,
            primaryTech.get(p.slug) ?? p.technologies[0]
        );
        p.technologies = p.variants.map((v) => v.technology);
        return applyShownMaterial(p);
    });
}

function toInput(project: RawProject): SerialShowcaseInput {
    const prices = project.variants
        .map((v) => packageFloorPrice(v))
        .filter((n): n is number => n != null);
    return {
        slug: project.slug,
        name: project.name,
        dimensions: project.dimensions,
        area: project.area,
        bedrooms: project.bedrooms,
        bathrooms: project.bathrooms,
        floors: project.floors,
        technologies: project.technologies,
        features: project.features,
        categories: project.categories,
        renders: project.renders,
        priceFrom: prices.length ? Math.min(...prices) : null,
    };
}

async function exists(file: string): Promise<boolean> {
    try {
        await stat(file);
        return true;
    } catch {
        return false;
    }
}

function mediaUrl(slug: string, file: string): string {
    return `/media/detail/${slug}/${file}`;
}

async function localImages(
    input: SerialShowcaseInput
): Promise<SerialLocalImages> {
    const dir = path.join(MEDIA, input.slug);
    const out: SerialLocalImages = {};
    const facadeNames = {
        front: "facade-front.jpg",
        back: "facade-back.jpg",
        left: "facade-left.jpg",
        right: "facade-right.jpg",
    };
    if (
        (await exists(path.join(dir, facadeNames.front))) &&
        (await exists(path.join(dir, facadeNames.back))) &&
        (await exists(path.join(dir, facadeNames.left))) &&
        (await exists(path.join(dir, facadeNames.right)))
    ) {
        const sectionLong = "section-long.jpg";
        const sectionCross = "section-cross.jpg";
        out.facades = {
            front: mediaUrl(input.slug, facadeNames.front),
            back: mediaUrl(input.slug, facadeNames.back),
            left: mediaUrl(input.slug, facadeNames.left),
            right: mediaUrl(input.slug, facadeNames.right),
            sectionLong: (await exists(path.join(dir, sectionLong)))
                ? mediaUrl(input.slug, sectionLong)
                : undefined,
            sectionCross: (await exists(path.join(dir, sectionCross)))
                ? mediaUrl(input.slug, sectionCross)
                : undefined,
        };
    }
    const heroes: string[] = [];
    for (let i = 1; i <= 8; i++) {
        const file = `hero-${i}.jpg`;
        if (await exists(path.join(dir, file))) {
            heroes.push(mediaUrl(input.slug, file));
        }
    }
    if (heroes.length) out.heroes = heroes;
    const rooms: Record<string, string> = {};
    for (const room of roomProgram(input)) {
        const file = `${room.id}.jpg`;
        if (await exists(path.join(dir, file))) {
            rooms[room.id] = mediaUrl(input.slug, file);
        }
    }
    if (Object.keys(rooms).length) out.rooms = rooms;
    if (await exists(path.join(dir, "mosaic-interior.jpg"))) {
        out.mosaicInterior = mediaUrl(input.slug, "mosaic-interior.jpg");
    }
    if (await exists(path.join(dir, "mosaic-layout.jpg"))) {
        out.mosaicLayout = mediaUrl(input.slug, "mosaic-layout.jpg");
    }
    const videoDir = path.join(dir, "video");
    const tlSrc = path.join(videoDir, "timelapse.mp4");
    const rvSrc = path.join(videoDir, "review.mp4");
    const videos: NonNullable<SerialLocalImages["videos"]> = {};
    if (await exists(tlSrc)) {
        videos.timelapse = {
            src: mediaUrl(input.slug, "video/timelapse.mp4"),
            poster: (await exists(path.join(videoDir, "timelapse.jpg")))
                ? mediaUrl(input.slug, "video/timelapse.jpg")
                : mediaUrl(input.slug, "hero-1.jpg"),
        };
    }
    if (await exists(rvSrc)) {
        videos.review = {
            src: mediaUrl(input.slug, "video/review.mp4"),
            poster: (await exists(path.join(videoDir, "review.jpg")))
                ? mediaUrl(input.slug, "video/review.jpg")
                : mediaUrl(input.slug, "hero-1.jpg"),
        };
    }
    if (videos.timelapse || videos.review) out.videos = videos;
    return out;
}

async function writePlans(input: SerialShowcaseInput) {
    const rooms = roomProgram(input);
    const stories = storyCount(input.floors);
    const dir = path.join(MEDIA, input.slug);
    await mkdir(dir, { recursive: true });
    for (let i = 0; i < stories; i++) {
        const floor = String(i + 1) as "1" | "2";
        const floorIndex = (i + 1) as 1 | 2;
        for (const layer of ["2d", "3d", "walls"] as const) {
            const svg = planSvg(rooms, floor, layer);
            const file = path.join(dir, `plan-${floorIndex}-${layer}.svg`);
            await writeFile(file, svg, "utf8");
        }
        const alt = planSvg(roomProgramAlt(input), floor, "2d-alt");
        await writeFile(
            path.join(dir, `plan-${floorIndex}-2d-alt.svg`),
            alt,
            "utf8"
        );
    }
}

async function main() {
    const raw = JSON.parse(await readFile(PROJECTS, "utf8")) as RawProject[];
    const current = JSON.parse(await readFile(SHOWCASE, "utf8")) as {
        filledSlugs: string[];
        pages: Record<string, unknown>;
    };
    const pages = { ...current.pages };
    let written = 0;
    for (const project of mergeSerialRaw(raw)) {
        if (isHandShowcaseSlug(project.slug)) continue;
        const input = toInput(project);
        if (input.renders.length === 0) continue;
        const images = await localImages(input);
        pages[project.slug] = buildSerialPage(input, images);
        await writePlans(input);
        written += 1;
    }
    const out = {
        filledSlugs: current.filledSlugs,
        pages,
    };
    await writeFile(SHOWCASE, `${JSON.stringify(out, null, 4)}\n`, "utf8");
    process.stdout.write(`serial showcases written: ${written}\n`);
}

main();

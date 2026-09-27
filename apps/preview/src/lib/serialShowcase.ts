import type {
    Floors,
    PlanLayer,
    ProjectFloorPlan,
    ShowcaseAboutBlock,
    ShowcaseCustomerAlts,
    ShowcaseDecorItem,
    ShowcaseFacade,
    ShowcaseHeatCalc,
    ShowcaseMosaic,
    ShowcasePayload,
    ShowcasePriceHike,
} from "@/types/catalog";
import { projectIsIndividual } from "./catalogFilter";
import { LINE_LEAD, LINE_TITLE } from "./copy";
import { bathroomsWord, bedroomsWord, formatTechnologyBrand } from "./format";
import { projectLine } from "./lines";
import { humanizeDisplayName, stripTechFromName } from "./names";

export const HAND_SHOWCASE_SLUGS = [
    "favor",
    "brig",
    "banya-levashovo",
] as const;

export type SerialShowcaseInput = {
    slug: string;
    name: string;
    dimensions: string | null;
    area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    floors: Floors | null;
    technologies: string[];
    features: string[];
    categories: string[];
    renders: string[];
    priceFrom: number | null;
};

export type DecorKind = "sleep" | "bath" | "living" | "other";

export type RoomSpec = {
    id: string;
    title: string;
    floor: "1" | "2";
    kind: DecorKind;
};

export type SerialLocalImages = {
    heroes?: string[];
    facades?: {
        front: string;
        back: string;
        left: string;
        right: string;
        sectionLong?: string;
        sectionCross?: string;
    };
    rooms?: Record<string, string>;
    mosaicInterior?: string;
    mosaicLayout?: string;
    videos?: {
        timelapse?: { poster: string; src: string };
        review?: { poster: string; src: string };
    };
};

export type SerialShowcasePage = {
    class: "serial";
    lead: string;
    about: ShowcaseAboutBlock[];
    mosaic?: ShowcaseMosaic;
    gallery: string[];
    builtPhotos?: string[];
    videos?: ShowcasePayload["videos"];
    plans: ProjectFloorPlan[];
    facades: ShowcaseFacade[];
    decor?: ShowcaseDecorItem[];
    story: null;
    priceHike?: ShowcasePriceHike;
    heatCalc?: ShowcaseHeatCalc;
    customerAlts?: ShowcaseCustomerAlts;
};

const FAVOR_FOOT = 100;
const FAVOR_PERIM = 40;
const FAVOR_STORIES = 2;
const FAVOR_ENVELOPE = {
    walls: 141.5,
    roof: 96.17,
    floor: 80.85,
    windows: 46.84,
    doors: 2.67,
};

export function isHandShowcaseSlug(slug: string): boolean {
    return (HAND_SHOWCASE_SLUGS as readonly string[]).includes(slug);
}

export function isSerialProject(project: {
    slug: string;
    categories?: string[];
}): boolean {
    if (project.slug === "banya-levashovo") return false;
    return !projectIsIndividual(project);
}

export function parseDims(raw: string | null): { w: number; d: number } | null {
    if (!raw) return null;
    const m = raw
        .replace(",", ".")
        .match(/(\d+(?:\.\d+)?)\s*[xх×]\s*(\d+(?:\.\d+)?)/i);
    if (!m) return null;
    const w = Number(m[1]);
    const d = Number(m[2]);
    if (!Number.isFinite(w) || !Number.isFinite(d) || w <= 0 || d <= 0) {
        return null;
    }
    return { w, d };
}

export function storyCount(floors: Floors | null): 1 | 2 {
    return floors === "1" ? 1 : 2;
}

function round1(n: number): number {
    return Math.round(n * 100) / 100;
}

export function heatEnvelope(input: {
    area: number | null;
    floors: Floors | null;
    dimensions: string | null;
}): ShowcaseHeatCalc {
    const stories = storyCount(input.floors);
    const area =
        input.area && input.area > 0 ? input.area : FAVOR_FOOT * stories;
    const dims = parseDims(input.dimensions);
    const footprint = dims ? dims.w * dims.d : area / stories;
    const perim = dims
        ? 2 * (dims.w + dims.d)
        : 4 * Math.sqrt(Math.max(footprint, 1));
    const wallScale = (perim * stories) / (FAVOR_PERIM * FAVOR_STORIES);
    const footScale = footprint / FAVOR_FOOT;
    return {
        walls: round1(FAVOR_ENVELOPE.walls * wallScale),
        roof: round1(FAVOR_ENVELOPE.roof * footScale),
        floor: round1(FAVOR_ENVELOPE.floor * footScale),
        windows: round1(FAVOR_ENVELOPE.windows * wallScale),
        doors: FAVOR_ENVELOPE.doors,
    };
}

function sleepTitles(count: number): string[] {
    if (count <= 0) return [];
    const names = ["Главная спальня", "Гостевая спальня", "Детская", "Спальня"];
    if (count === 1) return ["Спальня"];
    return Array.from(
        { length: count },
        (_, i) => names[i] ?? `Спальня ${i + 1}`
    );
}

export function roomProgram(input: {
    slug: string;
    bedrooms: number | null;
    bathrooms: number | null;
    floors: Floors | null;
    features: string[];
}): RoomSpec[] {
    const stories = storyCount(input.floors);
    const beds = Math.max(input.bedrooms ?? 0, 0);
    const baths = Math.max(input.bathrooms ?? 1, 1);
    const terrace = input.features.includes("terrace");
    const sleeps = sleepTitles(beds);
    const rooms: RoomSpec[] = [];

    rooms.push({
        id: "f1-kitchen",
        title: "Кухня",
        floor: "1",
        kind: "living",
    });
    rooms.push({
        id: "f1-living",
        title: "Гостиная",
        floor: "1",
        kind: "living",
    });
    if (terrace) {
        rooms.push({
            id: "f1-terrace",
            title: "Терраса",
            floor: "1",
            kind: "other",
        });
    }

    const firstFloorSleeps = stories === 2 && beds >= 4 ? 1 : sleeps.length;
    const f1Sleep = sleeps.slice(0, firstFloorSleeps);
    const f2Sleep = sleeps.slice(firstFloorSleeps);
    f1Sleep.forEach((title, i) => {
        rooms.push({
            id: i === 0 && stories === 1 ? "f1-bed" : `f1-bed${i + 1}`,
            title,
            floor: "1",
            kind: "sleep",
        });
    });

    const f1Baths = stories === 2 ? Math.min(1, baths) : baths;
    const f2Baths = baths - f1Baths;
    for (let i = 0; i < f1Baths; i++) {
        rooms.push({
            id: `f1-bath${i + 1}`,
            title: i === 0 ? "Санузел" : `Санузел ${i + 1}`,
            floor: "1",
            kind: "bath",
        });
    }
    rooms.push({
        id: "f1-hall",
        title: "Холл",
        floor: "1",
        kind: "other",
    });

    if (stories === 2) {
        f2Sleep.forEach((title, i) => {
            rooms.push({
                id: `f2-bed${i + 1}`,
                title,
                floor: "2",
                kind: "sleep",
            });
        });
        for (let i = 0; i < f2Baths; i++) {
            rooms.push({
                id: `f2-bath${i + 1}`,
                title: i === 0 ? "Санузел" : `Санузел ${i + 1}`,
                floor: "2",
                kind: "bath",
            });
        }
        rooms.push({
            id: "f2-hall",
            title: "Холл",
            floor: "2",
            kind: "other",
        });
    }

    return rooms;
}

export function sleepRoomCount(rooms: RoomSpec[]): number {
    return rooms.filter((r) => r.kind === "sleep").length;
}

function xml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

const KIND_FILL: Record<DecorKind, string> = {
    sleep: "#f3eadc",
    bath: "#e4eef4",
    living: "#efe6d6",
    other: "#f6f3ee",
};

export type PlanSvgLayer = PlanLayer | "2d-alt";

export function planSvg(
    rooms: RoomSpec[],
    floor: "1" | "2",
    layer: PlanSvgLayer
): string {
    const cells = rooms.filter((r) => r.floor === floor);
    const n = Math.max(cells.length, 1);
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const W = 900;
    const H = 640;
    const pad = layer === "3d" ? 40 : 28;
    const gap = layer === "walls" ? 0 : 10;
    const cellW = (W - pad * 2 - gap * (cols - 1)) / cols;
    const cellH = (H - pad * 2 - gap * (rows - 1)) / rows;
    const hatch =
        layer === "walls"
            ? `<defs><pattern id="wall-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#b7a48c" stroke-width="3"/></pattern></defs>
  <rect x="${pad - 14}" y="${pad - 14}" width="${W - pad * 2 + 28}" height="${H - pad * 2 + 28}" fill="url(#wall-hatch)" stroke="#2c2c2c" stroke-width="8"/>
  <rect x="${pad - 2}" y="${pad - 2}" width="${W - pad * 2 + 4}" height="${H - pad * 2 + 4}" fill="#fbfaf7"/>`
            : "";
    const rects = cells.map((room, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = pad + col * (cellW + gap);
        const y = pad + row * (cellH + gap);
        const label = `<text x="${x + cellW / 2}" y="${y + cellH / 2}" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-size="${layer === "walls" ? 14 : 18}" fill="#3f3a34">${xml(room.title)}</text>`;
        if (layer === "3d") {
            const sk = 16;
            const top = `${x + sk},${y} ${x + cellW + sk},${y} ${x + cellW},${y + cellH} ${x},${y + cellH}`;
            const side = `${x + cellW + sk},${y} ${x + cellW + sk},${y + 10} ${x + cellW},${y + cellH + 10} ${x + cellW},${y + cellH}`;
            const fill = KIND_FILL[room.kind];
            return `<polygon points="${side}" fill="#c9bba8"/><polygon points="${top}" fill="${fill}" stroke="#6f6558" stroke-width="1.4"/>${label}`;
        }
        if (layer === "walls") {
            return `<rect x="${x + 3}" y="${y + 3}" width="${cellW - 6}" height="${cellH - 6}" fill="#fff" stroke="#2c2c2c" stroke-width="6"/>${label}`;
        }
        const fill = KIND_FILL[room.kind];
        return `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="${fill}" stroke="#8a8174" stroke-width="1.5"/>${label}`;
    });
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#fbfaf7"/>
  ${hatch}
  ${rects.join("\n  ")}
</svg>
`;
}

export function floorAreaSplit(area: number | null, stories: 1 | 2): number[] {
    const total = area && area > 0 ? area : FAVOR_FOOT * stories;
    if (stories === 1) return [total];
    const first = Math.round(total * (103 / 190));
    return [first, total - first];
}

export function planMediaPath(
    slug: string,
    floorIndex: 1 | 2,
    layer: PlanSvgLayer
): string {
    return `/media/detail/${slug}/plan-${floorIndex}-${layer}.svg`;
}

export function altCode(slug: string, salt: number): string {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
        hash = (hash * 33 + slug.charCodeAt(i) + salt) >>> 0;
    }
    return String(1000 + (hash % 9000));
}

export function roomProgramAlt(input: {
    slug: string;
    bedrooms: number | null;
    bathrooms: number | null;
    floors: Floors | null;
    features: string[];
}): RoomSpec[] {
    const rooms = roomProgram(input);
    const sleeps = rooms.filter((r) => r.kind === "sleep");
    const rest = rooms.filter((r) => r.kind !== "sleep");
    if (sleeps.length < 2) return [...rooms].reverse();
    return [...rest, sleeps[sleeps.length - 1], ...sleeps.slice(0, -1)];
}

export function isAllowedMediaUrl(url: string): boolean {
    if (url.startsWith("/media/")) return true;
    try {
        const host = new URL(url).hostname;
        return host === "ncottage.ru" || host === "www.ncottage.ru";
    } catch {
        return false;
    }
}

function techLabel(techs: string[]): string {
    return formatTechnologyBrand(techs[0] ?? null);
}

function displayNameOf(input: SerialShowcaseInput): string {
    const multi = input.technologies.length > 1;
    const base = multi
        ? stripTechFromName(input.name) || input.name
        : input.name;
    return humanizeDisplayName(base, input.dimensions, input.area);
}

function dimPhrase(dimensions: string | null): string {
    if (!dimensions) return "";
    return dimensions.replace(/[xх]/gi, "×");
}

export function serialCopy(input: SerialShowcaseInput): {
    lead: string;
    about: ShowcaseAboutBlock[];
    mosaic: { about: string; interior: string; layout: string };
} {
    const name = displayNameOf(input);
    const dim = dimPhrase(input.dimensions);
    const area = input.area && input.area > 0 ? input.area : null;
    const beds = input.bedrooms ?? 0;
    const baths = input.bathrooms ?? 0;
    const tech = techLabel(input.technologies);
    const line = projectLine(input.slug);
    const stories = storyCount(input.floors);
    const terrace = input.features.includes("terrace");
    const size = [dim ? `${dim}` : null, area ? `${area} м²` : null]
        .filter(Boolean)
        .join(" на ");
    const bedBit = beds > 0 ? `${beds} ${bedroomsWord(beds)}` : "жилые комнаты";
    const bathBit = baths > 0 ? `${baths} ${bathroomsWord(baths)}` : null;
    const lead = [
        size ? `${name} ${size}.` : `${name}.`,
        `${tech}${terrace ? ", терраса" : ""}, смета в договоре.`,
    ].join(" ");

    const about: ShowcaseAboutBlock[] = [
        {
            title: "О проекте",
            text: [
                `${name} - серийный дом${size ? ` ${size}` : ""}.`,
                `${bedBit}${bathBit ? `, ${bathBit}` : ""}.`,
                `Строим из материала: ${tech}.`,
                LINE_LEAD[line],
                "Смета фиксируется в договоре, цена «от» - дом под ключ.",
            ].join(" "),
        },
        {
            title: "Планировка",
            text: [
                stories === 1
                    ? "Один этаж: общая зона и спальни на одном уровне."
                    : "Первый этаж - общая зона. Второй - спальни.",
                terrace ? "Выход на террасу из общей комнаты." : null,
                dim ? `Габариты ${dim}.` : null,
                area ? `${area} м².` : null,
                "Стены можно сдвинуть под участок, это не ломает серию.",
            ]
                .filter(Boolean)
                .join(" "),
        },
    ];

    const mosaic = {
        about: [
            `${name} - серийный дом${size ? ` ${size}` : ""}.`,
            beds > 0
                ? `${beds} ${bedroomsWord(beds)}${terrace ? ", терраса" : ""}.`
                : null,
            `Строим из материала: ${tech}.`,
            "Смета фиксируется в договоре, цена «от» - дом под ключ.",
        ]
            .filter(Boolean)
            .join(" "),
        interior: [
            stories === 2
                ? "На первом кухня-гостиная: стол, мягкая зона" +
                  (terrace ? " и выход на террасу." : ".")
                : "Кухня-гостиная собрана в одну зону" +
                  (terrace ? ", выход на террасу." : "."),
            terrace || stories === 2
                ? "Свет с двух сторон, мокрые зоны спрятаны от общей комнаты."
                : "Спальни рядом, мокрые зоны в одном контуре.",
            stories === 2
                ? `На втором - ${Math.max(beds - 1, 1)} ${bedroomsWord(Math.max(beds - 1, 1))} без узкого коридора.`
                : null,
        ]
            .filter(Boolean)
            .join(" "),
        layout: [
            dim ? `Контур ${dim} м.` : null,
            stories === 2
                ? "Первый - общая зона и одна спальня. Второй - спальни и санузел."
                : "Все комнаты на одном уровне.",
            "Стены можно сдвинуть под участок, это не ломает серию.",
        ]
            .filter(Boolean)
            .join(" "),
    };

    return { lead, about, mosaic };
}

function facadesFrom(
    images: NonNullable<SerialLocalImages["facades"]>
): ShowcaseFacade[] {
    return [
        {
            id: "front",
            label: "Передний",
            src: images.front,
            sectionSrc: images.sectionLong,
        },
        {
            id: "back",
            label: "Задний",
            src: images.back,
            sectionSrc: images.sectionLong,
        },
        {
            id: "left",
            label: "Левый боковой",
            src: images.left,
            sectionSrc: images.sectionCross,
        },
        {
            id: "right",
            label: "Правый боковой",
            src: images.right,
            sectionSrc: images.sectionCross,
        },
    ];
}

export function buildSerialPage(
    input: SerialShowcaseInput,
    images: SerialLocalImages = {}
): SerialShowcasePage {
    const rooms = roomProgram(input);
    const stories = storyCount(input.floors);
    const areas = floorAreaSplit(input.area, stories);
    const copy = serialCopy(input);
    const localHeroes = (images.heroes ?? []).filter((url) =>
        isAllowedMediaUrl(url)
    );
    const gallery = localHeroes.length
        ? localHeroes
        : input.renders.filter((url) => isAllowedMediaUrl(url));
    const hero = gallery[0] ?? "";
    const roomImages = images.rooms ?? {};
    const decor: ShowcaseDecorItem[] = rooms.flatMap((room) => {
        const src = roomImages[room.id];
        if (!src) return [];
        return [
            {
                id: room.id,
                title: room.title,
                floor: room.floor,
                src,
            },
        ];
    });
    const interiorSrc =
        images.mosaicInterior ??
        roomImages["f1-living"] ??
        roomImages["f1-kitchen"] ??
        decor.find((d) => d.floor === "1")?.src;
    const sleepId = rooms.find(
        (r) => r.kind === "sleep" && roomImages[r.id]
    )?.id;
    const layoutSrc =
        images.mosaicLayout ??
        (sleepId ? roomImages[sleepId] : undefined) ??
        interiorSrc;

    const mosaic: ShowcaseMosaic | undefined =
        hero && interiorSrc && layoutSrc
            ? {
                  about: {
                      title: "О проекте",
                      text: copy.mosaic.about,
                      image: hero,
                  },
                  interior: {
                      title: "Интерьер и свет",
                      text: copy.mosaic.interior,
                      image: interiorSrc,
                  },
                  layout: {
                      title: "Планировка",
                      text: copy.mosaic.layout,
                      image: layoutSrc,
                  },
              }
            : undefined;

    const plans: ProjectFloorPlan[] = [];
    for (let i = 0; i < stories; i++) {
        const floorIndex = (i + 1) as 1 | 2;
        const floorLabel = floorIndex === 1 ? "1 этаж" : "2 этаж";
        const area = areas[i];
        plans.push({
            floor: floorLabel,
            layer: "2d",
            area,
            url: planMediaPath(input.slug, floorIndex, "2d"),
        });
        plans.push({
            floor: floorLabel,
            layer: "3d",
            area,
            url: planMediaPath(input.slug, floorIndex, "3d"),
        });
        plans.push({
            floor: floorLabel,
            layer: "walls",
            area,
            url: planMediaPath(input.slug, floorIndex, "walls"),
        });
    }

    const priceHike: ShowcasePriceHike | undefined =
        input.priceFrom && input.priceFrom > 0
            ? {
                  from: "2026-10-01",
                  next: Math.round(input.priceFrom * 1.08),
              }
            : undefined;

    const name = displayNameOf(input);
    const areaLabel = input.area && input.area > 0 ? `${input.area}м²` : "";
    const altArea = input.area && input.area > 40 ? input.area - 5 : input.area;
    const title = [name, areaLabel].filter(Boolean).join(", ");
    const altTitle = [name, altArea ? `${altArea}м²` : ""]
        .filter(Boolean)
        .join(", ");
    const twoD = plans.filter((p) => p.layer === "2d").map((p) => p.url);
    const threeD = plans.filter((p) => p.layer === "3d").map((p) => p.url);
    const altUrls = [];
    for (let i = 0; i < stories; i++) {
        altUrls.push(planMediaPath(input.slug, (i + 1) as 1 | 2, "2d-alt"));
    }
    const facadeList = images.facades ? facadesFrom(images.facades) : [];
    const customerAlts: ShowcaseCustomerAlts = {
        plans: [
            {
                code: altCode(input.slug, 1),
                title,
                status: "built",
                images: twoD,
            },
            {
                code: altCode(input.slug, 2),
                title,
                status: "built",
                images: threeD,
            },
            {
                code: altCode(input.slug, 3),
                title: altTitle,
                status: "building",
                images: altUrls,
            },
        ],
        facades: facadeList.length
            ? [
                  {
                      code: altCode(input.slug, 4),
                      title,
                      status: "built",
                      images: facadeList.map((f) => f.src),
                  },
              ]
            : [],
        timelapses: images.videos?.timelapse
            ? [
                  {
                      code: altCode(input.slug, 1),
                      title,
                      status: "built",
                      poster: images.videos.timelapse.poster,
                      src: images.videos.timelapse.src,
                  },
              ]
            : [],
    };

    const videos: ShowcasePayload["videos"] = [];
    if (images.videos?.timelapse) {
        videos.push({
            kind: "timelapse",
            poster: images.videos.timelapse.poster,
            src: images.videos.timelapse.src,
        });
    }
    if (images.videos?.review) {
        videos.push({
            kind: "review",
            poster: images.videos.review.poster,
            src: images.videos.review.src,
        });
    }

    return {
        class: "serial",
        lead: copy.lead,
        about: copy.about,
        mosaic,
        gallery,
        plans,
        facades: facadeList,
        decor: decor.length ? decor : undefined,
        story: null,
        videos,
        priceHike,
        heatCalc: heatEnvelope(input),
        customerAlts,
    };
}

export function packageFloorPrice(v: {
    priceFrom: number;
    priceLow: number;
    packages: Array<{ price: number }>;
}): number | null {
    const fromPackages = v.packages
        .map((pkg) => pkg.price)
        .filter((n): n is number => Number.isFinite(n) && n > 0);
    if (fromPackages.length > 0) return Math.min(...fromPackages);
    if (Number.isFinite(v.priceLow) && v.priceLow > 0) return v.priceLow;
    if (Number.isFinite(v.priceFrom) && v.priceFrom > 0) return v.priceFrom;
    return null;
}

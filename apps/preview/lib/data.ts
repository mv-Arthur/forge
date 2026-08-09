import projectsJson from "@/data/fixtures/projects.normalized.json";
import objectsJson from "@/data/fixtures/built-objects.normalized.json";
import extrasJson from "@/data/fixtures/built-objects.extras.json";
import type {
    BuiltObject,
    EnrichedBuiltObject,
    MergedProject,
    RawProject,
    Technology,
} from "./types";
import { settings } from "./settings";

const rawProjects: RawProject[] = projectsJson as RawProject[];
const rawObjects: BuiltObject[] = objectsJson as BuiltObject[];

type ObjectExtra = {
    area?: number | null;
    floors?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    kitchen?: number | null;
    term?: string | null;
    sauna?: string | null;
    garage?: string | null;
    metaDescription?: string | null;
};

const objectExtras = extrasJson as Record<string, ObjectExtra>;

const TECH_ORDER: Technology[] = [
    "gas_concrete",
    "brick",
    "frame",
    "sip",
    "fachwerk",
];

const LOCATION_LABELS: Record<string, string> = {
    Yukki: "Юкки",
    Kiskelovo: "Кискелово",
    Istinka: "Истинка",
    "Lodejnoe Pole": "Лодейное Поле",
    Toksovo: "Токсово",
    Solnechnoe: "Солнечное",
    "Petergofskie Dachi": "Петергофские дачи",
    Pervomaiskoe: "Первомайское",
    Vartemyagi: "Вартемяги",
    Kommunar: "Коммунар",
    Pogi: "Поги",
    "Mistolovo Po Proektu Bavariya": "Мистолово",
    "Starye Nizkoviczy": "Старые Низковицы",
    Annino: "Аннино",
    Kabaczkoe: "Кабацкое",
    "Severnaya Zhemchuzhina": "Северная жемчужина",
    "Sertolovo Snt Modul": "Сертолово",
    Ladoga: "Ладога",
    Romashkovo: "Ромашково",
};

function pickBetterName(a: string, b: string): string {
    const stripped = (name: string) =>
        name
            .replace(/^каркасный\s+/i, "")
            .replace(/^газобетонный\s+/i, "")
            .replace(/^кирпичный\s+/i, "")
            .replace(/^сип-?/i, "")
            .replace(/^фахверковый\s+/i, "")
            .replace(/^дом\s+/i, "")
            .trim();
    const sa = stripped(a);
    const sb = stripped(b);
    if (sa.length < a.length && sa.length > 0) return sa;
    if (sb.length < b.length && sb.length > 0) return sb;
    return a.length <= b.length ? a : b;
}

function mergeProjects(list: RawProject[]): RawProject[] {
    const bySlug = new Map<string, RawProject>();
    for (const p of list) {
        const existing = bySlug.get(p.slug);
        if (!existing) {
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
        const mergedTechs = Array.from(
            new Set([...existing.technologies, ...p.technologies]),
        );
        const mergedCategories = Array.from(
            new Set([...existing.categories, ...p.categories]),
        );
        const mergedFeatures = Array.from(
            new Set([...existing.features, ...p.features]),
        );
        const seenVariantKey = new Set(
            existing.variants.map((v) => v.technology),
        );
        const mergedVariants = [...existing.variants];
        for (const v of p.variants) {
            if (seenVariantKey.has(v.technology)) continue;
            seenVariantKey.add(v.technology);
            mergedVariants.push(v);
        }
        const richerRenders =
            existing.renders.length >= p.renders.length
                ? existing.renders
                : p.renders;
        const richerPlans =
            existing.floorPlans.length >= p.floorPlans.length
                ? existing.floorPlans
                : p.floorPlans;

        bySlug.set(p.slug, {
            ...existing,
            name: pickBetterName(existing.name, p.name),
            technologies: mergedTechs,
            categories: mergedCategories,
            features: mergedFeatures,
            renders: richerRenders,
            floorPlans: richerPlans,
            variants: mergedVariants,
            area: existing.area ?? p.area,
            bedrooms: existing.bedrooms ?? p.bedrooms,
            bathrooms: existing.bathrooms ?? p.bathrooms,
            floors: existing.floors ?? p.floors,
            dimensions: existing.dimensions ?? p.dimensions,
            description:
                (existing.description?.length ?? 0) >=
                (p.description?.length ?? 0)
                    ? existing.description
                    : p.description,
        });
    }
    return Array.from(bySlug.values()).map((p) => {
        p.variants.sort(
            (a, b) =>
                TECH_ORDER.indexOf(a.technology) -
                TECH_ORDER.indexOf(b.technology),
        );
        return p;
    });
}

function buildSubtitle(project: RawProject): string {
    const bits: string[] = [];
    if (project.floors === "1") bits.push("Одноэтажный");
    else if (project.floors === "2") bits.push("Двухэтажный");
    else if (project.floors === "1.5") bits.push("Полутораэтажный");
    else if (project.floors === "mansard") bits.push("С мансардой");

    const tech = project.technologies[0];
    if (tech === "gas_concrete") bits.push("дом из газобетона");
    else if (tech === "brick") bits.push("дом из кирпича");
    else if (tech === "frame") bits.push("каркасный дом");
    else if (tech === "sip") bits.push("дом из СИП-панелей");
    else if (tech === "fachwerk") bits.push("фахверковый дом");
    else bits.push("дом");

    return bits.join(" ").toLowerCase().replace(/^./, (c) => c.toUpperCase());
}

/**
 * «От» в фикстурах часто занижен (~×0.77 от базового пакета).
 * Цена «под ключ от» = минимум по пакетам (обычно «Базовая»).
 */
function packageFloorPrice(v: {
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

function enrichProjects(list: RawProject[]): MergedProject[] {
    return list.map((p) => {
        const variants = p.variants.map((v) => {
            const floor = packageFloorPrice(v);
            return {
                ...v,
                priceFrom: floor ?? v.priceFrom,
            };
        });
        const prices = variants
            .map((v) => packageFloorPrice(v) ?? v.priceFrom)
            .filter((n): n is number => Number.isFinite(n) && n > 0);
        const priceFrom = prices.length > 0 ? Math.min(...prices) : null;
        const mortgages = variants
            .map((v) => v.mortgageFrom)
            .filter((n): n is number => Number.isFinite(n as number) && (n as number) > 0);
        const mortgageFrom =
            mortgages.length > 0 ? Math.min(...mortgages) : null;

        return {
            ...p,
            variants,
            displayName: p.name,
            subtitle: buildSubtitle(p),
            priceFrom,
            mortgageFrom,
            heroImage: p.renders[0] ?? "",
            hasTerrace: p.features.includes("terrace"),
            warranty: settings.warrantyYears,
        };
    });
}

const projects: MergedProject[] = enrichProjects(mergeProjects(rawProjects));
const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

function beautifyTitle(
    title: string,
    status: "built" | "in-progress",
): string {
    let t = title.replace(/^СТРОИТСЯ\s*-\s*/i, "").trim();
    if (!t) return status === "in-progress" ? "Строящийся дом" : "Построенный дом";
    const lower = t.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function locationLabelFor(location: string | null): string | null {
    if (!location) return null;
    return LOCATION_LABELS[location] ?? location.replace(/[-_]/g, " ");
}

function enrichObjects(list: BuiltObject[]): EnrichedBuiltObject[] {
    return list.map((o) => {
        const extra = objectExtras[o.slug] ?? {};
        const displayTitle = beautifyTitle(o.title, o.status);
        const location = o.location;
        const locationLabel = locationLabelFor(location);

        const area =
            typeof extra.area === "number" && extra.area > 0
                ? Math.round(extra.area)
                : null;
        const bedrooms =
            typeof extra.bedrooms === "number" && extra.bedrooms > 0
                ? extra.bedrooms
                : null;
        const bathrooms =
            typeof extra.bathrooms === "number" && extra.bathrooms > 0
                ? extra.bathrooms
                : null;
        const kitchenArea =
            typeof extra.kitchen === "number" && extra.kitchen > 0
                ? extra.kitchen
                : null;

        const hasSauna = Boolean(extra.sauna);
        const hasGarage = Boolean(extra.garage);
        const hasTerrace = false;

        return {
            ...o,
            location,
            displayTitle,
            heroImage: o.gallery[0] ?? null,
            locationLabel,
            area,
            bedrooms,
            bathrooms,
            kitchenArea,
            hasTerrace,
            hasSauna,
            hasGarage,
            buildTermLabel: extra.term ?? null,
            metaDescription: extra.metaDescription ?? null,
        };
    });
}

const objects: EnrichedBuiltObject[] = enrichObjects(rawObjects);

export function getAllProjects(): MergedProject[] {
    return projects;
}

export function getProject(slug: string): MergedProject | undefined {
    return projectBySlug.get(slug);
}

export function getAllObjects(): EnrichedBuiltObject[] {
    return objects;
}

export function getObject(slug: string): EnrichedBuiltObject | undefined {
    return objects.find((o) => o.slug === slug);
}

export function getObjectsForProject(
    _projectSlug: string,
): EnrichedBuiltObject[] {
    return [];
}

export function getSimilarProjects(
    slug: string,
    limit = 12,
): MergedProject[] {
    const base = getProject(slug);
    if (!base) return [];
    return projects
        .filter((p) => p.slug !== slug)
        .map((p) => {
            let score = 0;
            const areaDelta = Math.abs((p.area ?? 0) - (base.area ?? 0));
            score -= areaDelta;
            if (p.bedrooms === base.bedrooms) score += 40;
            if (p.floors === base.floors) score += 25;
            if (p.technologies.some((t) => base.technologies.includes(t)))
                score += 20;
            return { p, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((x) => x.p);
}

export function matchAreaBucket(bucket: string, area: number): boolean {
    switch (bucket) {
        case "lt120":
            return area > 0 && area < 120;
        case "120-180":
            return area >= 120 && area <= 180;
        case "180-250":
            return area > 180 && area <= 250;
        case "250-350":
            return area > 250 && area <= 350;
        case "gt350":
            return area > 350;
        default:
            return true;
    }
}

export function matchBudgetBucket(bucket: string, price: number): boolean {
    if (!price) return false;
    switch (bucket) {
        case "lt5":
            return price < 5_000_000;
        case "5-8":
            return price >= 5_000_000 && price <= 8_000_000;
        case "8-12":
            return price > 8_000_000 && price <= 12_000_000;
        case "12-20":
            return price > 12_000_000 && price <= 20_000_000;
        case "gt20":
            return price > 20_000_000;
        default:
            return true;
    }
}

export function getTechnologiesInCatalog(): Technology[] {
    const set = new Set<Technology>();
    for (const p of projects) {
        for (const t of p.technologies) set.add(t);
    }
    return TECH_ORDER.filter((t) => set.has(t));
}

export function getCatalogStats() {
    const prices = projects
        .map((p) => p.priceFrom)
        .filter((n): n is number => n != null && n > 0);
    const areas = projects.map((p) => p.area ?? 0).filter((n) => n > 0);
    return {
        total: projects.length,
        minPrice: prices.length ? Math.min(...prices) : 0,
        maxPrice: prices.length ? Math.max(...prices) : 0,
        maxArea: areas.length ? Math.max(...areas) : 0,
        minArea: areas.length ? Math.min(...areas) : 0,
    };
}

import projectsJson from "@legacy-data/projects.normalized.json";
import objectsJson from "@legacy-data/built-objects.normalized.json";
import extrasJson from "@legacy-data/built-objects.extras.json";
import showcaseJson from "@data/fixtures/detail-showcase.json";
import type {
    BuiltObject,
    CatalogHubPayload,
    CatalogHubTechCard,
    CatalogHubTypeCard,
    CatalogNavPayload,
    EnrichedBuiltObject,
    MergedProject,
    ProjectClass,
    RawProject,
    ShowcasePayload,
    Technology,
} from "@/types/catalog";
import { settings } from "@/lib/settings";
import {
    HUB_CHOOSE,
    HUB_HEADING,
    HUB_INDIVIDUAL_LEAD,
    HUB_INDIVIDUAL_TITLE,
    HUB_LEAD,
    HUB_MORE_TITLE,
    HUB_SERIAL_LEAD,
    HUB_SERIAL_TITLE,
    HUB_TECH_LEAD,
    HUB_TECH_TITLE,
    HUB_TECHS_HEADING,
    HUB_WATCH,
    CATALOG_BATH_TILE,
    POPULAR_ALL,
} from "@/lib/copy";
import {
    buildSubtitle,
    hasUsablePhoto,
    humanizeDisplayName,
    humanObjectTitle,
    inferLocationFromTitle,
    pickBetterName,
    stripTechFromName,
} from "@/lib/names";
import { projectClass, projectIsIndividual } from "@/lib/catalogFilter";

type ShowcaseFile = {
    filledSlugs: string[];
    pages: Record<
        string,
        {
            class: ProjectClass;
            lead: string;
            about: ShowcasePayload["about"];
            gallery: string[];
            plans: ShowcasePayload["plans"];
            facades: ShowcasePayload["facades"];
            decor?: ShowcasePayload["decor"];
            story: ShowcasePayload["story"];
            priceHike?: ShowcasePayload["priceHike"];
        }
    >;
};

const showcaseFile = showcaseJson as ShowcaseFile;
const FILLED_SLUGS = new Set(showcaseFile.filledSlugs);

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

const HERO_OVERRIDES: Record<string, string> = {
    reyn: "/media/projects/reyn.jpg",
    arkada: "/media/projects/arkada.jpg",
    favor: "/media/projects/favor.jpg",
    kasl: "/media/projects/kasl.jpg",
};

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
            new Set([...existing.technologies, ...p.technologies])
        );
        const mergedCategories = Array.from(
            new Set([...existing.categories, ...p.categories])
        );
        const mergedFeatures = Array.from(
            new Set([...existing.features, ...p.features])
        );
        const seenVariantKey = new Set(
            existing.variants.map((v) => v.technology)
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
                TECH_ORDER.indexOf(b.technology)
        );
        return p;
    });
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
            .filter(
                (n): n is number =>
                    Number.isFinite(n as number) && (n as number) > 0
            );
        const mortgageFrom =
            mortgages.length > 0 ? Math.min(...mortgages) : null;

        const multiTech = variants.length > 1;
        const baseName = multiTech
            ? stripTechFromName(p.name) || p.name
            : p.name;
        const heroOverride = HERO_OVERRIDES[p.slug];
        const renders = heroOverride
            ? [heroOverride, ...p.renders.filter((src) => src !== heroOverride)]
            : p.renders;
        return {
            ...p,
            variants,
            renders,
            displayName: humanizeDisplayName(baseName, p.dimensions, p.area),
            subtitle: buildSubtitle(p),
            priceFrom,
            mortgageFrom,
            heroImage: renders[0] ?? "",
            hasTerrace: p.features.includes("terrace"),
            hasWardrobe: p.categories.includes("doma-s-garderobnoj"),
            warranty: settings.warrantyYears,
            technologies:
                variants.length > 0
                    ? variants.map((v) => v.technology)
                    : p.technologies,
            projectClass: projectIsIndividual(p) ? "individual" : "serial",
            detailFilled: false,
        };
    });
}

function applyShowcase(list: MergedProject[]): MergedProject[] {
    return list.map((p) => {
        const page = showcaseFile.pages[p.slug];
        const projectClass: ProjectClass =
            page?.class ?? (projectIsIndividual(p) ? "individual" : "serial");
        const gallery = page?.gallery?.length ? page.gallery : p.renders;
        const floorPlans = page?.plans?.length ? page.plans : p.floorPlans;
        return {
            ...p,
            projectClass,
            detailFilled: FILLED_SLUGS.has(p.slug),
            renders: gallery,
            floorPlans,
            heroImage: gallery[0] ?? p.heroImage,
        };
    });
}

function injectBath(list: MergedProject[]): MergedProject[] {
    if (list.some((p) => p.slug === "banya-levashovo")) return list;
    const page = showcaseFile.pages["banya-levashovo"];
    const raw: RawProject = {
        slug: "banya-levashovo",
        name: "Баня в Левашово",
        dimensions: "6х8",
        area: 45,
        bedrooms: null,
        bathrooms: 2,
        floors: "1",
        categories: [],
        technologies: ["sip"],
        features: ["terrace"],
        description: null,
        renders: page?.gallery ?? [],
        floorPlans: page?.plans ?? [],
        variants: [
            {
                technology: "sip",
                slug: "banya-levashovo",
                priceFrom: 0,
                priceLow: 0,
                priceHigh: 0,
                offerCount: 0,
                packages: [],
                mortgageFrom: null,
                category: "",
                url: "",
            },
        ],
    };
    const [bath] = applyShowcase(enrichProjects([raw]));
    return bath ? [...list, bath] : list;
}

const projects: MergedProject[] = injectBath(
    applyShowcase(enrichProjects(mergeProjects(rawProjects))),
);
const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

export function getShowcase(slug: string): ShowcasePayload | null {
    if (!FILLED_SLUGS.has(slug)) return null;
    const page = showcaseFile.pages[slug];
    if (!page) return null;
    return {
        lead: page.lead,
        about: page.about,
        plans: page.plans,
        facades: page.facades,
        decor: page.decor ?? [],
        story: page.story,
        gallery: page.gallery,
        priceHike: page.priceHike ?? null,
    };
}

function locationLabelFor(location: string | null): string | null {
    if (!location) return null;
    return LOCATION_LABELS[location] ?? location.replace(/[-_]/g, " ");
}

function enrichObjects(list: BuiltObject[]): EnrichedBuiltObject[] {
    return list.map((o) => {
        const extra = objectExtras[o.slug] ?? {};
        const location = o.location;
        const locationLabel =
            locationLabelFor(location) ?? inferLocationFromTitle(o.title);
        const displayTitle = humanObjectTitle(o.title, locationLabel, o.status);

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

export function getCatalogProjects(): MergedProject[] {
    return projects.filter((p) => hasUsablePhoto(p.heroImage || p.renders[0]));
}

export function getListedObjects(): EnrichedBuiltObject[] {
    return objects.filter((o) => hasUsablePhoto(o.heroImage || o.gallery[0]));
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

/**
 * Built objects related for UI on project detail (GWD photogallery on page).
 * Fixtures have no design FK: match by shared technology, prefer rich galleries.
 * Callers must not claim “built from this project” without FK — label as material match.
 */
export function getRelatedBuiltObjects(
    projectSlug: string,
    limit = 6
): EnrichedBuiltObject[] {
    const base = getProject(projectSlug);
    if (!base) return [];
    const techs = new Set(base.technologies);
    return objects
        .filter((o) => o.gallery.length > 0)
        .map((o) => {
            let score = o.gallery.length;
            if (o.technology && techs.has(o.technology)) score += 100;
            if (o.status === "built") score += 10;
            if (
                base.area != null &&
                o.area != null &&
                Math.abs(o.area - base.area) < 40
            )
                score += 15;
            return { o, score };
        })
        .filter((x) => x.score >= 100)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((x) => x.o);
}

export function getSimilarProjects(slug: string, limit = 12): MergedProject[] {
    const base = getProject(slug);
    if (!base) return [];
    return projects
        .filter(
            (p) => p.slug !== slug && p.projectClass === base.projectClass,
        )
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

export function getTechnologiesInCatalog(): Technology[] {
    const set = new Set<Technology>();
    for (const p of projects) {
        for (const t of p.technologies) set.add(t);
    }
    return TECH_ORDER.filter((t) => set.has(t));
}

export function getCatalogStats() {
    const list = getCatalogProjects();
    const prices = list
        .map((p) => p.priceFrom)
        .filter((n): n is number => n != null && n > 0);
    const areas = list.map((p) => p.area ?? 0).filter((n) => n > 0);
    return {
        total: list.length,
        minPrice: prices.length ? Math.min(...prices) : 0,
        maxPrice: prices.length ? Math.max(...prices) : 0,
        maxArea: areas.length ? Math.max(...areas) : 0,
        minArea: areas.length ? Math.min(...areas) : 0,
    };
}

function uniquePhotos(urls: Array<string | null | undefined>, take: number) {
    const out: string[] = [];
    const seen = new Set<string>();
    for (const url of urls) {
        if (!hasUsablePhoto(url) || seen.has(url)) continue;
        seen.add(url);
        out.push(url);
        if (out.length >= take) break;
    }
    return out;
}

export function getCatalogHub(): CatalogHubPayload {
    const listed = getCatalogProjects();
    const original = listed.filter(projectIsIndividual);

    const types: CatalogHubTypeCard[] = [];
    const serialImage = listed[0]?.heroImage;
    if (hasUsablePhoto(serialImage)) {
        types.push({
            kind: "serial",
            title: HUB_SERIAL_TITLE,
            description: HUB_SERIAL_LEAD,
            href: "/projects?kind=serial",
            ctaLabel: HUB_WATCH,
            image: serialImage,
        });
    }
    if (original.length > 0) {
        types.push({
            kind: "individual",
            title: HUB_INDIVIDUAL_TITLE,
            description: HUB_INDIVIDUAL_LEAD,
            href: "/projects?kind=individual",
            ctaLabel: HUB_WATCH,
            image: "/media/catalog/individual.jpg",
        });
    }

    const allTechs: CatalogHubTechCard[] = [];
    const usedHeroes = new Set<string>();
    for (const tech of TECH_ORDER) {
        const ofTech = listed.filter((p) => p.technologies.includes(tech));
        const photos = uniquePhotos(
            ofTech.map((p) => p.heroImage || p.renders[0]),
            24
        );
        if (photos.length === 0) continue;
        const unused = photos.filter((url) => !usedHeroes.has(url));
        const image = unused[0] ?? photos[0];
        usedHeroes.add(image);
        allTechs.push({
            tech,
            title: HUB_TECH_TITLE[tech],
            description: HUB_TECH_LEAD[tech],
            href: `/projects?tech=${tech}`,
            image,
            thumbs: photos.filter((url) => url !== image).slice(0, 3),
            count: ofTech.length,
        });
    }

    const techs = allTechs.slice(0, 4);
    const moreItems = allTechs.slice(4);

    return {
        heading: HUB_HEADING,
        lead: HUB_LEAD,
        chooseHref: "/projects",
        chooseLabel: HUB_CHOOSE,
        techsHeading: HUB_TECHS_HEADING,
        types,
        techs,
        more:
            moreItems.length > 0
                ? { title: HUB_MORE_TITLE, items: moreItems }
                : null,
    };
}

function navHero(
    listed: MergedProject[],
    test: (p: MergedProject) => boolean,
): string {
    const filled = listed.find(
        (p) => p.detailFilled && test(p) && hasUsablePhoto(p.heroImage),
    );
    if (filled) return filled.heroImage;
    const any = listed.find((p) => test(p) && hasUsablePhoto(p.heroImage));
    return any?.heroImage ?? "";
}

export function getCatalogNav(): CatalogNavPayload {
    const listed = getCatalogProjects();
    const serialImage = navHero(listed, (p) => projectClass(p) === "serial");
    const individualImage = navHero(
        listed,
        (p) => projectClass(p) === "individual",
    );
    const bathImage = navHero(listed, (p) => projectClass(p) === "bath");
    const types = [
        {
            id: "serial",
            title: HUB_SERIAL_TITLE,
            href: "/projects?kind=serial",
            image: serialImage || undefined,
        },
        {
            id: "individual",
            title: HUB_INDIVIDUAL_TITLE,
            href: "/projects?kind=individual",
            image: individualImage || undefined,
        },
    ];
    const tileTechs: Technology[] = ["gas_concrete", "brick", "frame"];
    const tiles = [
        ...tileTechs.flatMap((tech) => {
            const image = navHero(listed, (p) =>
                p.technologies.includes(tech),
            );
            if (!image) return [];
            return [
                {
                    id: tech,
                    title: HUB_TECH_TITLE[tech],
                    href: `/projects?tech=${tech}`,
                    image,
                },
            ];
        }),
        ...(bathImage
            ? [
                  {
                      id: "bath",
                      title: CATALOG_BATH_TILE,
                      href: "/projects?kind=bath",
                      image: bathImage,
                  },
              ]
            : []),
    ];
    return {
        all: {
            id: "all",
            title: POPULAR_ALL,
            href: "/projects",
        },
        types,
        tiles,
        ctaLabel: HUB_WATCH,
    };
}

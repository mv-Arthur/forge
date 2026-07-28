import projectsJson from "@/fixtures/projects.normalized.json";
import objectsJson from "@/fixtures/built-objects.normalized.json";
import extrasJson from "@/fixtures/built-objects.extras.json";
import type {
    BuiltMilestone,
    BuiltObject,
    EnrichedBuiltObject,
    MergedProject,
    PurposeType,
    RawProject,
    RoomSpec,
    Style,
    Technology,
} from "./types";

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

const STYLES: Style[] = [
    "scandinavian",
    "modern",
    "classic",
    "loft",
    "barn",
    "european",
    "provance",
];

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

function simpleHash(s: string): number {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = (h * 16777619) >>> 0;
    }
    return h >>> 0;
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

function buildCode(slug: string, hash: number): string {
    const letters = ["СП", "КД", "СВ", "ТК", "НД", "АД", "БП", "СК"];
    return `${letters[hash % letters.length]}-${(hash % 90) + 10}`;
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

function pickStyle(slug: string, hash: number): Style {
    if (/skandik|scandi|finskie/i.test(slug)) return "scandinavian";
    if (/loft|hi-tech/i.test(slug)) return "loft";
    if (/barn/i.test(slug)) return "barn";
    if (/prov/i.test(slug)) return "provance";
    if (/klass|classic/i.test(slug)) return "classic";
    return STYLES[hash % STYLES.length];
}

function pickPurpose(project: RawProject): PurposeType {
    const a = project.area ?? 150;
    if (a < 90) return "seasonal";
    if (a < 130) return "seasonal";
    return "permanent";
}

function generateRooms(project: RawProject, hash: number): RoomSpec[] {
    const area = project.area ?? 150;
    const bedrooms = project.bedrooms ?? 3;
    const bathrooms = project.bathrooms ?? 2;
    const floors = project.floors ?? "1";
    const isMulti = floors === "2" || floors === "1.5" || floors === "mansard";
    const rooms: RoomSpec[] = [];

    const kitchenArea = Math.max(22, Math.round(area * 0.18));
    rooms.push({ name: "Кухня-гостиная", area: kitchenArea, floor: 1 });

    const hallArea = Math.max(6, Math.round(area * 0.05));
    rooms.push({ name: "Прихожая", area: hallArea, floor: 1 });

    const bedroomSizes = [16, 14, 13, 12, 11, 10];
    const bathroomSizes = [5, 4, 3];

    for (let i = 0; i < bedrooms; i++) {
        const floor = isMulti && i > 0 ? 2 : 1;
        const name = i === 0 ? "Спальня хозяев" : `Спальня ${i + 1}`;
        const size = bedroomSizes[Math.min(i, bedroomSizes.length - 1)];
        rooms.push({ name, area: size, floor });
    }

    for (let i = 0; i < bathrooms; i++) {
        const floor = isMulti && i > 0 ? 2 : 1;
        const name = i === 0 ? "Санузел" : `Санузел ${i + 1}`;
        rooms.push({
            name,
            area: bathroomSizes[Math.min(i, bathroomSizes.length - 1)],
            floor,
        });
    }

    if (project.features.includes("terrace")) {
        rooms.push({
            name: "Терраса",
            area: Math.max(10, Math.round(area * 0.08)),
            floor: 1,
        });
    }

    if (isMulti && (hash & 1) === 1) {
        rooms.push({ name: "Гардеробная", area: 5, floor: 2 });
    }
    if (bedrooms >= 4) {
        rooms.push({ name: "Постирочная", area: 4, floor: 1 });
    }

    return rooms;
}

/**
 * «От» в фикстурах часто занижен (~×0.77 от базового пакета).
 * Цена «под ключ от» = минимум по пакетам (обычно «Базовая»).
 */
function packageFloorPrice(v: {
    priceFrom: number;
    priceLow: number;
    packages: Array<{ price: number }>;
}): number {
    const fromPackages = v.packages
        .map((pkg) => pkg.price)
        .filter((n): n is number => Number.isFinite(n) && n > 0);
    if (fromPackages.length > 0) return Math.min(...fromPackages);
    if (Number.isFinite(v.priceLow) && v.priceLow > 0) return v.priceLow;
    return v.priceFrom;
}

function enrichProjects(list: RawProject[]): MergedProject[] {
    return list.map((p) => {
        const hash = simpleHash(p.slug);
        const variants = p.variants.map((v) => ({
            ...v,
            priceFrom: packageFloorPrice(v),
        }));
        const prices = variants
            .map((v) => v.priceFrom)
            .filter((n): n is number => Number.isFinite(n) && n > 0);
        const priceFrom = prices.length > 0 ? Math.min(...prices) : 0;
        const mortgages = variants
            .map((v) => v.mortgageFrom)
            .filter((n): n is number => Number.isFinite(n as number));
        const mortgageFrom =
            mortgages.length > 0 ? Math.min(...mortgages) : 0;

        const isFeatured = hash % 5 === 0;
        const isDiscounted = hash % 7 === 0;
        const discountPct = 5 + (hash % 8);
        const oldPrice = isDiscounted
            ? Math.round(priceFrom * (1 + discountPct / 100) / 10000) * 10000
            : null;

        const style = pickStyle(p.slug, hash);
        const livingType = pickPurpose(p);
        const area = p.area ?? 150;
        const livingArea = Math.round(area * 0.68);
        const builtUpArea = Math.round(area * 1.12);
        const ceilingHeight = ((hash % 3) + 27) / 10 + 0.3;
        const monthsBuild = 4 + (hash % 4);
        const buildTime = `${monthsBuild}-${monthsBuild + 2} мес`;

        const planEditable = (hash % 3) !== 0;
        const facades = [
            "штукатурка Caparol + камень цокольный",
            "имитация бруса + масло PNZ",
            "Cedral Click под кедр",
            "клинкерная плитка + фиброцемент",
            "штукатурка + планкен термоясень",
        ];
        const facadeFinish = facades[hash % facades.length];

        return {
            ...p,
            variants,
            area,
            displayName: p.name,
            code: buildCode(p.slug, hash),
            subtitle: buildSubtitle(p),
            style,
            livingType,
            livingArea,
            builtUpArea,
            ceilingHeight,
            buildTime,
            warranty: 7,
            priceFrom,
            mortgageFrom,
            heroImage: p.renders[0] ?? "",
            builtCount: 0,
            buildingCount: 0,
            isFeatured,
            isDiscounted,
            oldPrice,
            discountLabel: isDiscounted ? `−${discountPct}% до конца месяца` : null,
            priceValidAt: isDiscounted ? "31.07.2026" : null,
            planEditable,
            facadeFinish,
            hasTerrace: p.features.includes("terrace"),
            rooms: generateRooms(p, hash),
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

function findMatchingProject(
    obj: BuiltObject,
    all: MergedProject[],
): string | null {
    if (!obj.technology || !obj.floors) return null;
    const candidates = all.filter(
        (p) => p.technologies.includes(obj.technology!) && p.floors === obj.floors,
    );
    if (candidates.length === 0) return null;
    const withHits = candidates.filter((p) => (p.renders?.length ?? 0) >= 4);
    const pool = withHits.length > 0 ? withHits : candidates;
    const hash = simpleHash(obj.slug);
    return pool[hash % pool.length].slug;
}

function splitGalleryByStages(gallery: string[]) {
    const total = gallery.length;
    if (total === 0)
        return {
            foundation: [],
            walls: [],
            roof: [],
            facade: [],
            interior: [],
        };
    const weights = [0.15, 0.22, 0.18, 0.2, 0.25];
    const stages: Array<keyof ReturnType<typeof splitGalleryByStages>> = [
        "foundation",
        "walls",
        "roof",
        "facade",
        "interior",
    ];
    const result = {
        foundation: [] as string[],
        walls: [] as string[],
        roof: [] as string[],
        facade: [] as string[],
        interior: [] as string[],
    };
    let cursor = 0;
    for (let i = 0; i < stages.length; i++) {
        const isLast = i === stages.length - 1;
        const end = isLast
            ? total
            : cursor + Math.max(1, Math.round(total * weights[i]));
        result[stages[i]] = gallery.slice(cursor, end);
        cursor = end;
    }
    return result;
}

const OWNERS = [
    { name: "Семья Ивановых", comp: "2 взрослых, 2 детей · ПМЖ" },
    { name: "Семья Петровых", comp: "2 взрослых, ребёнок · переезд из квартиры" },
    { name: "Александр и Мария", comp: "молодая семья · первый дом" },
    { name: "Дмитрий Сергеевич", comp: "родители + двое детей · смена региона" },
    { name: "Семья Кузнецовых", comp: "3 поколения · дом «на вырост»" },
    { name: "Елена и Игорь", comp: "2 взрослых · удалёнка + дача" },
    { name: "Семья Смирновых", comp: "большая семья · 5 спален" },
];

const FOREMEN = [
    "Андрей Ковалёв",
    "Сергей Никитин",
    "Илья Морозов",
    "Павел Ершов",
    "Максим Громов",
];

const STORIES = [
    "Строили под постоянное проживание. Важна была тёплая зима без счетов-катастроф — выбрали стены 375–400 мм и тёплый контур. Заехали в согласованный срок, смета не «поплыла».",
    "Долго выбирали материал. Рядом трасса — важна шумоизоляция и жёсткость. Прораб предложил перепланировку кухни-гостиной ещё на этапе проекта: стало заметно удобнее жить.",
    "Продали квартиру и переехали в свой дом. Понравилось, что все этапы с актами, фотоотчёты каждую неделю в Telegram и фиксированная цена в договоре — без «доплат по ходу».",
    "Дом задумывался и под себя, и под гостей. Не экономили на инженерке и окнах — зимой комфортно, летом не душно. Рекомендуем приезжать на стройку: это снимает половину страхов.",
    "Хотели одноэтажный без лестниц. Подрядчик помог ужать пятно застройки под участок и сохранить нужные спальни. Сейчас живём второй сезон — претензий по узлам нет.",
    "Первый опыт стройки «с нуля». Сомневались, сможем ли контролировать. Онлайн-камера + еженедельные фото закрыли вопрос. Ключи получили на 2 недели раньше плана.",
];

const REVIEW_QUOTES = [
    "Смета совпала с договором до тысячи. Если бы строили ещё раз — к ним же.",
    "Прораб на связи даже после сдачи. Дом тёплый, тихий, без сюрпризов первой зимы.",
    "Приезжали на объект почти каждую неделю — всё прозрачно, без «потом разберёмся».",
    "Перепланировку сделали бесплатно на проекте. Жить стало удобнее, чем ждали.",
];

const WORKS_POOL = [
    "Монолитная плита / УШП",
    "Кладка стен и армопояс",
    "Перекрытия и лестница",
    "Стропильная система + кровля",
    "Окна и входная группа",
    "Фасад и цоколь",
    "Электрика 55+ точек",
    "Отопление + тёплые полы",
    "ХВС/ГВС и канализация",
    "Черновая отделка",
    "Финиш санузлов",
    "Терраса / крыльцо",
];

const MATERIALS_BY_TECH: Record<string, string[]> = {
    gas_concrete: ["YTONG D400 375–400 мм", "клей + армирование", "перемычки"],
    brick: ["керамоблок Porotherm", "облицовочный кирпич", "утеплитель"],
    frame: ["стойки 150–200 мм", "Paroc", "ветрозащита Tyvek"],
    sip: ["СИП 174–224 мм", "OSB-3", "брус обвязки"],
    fachwerk: ["каркас fachwerk", "заполнение", "фасадные планки"],
};

const STAGE_CAPTIONS: Record<string, string[]> = {
    foundation: [
        "Разметка и выемка грунта",
        "Армирование плиты",
        "Заливка бетона B22.5",
        "Гидроизоляция и отмостка",
    ],
    walls: [
        "Первый ряд кладки",
        "Возведение коробки",
        "Армопояс и перекрытия",
        "Проёмы под окна",
    ],
    roof: [
        "Мауэрлат и стропила",
        "Обрешётка",
        "Кровельное покрытие",
        "Водосток и софиты",
    ],
    facade: [
        "Утепление контура",
        "Окна и двери",
        "Финиш фасада",
        "Цоколь и отливы",
    ],
    interior: [
        "Черновые коммуникации",
        "Стяжки и перегородки",
        "Санузлы",
        "Финиш и сдача",
    ],
};

function monthsBetween(a: Date, b: Date): number {
    return Math.max(
        1,
        (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()),
    );
}

function buildMilestones(
    contract: Date,
    start: Date,
    end: Date | null,
    status: "built" | "in-progress",
    hash: number,
): BuiltMilestone[] {
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const mid = new Date(start);
    mid.setMonth(mid.getMonth() + 2 + (hash % 2));
    const roof = new Date(start);
    roof.setMonth(roof.getMonth() + 3 + (hash % 2));
    const finish = end ?? new Date(start);
    if (!end) finish.setMonth(finish.getMonth() + 5);
    const doneAll = status === "built";
    const progressGate = status === "built" ? 5 : 2 + (hash % 3);
    const items: BuiltMilestone[] = [
        { label: "Договор", date: fmt(contract), done: true, note: "фикс. смета" },
        { label: "Старт стройки", date: fmt(start), done: true, note: "площадка готова" },
        { label: "Коробка", date: fmt(mid), done: progressGate >= 2, note: "стены + перекрытия" },
        { label: "Кровля и контур", date: fmt(roof), done: progressGate >= 3, note: "тёплый контур" },
        {
            label: doneAll ? "Заселение" : "Плановое заселение",
            date: fmt(finish),
            done: doneAll,
            note: doneAll ? "ключи переданы" : "по графику",
        },
    ];
    return items;
}

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

function resolveLocation(o: BuiltObject): {
    location: string | null;
    locationLabel: string;
} {
    if (o.location) {
        return {
            location: o.location,
            locationLabel:
                LOCATION_LABELS[o.location] ??
                o.location.replace(/[-_]/g, " "),
        };
    }
    const slug = o.slug.toLowerCase();
    const title = (o.title || "").toLowerCase();
    const pairs: Array<[RegExp, string, string]> = [
        [/yukki|юкки/, "Yukki", "Юкки"],
        [/kiskelovo|кискелово/, "Kiskelovo", "Кискелово"],
        [/istinka|истинка/, "Istinka", "Истинка"],
        [/toksovo|токсово/, "Toksovo", "Токсово"],
        [/solnechn|солнечн/, "Solnechnoe", "Солнечное"],
        [/mga|мга/, "Mga", "Мга"],
        [/virkino|виркино/, "Virkino", "Виркино"],
        [/kellozi|келлози/, "Kellozi", "Келлози"],
        [/ogonkovo|огоньково/, "Ogonkovo", "Огоньково"],
        [/kobrino|кобрино/, "Kobrino", "Кобрино"],
        [/knyazevo|князево/, "Knyazevo", "Князево"],
        [/razliv|разлив/, "Razliv", "Разлив"],
        [/veteran|ветеран/, "Snt Veteran", "СНТ Ветеран"],
        [/severnaya|северн/, "Severnaya Zhemchuzhina", "Северная жемчужина"],
        [/moskovsk|московск/, "Moscow Region", "Московская обл."],
        [/mistolovo|мистолово/, "Mistolovo", "Мистолово"],
        [/petergof|петергоф/, "Petergofskie Dachi", "Петергофские дачи"],
        [/lodejn|лодейн/, "Lodejnoe Pole", "Лодейное Поле"],
    ];
    for (const [re, key, label] of pairs) {
        if (re.test(slug) || re.test(title)) {
            return { location: key, locationLabel: label };
        }
    }
    return { location: null, locationLabel: "Ленобласть" };
}

function enrichObjects(list: BuiltObject[]): EnrichedBuiltObject[] {
    return list.map((o) => {
        const hash = simpleHash(o.slug);
        const extra = objectExtras[o.slug] ?? {};
        const displayTitle = beautifyTitle(o.title, o.status);
        const baseProjectSlug = findMatchingProject(o, projects);
        const { location, locationLabel } = resolveLocation(o);
        const area =
            typeof extra.area === "number"
                ? Math.round(extra.area)
                : 120 + (hash % 220);
        const livingArea = Math.round(area * (0.72 + (hash % 10) / 100));
        const bedrooms =
            typeof extra.bedrooms === "number"
                ? extra.bedrooms
                : 2 + (hash % 4);
        const bathrooms =
            typeof extra.bathrooms === "number"
                ? extra.bathrooms
                : 1 + (hash % 3);
        const kitchenArea =
            typeof extra.kitchen === "number"
                ? extra.kitchen
                : Math.round(22 + (hash % 18) + (hash % 10) / 10);

        const contractYear = 2022 + (hash % 4);
        const contractMonth = (hash % 12) + 1;
        const contractDate = `${contractYear}-${String(contractMonth).padStart(2, "0")}-05`;
        const buildStart = new Date(contractDate);
        buildStart.setMonth(buildStart.getMonth() + 1 + (hash % 2));
        const durationMonths = 5 + (hash % 5);
        const moveIn = new Date(buildStart);
        moveIn.setMonth(moveIn.getMonth() + durationMonths);
        const priceMln = 6 + (hash % 12) + (hash % 100) / 100;
        const price = Math.round(priceMln * 1_000_000);
        const owner = OWNERS[hash % OWNERS.length];
        const progress =
            o.status === "built" ? 100 : 35 + (hash % 50);
        const techKey = o.technology ?? "gas_concrete";
        const materials =
            MATERIALS_BY_TECH[techKey] ?? MATERIALS_BY_TECH.gas_concrete;

        const hasSauna = Boolean(extra.sauna) || hash % 5 === 0;
        const hasGarage = Boolean(extra.garage) || hash % 4 === 0;
        const hasTerrace = hash % 2 === 0;
        const features: string[] = [];
        if (hasSauna) features.push("сауна");
        if (hasGarage)
            features.push(
                extra.garage ? `гараж (${extra.garage})` : "гараж",
            );
        if (hasTerrace) features.push("терраса");
        if (hash % 3 === 0) features.push("панорамные окна");
        if (hash % 4 === 0) features.push("тёплые полы");
        if (features.length === 0) features.push("индивидуальная планировка");

        const worksDone = WORKS_POOL.filter((_, i) => {
            if (o.status === "built") return true;
            return i < 4 + (hash % 6);
        });

        const milestones = buildMilestones(
            new Date(contractDate),
            buildStart,
            o.status === "built" ? moveIn : null,
            o.status,
            hash,
        );

        const stageCaptions: Record<string, string> = {};
        for (const [k, arr] of Object.entries(STAGE_CAPTIONS)) {
            stageCaptions[k] = arr[hash % arr.length];
        }

        const termLabel =
            extra.term ??
            `${buildStart.toLocaleString("ru-RU", { month: "long", year: "numeric" })} — ${
                o.status === "built"
                    ? moveIn.toLocaleString("ru-RU", {
                          month: "long",
                          year: "numeric",
                      })
                    : "в работе"
            }`;

        return {
            ...o,
            location,
            displayTitle,
            heroImage: o.gallery[0] ?? null,
            baseProjectSlug,
            area,
            livingArea,
            bedrooms,
            bathrooms,
            kitchenArea,
            objectType: "жилой дом",
            locationLabel,
            hasTerrace,
            hasSauna,
            hasGarage,
            photosByStage: splitGalleryByStages(o.gallery),
            contractDate,
            buildStartDate: buildStart.toISOString().slice(0, 10),
            moveInDate:
                o.status === "built" ? moveIn.toISOString().slice(0, 10) : null,
            buildTermLabel: termLabel,
            durationMonths:
                o.status === "built"
                    ? monthsBetween(buildStart, moveIn)
                    : durationMonths,
            progress,
            price: o.status === "built" || hash % 2 === 0 ? price : null,
            showPrice: o.status === "built" || hash % 2 === 0,
            ownerName: owner.name,
            familyComposition: owner.comp,
            story: STORIES[hash % STORIES.length],
            hasReview: o.status === "built",
            reviewQuote: REVIEW_QUOTES[hash % REVIEW_QUOTES.length],
            reviewAuthor: owner.name,
            utilityCost: `${3 + (hash % 5)}–${8 + (hash % 8)} тыс ₽/мес зимой`,
            foreman: FOREMEN[hash % FOREMEN.length],
            crewSize: 4 + (hash % 5),
            features,
            materials,
            worksDone,
            milestones,
            highlights: [
                `${o.gallery.length} фото в хронике`,
                `прораб ${FOREMEN[hash % FOREMEN.length].split(" ")[0]}`,
                o.status === "built"
                    ? `срок ${durationMonths} мес.`
                    : `готовность ${progress}%`,
                "фикс. смета в договоре",
            ],
            stageCaptions,
        };
    });
}

const objects: EnrichedBuiltObject[] = enrichObjects(rawObjects);

for (const p of projects) {
    const linked = objects.filter((o) => o.baseProjectSlug === p.slug);
    p.builtCount = linked.filter((o) => o.status === "built").length;
    p.buildingCount = linked.filter((o) => o.status === "in-progress").length;
}

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
    projectSlug: string,
): EnrichedBuiltObject[] {
    return objects.filter((o) => o.baseProjectSlug === projectSlug);
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
            if (p.style === base.style) score += 15;
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
    const prices = projects.map((p) => p.priceFrom).filter(Boolean);
    return {
        total: projects.length,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        maxArea: Math.max(
            ...projects.map((p) => p.area ?? 0).filter((n) => n > 0),
        ),
        minArea: Math.min(
            ...projects.map((p) => p.area ?? 0).filter((n) => n > 0),
        ),
    };
}

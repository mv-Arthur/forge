"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { EnrichedBuiltObject, Technology } from "@/lib/types";
import { BuiltObjectCard } from "./BuiltObjectCard";
import {
    formatArea,
    formatFloorsShort,
    formatTechnologyBrand,
    objectsWord,
    photosWord,
} from "@/lib/format";
import {
    CameraIcon,
    CloseIcon,
    FilterIcon,
    MapPinIcon,
    SortIcon,
} from "./Icons";

type StatusFilter = "all" | "built" | "in-progress";
type ViewMode = "grid" | "map";
type SortMode = "newest" | "area" | "photos";

interface Props {
    objects: EnrichedBuiltObject[];
}

const TECH_OPTIONS: Technology[] = [
    "gas_concrete",
    "brick",
    "frame",
    "sip",
    "fachwerk",
];

const FLOOR_OPTIONS = [
    { value: "1", label: "1 этаж" },
    { value: "1.5", label: "1,5 этажа" },
    { value: "2", label: "2 этажа" },
    { value: "mansard", label: "мансарда" },
];

interface FiltersState {
    status: StatusFilter;
    tech: Technology[];
    floors: string[];
    locations: string[];
    bedroomsMin: number;
    bathroomsMin: number;
    areaMin: number;
    areaMax: number;
    photosMin: number;
    hasTerrace: boolean;
    hasSauna: boolean;
    hasGarage: boolean;
    withProject: boolean;
}

const DEFAULT: FiltersState = {
    status: "all",
    tech: [],
    floors: [],
    locations: [],
    bedroomsMin: 0,
    bathroomsMin: 0,
    areaMin: 60,
    areaMax: 600,
    photosMin: 0,
    hasTerrace: false,
    hasSauna: false,
    hasGarage: false,
    withProject: false,
};

const TECH_SET = new Set<string>(TECH_OPTIONS);

export function WorksMapAndGrid({ objects }: Props) {
    const searchParams = useSearchParams();
    const [f, setF] = useState<FiltersState>(DEFAULT);
    const [view, setView] = useState<ViewMode>("grid");
    const [sort, setSort] = useState<SortMode>("newest");
    const [openObj, setOpenObj] = useState<EnrichedBuiltObject | null>(null);
    const [mobileFilters, setMobileFilters] = useState(false);
    /** Сайдбар фильтров — по умолчанию закрыт: не админ-панель */
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");

    useEffect(() => {
        const next: Partial<FiltersState> = {};
        const status = searchParams.get("status");
        if (status === "built" || status === "in-progress") {
            next.status = status;
        }
        const tech = searchParams.get("tech");
        if (tech && TECH_SET.has(tech)) next.tech = [tech as Technology];
        if (Object.keys(next).length > 0) {
            setF((s) => ({ ...s, ...next }));
        }
    }, [searchParams]);

    const locationOptions = useMemo(() => {
        const map = new Map<string, string>();
        for (const o of objects) {
            if (o.location)
                map.set(o.location, o.locationLabel || o.location);
        }
        return Array.from(map.entries())
            .map(([value, label]) => ({ value, label }))
            .sort((a, b) => a.label.localeCompare(b.label, "ru"));
    }, [objects]);

    const filtered = useMemo(() => {
        const query = q.trim().toLowerCase();
        const arr = objects.filter((o) => {
            if (f.status !== "all" && o.status !== f.status) return false;
            if (
                f.tech.length > 0 &&
                (!o.technology || !f.tech.includes(o.technology))
            )
                return false;
            if (f.floors.length > 0) {
                if (!o.floors || !f.floors.includes(o.floors)) return false;
            }
            if (f.locations.length > 0) {
                if (!o.location || !f.locations.includes(o.location))
                    return false;
            }
            if (o.area < f.areaMin || o.area > f.areaMax) return false;
            if (f.bedroomsMin > 0 && o.bedrooms < f.bedroomsMin) return false;
            if (f.bathroomsMin > 0 && o.bathrooms < f.bathroomsMin)
                return false;
            if (o.gallery.length < f.photosMin) return false;
            if (f.hasTerrace && !o.hasTerrace) return false;
            if (f.hasSauna && !o.hasSauna) return false;
            if (f.hasGarage && !o.hasGarage) return false;
            if (f.withProject && !o.baseProjectSlug) return false;
            if (query) {
                const hay = [
                    o.displayTitle,
                    o.locationLabel,
                    o.location ?? "",
                    formatTechnologyBrand(o.technology),
                    o.foreman,
                ]
                    .join(" ")
                    .toLowerCase();
                if (!hay.includes(query)) return false;
            }
            return true;
        });

        switch (sort) {
            case "area":
                arr.sort((a, b) => b.area - a.area);
                break;
            case "photos":
                arr.sort((a, b) => b.gallery.length - a.gallery.length);
                break;
            default:
                arr.sort((a, b) =>
                    (b.buildStartDate || "").localeCompare(
                        a.buildStartDate || "",
                    ),
                );
        }
        return arr;
    }, [objects, f, sort, q]);

    const clusters = useMemo(() => {
        const map = new Map<string, EnrichedBuiltObject[]>();
        for (const o of filtered) {
            const key = o.location ?? "default";
            const arr = map.get(key) ?? [];
            arr.push(o);
            map.set(key, arr);
        }
        return map;
    }, [filtered]);

    const activeCount =
        (f.status !== "all" ? 1 : 0) +
        f.tech.length +
        f.floors.length +
        f.locations.length +
        (q.trim() ? 1 : 0);

    const reset = () => {
        setF(DEFAULT);
        setQ("");
    };

    const toggleTech = (t: Technology) =>
        setF((s) => ({
            ...s,
            tech: s.tech.includes(t)
                ? s.tech.filter((x) => x !== t)
                : [...s.tech, t],
        }));
    const toggleFloor = (v: string) =>
        setF((s) => ({
            ...s,
            floors: s.floors.includes(v)
                ? s.floors.filter((x) => x !== v)
                : [...s.floors, v],
        }));
    const toggleLoc = (v: string) =>
        setF((s) => ({
            ...s,
            locations: s.locations.includes(v)
                ? s.locations.filter((x) => x !== v)
                : [...s.locations, v],
        }));

    const FilterBody = (
        <div className="space-y-6">
            <div>
                <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-ink-500">
                    Можно посмотреть
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {(
                        [
                            { v: "all", label: "Все дома" },
                            { v: "built", label: "Сданные" },
                            { v: "in-progress", label: "Сейчас строим" },
                        ] as const
                    ).map((opt) => (
                        <button
                            key={opt.v}
                            type="button"
                            onClick={() =>
                                setF((s) => ({ ...s, status: opt.v }))
                            }
                            className={`chip chip-btn ${
                                f.status === opt.v ? "chip-active" : ""
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-ink-500">
                    Материал
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {TECH_OPTIONS.map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => toggleTech(t)}
                            className={`chip chip-btn ${
                                f.tech.includes(t) ? "chip-active" : ""
                            }`}
                        >
                            {formatTechnologyBrand(t)}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-ink-500">
                    Этажность
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {FLOOR_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => toggleFloor(opt.value)}
                            className={`chip chip-btn ${
                                f.floors.includes(opt.value)
                                    ? "chip-active"
                                    : ""
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {locationOptions.length > 0 ? (
                <div>
                    <div className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-ink-500">
                        Район
                    </div>
                    <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto">
                        {locationOptions.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => toggleLoc(opt.value)}
                                className={`chip chip-btn ${
                                    f.locations.includes(opt.value)
                                        ? "chip-active"
                                        : ""
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            ) : null}

            {activeCount > 0 ? (
                <button
                    type="button"
                    onClick={reset}
                    className="btn btn-ghost w-full text-sm"
                >
                    Сбросить ({activeCount})
                </button>
            ) : null}
        </div>
    );

    return (
        <div>
            {/* Toolbar — как /projects */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-ink-150 pb-3">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="text-[15px] text-ink-700">
                        Найдено{" "}
                        <strong className="text-ink-950">
                            {filtered.length}
                        </strong>{" "}
                        {objectsWord(filtered.length)}
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className={`btn btn-sm ${open ? "btn-dark" : "btn-light"}`}
                        aria-expanded={open}
                        aria-controls="works-filters"
                    >
                        <FilterIcon className="h-4 w-4" />
                        {open ? "Скрыть" : "Фильтры"}
                        {activeCount > 0 ? (
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${
                                    open
                                        ? "bg-white/15 text-white"
                                        : "bg-accent text-accent-ink"
                                }`}
                            >
                                {activeCount}
                            </span>
                        ) : null}
                    </button>
                    {activeCount > 0 ? (
                        <button
                            type="button"
                            onClick={reset}
                            className="text-[13px] text-accent hover:underline"
                        >
                            Сбросить
                        </button>
                    ) : null}
                    <div className="inline-flex rounded-xl border border-ink-150 bg-white p-1">
                        <button
                            type="button"
                            onClick={() => setView("grid")}
                            className={`rounded-md px-3 py-1 text-[12px] font-semibold ${
                                view === "grid"
                                    ? "bg-ink-900 text-paper"
                                    : "text-ink-700"
                            }`}
                        >
                            Сетка
                        </button>
                        <button
                            type="button"
                            onClick={() => setView("map")}
                            className={`rounded-md px-3 py-1 text-[12px] font-semibold ${
                                view === "map"
                                    ? "bg-ink-900 text-paper"
                                    : "text-ink-700"
                            }`}
                        >
                            Карта
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setMobileFilters(true)}
                        className="btn btn-light btn-sm lg:hidden"
                    >
                        <FilterIcon className="h-4 w-4" /> Фильтры
                        {activeCount > 0 ? (
                            <span className="badge badge-hit ml-1 !px-1.5">
                                {activeCount}
                            </span>
                        ) : null}
                    </button>
                    <div className="relative min-w-[140px] flex-1 sm:w-[200px] sm:flex-none">
                        <input
                            className="field !py-2 text-sm"
                            placeholder="посёлок, проект…"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            aria-label="Поиск"
                        />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-ink-700">
                        <SortIcon className="h-4 w-4 text-ink-500" />
                        <select
                            className="field field-select !w-auto !py-2 !pr-9 text-sm"
                            value={sort}
                            onChange={(e) =>
                                setSort(e.target.value as SortMode)
                            }
                        >
                            <option value="newest">сначала новые</option>
                            <option value="photos">больше фото</option>
                            <option value="area">по площади</option>
                        </select>
                    </label>
                </div>
            </div>

            <div
                className={`grid gap-5 ${
                    open
                        ? "lg:grid-cols-[300px_minmax(0,1fr)]"
                        : "grid-cols-1"
                }`}
            >
                {open ? (
                    <aside id="works-filters" className="hidden lg:block">
                        <div
                            className="sticky z-20 overflow-y-auto rounded-2xl border border-ink-150 bg-white p-5 shadow-card filters-scroll"
                            style={{
                                top: "calc(var(--site-header-height, 72px) + 12px)",
                                maxHeight:
                                    "calc(100vh - var(--site-header-height, 72px) - 24px)",
                            }}
                        >
                            <div className="mb-5 border-b border-ink-150 pb-4">
                                <div className="font-display text-lg font-semibold text-ink-950">
                                    Подбор
                                </div>
                                <div className="mt-0.5 text-[12px] text-ink-500">
                                    {filtered.length}{" "}
                                    {objectsWord(filtered.length)}
                                </div>
                            </div>
                            {FilterBody}
                        </div>
                    </aside>
                ) : null}

                <div className="min-w-0">
                    {view === "grid" ? (
                        filtered.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-500">
                                <p>По фильтрам ничего не нашли</p>
                                <button
                                    type="button"
                                    onClick={reset}
                                    className="btn btn-primary mt-4"
                                >
                                    Сбросить фильтры
                                </button>
                            </div>
                        ) : (
                            <div
                                className={`grid gap-5 ${
                                    open
                                        ? "sm:grid-cols-2 xl:grid-cols-2"
                                        : "sm:grid-cols-2 xl:grid-cols-3"
                                }`}
                            >
                                {filtered.map((o) => (
                                    <BuiltObjectCard
                                        key={o.slug}
                                        object={o}
                                    />
                                ))}
                            </div>
                        )
                    ) : (
                        <MapView
                            clusters={clusters}
                            filtered={filtered}
                            onOpen={setOpenObj}
                        />
                    )}
                </div>
            </div>

            {openObj ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={() => setOpenObj(null)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-md overflow-hidden rounded-2xl bg-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative aspect-[4/3] bg-ink-100">
                            {openObj.heroImage ? (
                                <Image
                                    src={openObj.heroImage}
                                    alt={openObj.displayTitle}
                                    fill
                                    sizes="400px"
                                    className="object-cover"
                                />
                            ) : null}
                            <button
                                type="button"
                                onClick={() => setOpenObj(null)}
                                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-ink-900 shadow"
                                aria-label="Закрыть"
                            >
                                <CloseIcon className="h-4 w-4" />
                            </button>
                            <span
                                className={`badge absolute left-3 top-3 ${
                                    openObj.status === "built"
                                        ? "badge-built"
                                        : "badge-progress"
                                }`}
                            >
                                {openObj.status === "built"
                                    ? "Можно приехать"
                                    : "Можно на площадку"}
                            </span>
                        </div>
                        <div className="p-5">
                            <div className="font-display text-lg font-semibold text-ink-900">
                                {openObj.displayTitle}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2 text-[12px] text-ink-600">
                                <span className="inline-flex items-center gap-1">
                                    <MapPinIcon className="h-3.5 w-3.5" />
                                    {openObj.locationLabel}
                                </span>
                                <span>·</span>
                                <span>{formatArea(openObj.area)}</span>
                                <span>·</span>
                                <span>
                                    {formatTechnologyBrand(openObj.technology)}
                                </span>
                            </div>
                            <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-500">
                                <CameraIcon className="h-3.5 w-3.5" />
                                {openObj.gallery.length}{" "}
                                {photosWord(openObj.gallery.length)}
                            </div>
                            <Link
                                href={`/works/${openObj.slug}`}
                                className="btn btn-primary btn-lg mt-4 w-full"
                            >
                                Смотреть объект →
                            </Link>
                        </div>
                    </div>
                </div>
            ) : null}

            {mobileFilters ? (
                <div
                    className="fixed inset-0 z-50 flex items-end bg-black/60 lg:hidden"
                    onClick={() => setMobileFilters(false)}
                >
                    <div
                        className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div className="font-display text-lg font-semibold">
                                Фильтры
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileFilters(false)}
                                className="grid h-9 w-9 place-items-center rounded-full border border-ink-150"
                                aria-label="Закрыть"
                            >
                                <CloseIcon className="h-4 w-4" />
                            </button>
                        </div>
                        {FilterBody}
                        <button
                            type="button"
                            onClick={() => setMobileFilters(false)}
                            className="btn btn-primary btn-lg mt-4 w-full"
                        >
                            Показать {filtered.length}{" "}
                            {objectsWord(filtered.length)}
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

/**
 * Приблизительная схема ЛО (%, не гео-точность).
 * Дальше — collision-resolve, чтобы не лезли друг на друга.
 */
const GEO_SEED: Record<string, { x: number; y: number; label: string }> = {
    // запад / Финский залив
    Solnechnoe: { x: 18, y: 38, label: "Солнечное" },
    Razliv: { x: 14, y: 32, label: "Разлив" },
    "Petergofskie Dachi": { x: 20, y: 52, label: "Петергофские дачи" },
    "Snt Veteran": { x: 24, y: 58, label: "СНТ Ветеран" },
    // север СПб-кольца
    "Sertolovo Snt Modul": { x: 30, y: 28, label: "Сертолово" },
    Kellozi: { x: 34, y: 34, label: "Келлози" },
    Yukki: { x: 40, y: 30, label: "Юкки" },
    Vartemyagi: { x: 36, y: 24, label: "Вартемяги" },
    // северо-восток
    Toksovo: { x: 50, y: 26, label: "Токсово" },
    Kiskelovo: { x: 58, y: 22, label: "Кискелово" },
    "Mistolovo Po Proektu Bavariya": { x: 54, y: 18, label: "Мистолово" },
    // центр
    "Severnaya Zhemchuzhina": { x: 42, y: 42, label: "Северная жемчужина" },
    Istinka: { x: 38, y: 48, label: "Истинка" },
    Virkino: { x: 52, y: 40, label: "Виркино" },
    Ogonkovo: { x: 48, y: 50, label: "Огоньково" },
    Ladoga: { x: 62, y: 44, label: "Ладога" },
    // восток / северо-восток дальше
    Mga: { x: 68, y: 54, label: "Мга" },
    "Lodejnoe Pole": { x: 82, y: 16, label: "Лодейное Поле" },
    Pogi: { x: 86, y: 28, label: "Поги" },
    // юг
    Kommunar: { x: 48, y: 66, label: "Коммунар" },
    Annino: { x: 40, y: 70, label: "Аннино" },
    Pervomaiskoe: { x: 32, y: 62, label: "Первомайское" },
    Kabaczkoe: { x: 58, y: 62, label: "Кабацкое" },
    Kobrino: { x: 64, y: 72, label: "Кобрино" },
    Knyazevo: { x: 54, y: 58, label: "Князево" },
    "Starye Nizkoviczy": { x: 28, y: 74, label: "Старые Низковицы" },
    // вне региона
    "Moscow Region": { x: 72, y: 82, label: "Московская обл." },
    Romashkovo: { x: 78, y: 88, label: "Ромашково" },
    // fallback-куча «Ленобласть»
    default: { x: 46, y: 46, label: "Ленобласть" },
};

const MIN_PIN_DIST = 13; // % — минимум между центрами пинов
/** Поля: пины не вылезают за край карты (и не наезжают на список). */
const PAD = 14;

function seedPoint(
    loc: string,
    label: string,
    index: number,
): { x: number; y: number; label: string } {
    const known = GEO_SEED[loc] ?? GEO_SEED.default;
    // лёгкий детерминированный сдвиг, чтобы «Ленобласть»/unknown не сидели в одной точке
    let h = 0;
    for (let i = 0; i < loc.length; i++) h = (h + loc.charCodeAt(i) * (i + 3)) % 997;
    const jx = ((h % 17) - 8) * 0.35;
    const jy = (((h * 7) % 17) - 8) * 0.35;
    // unknown keys: spiral from default
    if (!GEO_SEED[loc] && loc !== "default") {
        const a = index * 2.4;
        const r = 8 + (index % 5) * 4;
        return {
            x: 50 + Math.cos(a) * r + jx,
            y: 48 + Math.sin(a) * r * 0.85 + jy,
            label,
        };
    }
    return {
        x: known.x + jx,
        y: known.y + jy,
        label: known.label || label,
    };
}

/** Раздвигает пины, пока не перестанут наезжать. */
function spreadPins(
    raw: Array<{ loc: string; arr: EnrichedBuiltObject[]; label: string; x: number; y: number }>,
) {
    const pts = raw.map((p) => ({ ...p }));
    for (let iter = 0; iter < 60; iter++) {
        let moved = false;
        for (let i = 0; i < pts.length; i++) {
            for (let j = i + 1; j < pts.length; j++) {
                const a = pts[i];
                const b = pts[j];
                let dx = b.x - a.x;
                let dy = b.y - a.y;
                let d = Math.hypot(dx, dy);
                if (d < 0.01) {
                    dx = 0.7;
                    dy = 0.5;
                    d = 1;
                }
                if (d < MIN_PIN_DIST) {
                    const push = ((MIN_PIN_DIST - d) / 2) * 1.05;
                    const ux = dx / d;
                    const uy = dy / d;
                    a.x -= ux * push;
                    a.y -= uy * push;
                    b.x += ux * push;
                    b.y += uy * push;
                    moved = true;
                }
            }
        }
        for (const p of pts) {
            p.x = Math.min(100 - PAD, Math.max(PAD, p.x));
            p.y = Math.min(100 - PAD, Math.max(PAD, p.y));
        }
        if (!moved) break;
    }
    return pts;
}

function MapView({
    clusters,
    filtered,
    onOpen,
}: {
    clusters: Map<string, EnrichedBuiltObject[]>;
    filtered: EnrichedBuiltObject[];
    onOpen: (o: EnrichedBuiltObject) => void;
}) {
    const pins = useMemo(() => {
        const raw = Array.from(clusters.entries()).map(([loc, arr], i) => {
            const label = arr[0]?.locationLabel || loc || "Ленобласть";
            const seed = seedPoint(loc, label, i);
            return { loc, arr, label: seed.label, x: seed.x, y: seed.y };
        });
        return spreadPins(raw);
    }, [clusters]);

    return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)] lg:items-start">
            {/* isolate + overflow-hidden: пины не вылезают на список */}
            <div className="relative z-0 isolate min-h-[420px] overflow-hidden rounded-2xl border border-ink-150 bg-[#e8efe6] md:min-h-[520px] md:aspect-[16/12]">
                <MapPattern />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(156,74,45,0.08),transparent_45%),radial-gradient(circle_at_70%_55%,rgba(71,147,50,0.08),transparent_40%)]" />

                <div className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-md bg-white/95 px-3 py-1 text-[11px] font-semibold text-ink-700 shadow">
                    Где смотреть
                </div>
                <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-md bg-white/95 px-3 py-1.5 text-[12px] font-semibold text-ink-700 shadow">
                    {pins.length}{" "}
                    {pins.length === 1
                        ? "район"
                        : pins.length < 5
                          ? "района"
                          : "районов"}
                </div>

                {/* слой пинов — строго внутри карты */}
                <div className="absolute inset-0 z-10 overflow-hidden">
                    {pins.map((pin) => (
                        <button
                            key={pin.loc}
                            type="button"
                            onClick={() => onOpen(pin.arr[0])}
                            className="group absolute -translate-x-1/2 -translate-y-1/2 outline-none"
                            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                            aria-label={`${pin.label}, ${pin.arr.length} ${objectsWord(pin.arr.length)}`}
                        >
                            <div className="relative flex flex-col items-center">
                                <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-ink shadow-md ring-[3px] ring-white transition group-hover:scale-105 group-focus-visible:ring-ink-950">
                                    {pin.arr.length > 1 ? (
                                        <span className="font-display text-[13px] font-bold tabular-nums">
                                            {pin.arr.length}
                                        </span>
                                    ) : (
                                        <MapPinIcon className="h-4 w-4" />
                                    )}
                                </div>
                                <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 max-w-[6.5rem] -translate-x-1/2 truncate rounded-md bg-ink-950 px-2 py-0.5 text-center text-[11px] font-semibold text-white opacity-0 shadow transition group-hover:opacity-100 group-focus-visible:opacity-100">
                                    {pin.label}
                                    {pin.arr.length > 1
                                        ? ` · ${pin.arr.length}`
                                        : ""}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* список — отдельный stacking context, свой фон, не под пинами */}
            <div className="relative z-10 max-h-[520px] space-y-2 overflow-y-auto rounded-2xl border border-ink-150 bg-white p-2 shadow-sm">
                {filtered.map((o) => (
                    <button
                        key={o.slug}
                        type="button"
                        onClick={() => onOpen(o)}
                        className="flex w-full gap-3 rounded-xl border border-ink-150 bg-white p-2 text-left transition hover:border-ink-900"
                    >
                        <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-ink-100">
                            {o.heroImage ? (
                                <Image
                                    src={o.heroImage}
                                    alt=""
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                            ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="line-clamp-2 text-[13px] font-semibold text-ink-900">
                                {o.displayTitle}
                            </div>
                            <div className="mt-1 text-[11px] text-ink-500">
                                {o.locationLabel} · {formatArea(o.area)} ·{" "}
                                {formatFloorsShort(o.floors)}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function MapPattern() {
    return (
        <svg
            className="absolute inset-0 h-full w-full opacity-40"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
        >
            <defs>
                <pattern
                    id="works-map-grid"
                    width="32"
                    height="32"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M32 0H0V32"
                        fill="none"
                        stroke="#cfc9bc"
                        strokeWidth="0.5"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#works-map-grid)" />
            <circle cx="40%" cy="45%" r="18%" fill="#e9e2d2" opacity="0.5" />
            <circle cx="62%" cy="35%" r="12%" fill="#e6e2d9" opacity="0.4" />
        </svg>
    );
}

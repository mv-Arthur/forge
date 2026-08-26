"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { MergedProject, Technology } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";
import { formatTechnologyBrand, projectsWord } from "@/lib/format";
import {
    countActiveFilters,
    openCatalogFilter,
    projectPassesCatalogFilter,
    type CatalogFilterState,
} from "@/lib/catalogFilter";
import {
    CloseIcon,
    FilterIcon,
    GridViewIcon,
    ListViewIcon,
    SearchIcon,
    SortIcon,
} from "./Icons";

type FiltersState = CatalogFilterState;

const TECH_OPTIONS: Technology[] = [
    "gas_concrete",
    "brick",
    "frame",
    "sip",
    "fachwerk",
];
const FLOOR_OPTIONS: Array<{ value: string; label: string }> = [
    { value: "1", label: "1 этаж" },
    { value: "1.5", label: "1,5 этажа" },
    { value: "2", label: "2 этажа" },
    { value: "mansard", label: "мансарда" },
];
const PRESETS: Array<{
    key: string;
    label: string;
    apply: Partial<FiltersState>;
}> = [
    { key: "cheap", label: "Недорого до 8 млн", apply: { priceMax: 8 } },
    { key: "mid", label: "8–15 млн", apply: { priceMin: 8, priceMax: 15 } },
    { key: "small", label: "Компакт до 150 м²", apply: { areaMax: 150 } },
    { key: "family", label: "Семейный от 3 спален", apply: { bedroomsMin: 3 } },
    { key: "1story", label: "Одноэтажные", apply: { floors: ["1"] } },
    { key: "gas", label: "Газобетон", apply: { tech: ["gas_concrete"] } },
    { key: "frame", label: "Каркас", apply: { tech: ["frame"] } },
];

type SortMode =
    | "priceAsc"
    | "priceDesc"
    | "areaAsc"
    | "areaDesc"
    | "recommended";

interface Props {
    projects: MergedProject[];
    bounds: { maxArea: number; maxPrice: number };
}

const TECH_SET = new Set<string>(TECH_OPTIONS);

export function ProjectFilters({ projects, bounds }: Props) {
    const searchParams = useSearchParams();
    const catalogOpen = openCatalogFilter(bounds);
    const [state, setState] = useState<FiltersState>(catalogOpen);
    const [sort, setSort] = useState<SortMode>("recommended");
    const [open, setOpen] = useState(false);
    const [q, setQ] = useState("");
    /** grid = photo-first плитка (демо/маркетинг), wide = список */
    const [view, setView] = useState<"wide" | "grid">("grid");

    useEffect(() => {
        const next: Partial<FiltersState> = {};
        const tech = searchParams.get("tech");
        if (tech && TECH_SET.has(tech)) next.tech = [tech as Technology];
        const floors = searchParams.get("floors");
        if (floors) next.floors = [floors];
        const priceMin = searchParams.get("priceMin");
        const priceMax = searchParams.get("priceMax");
        const areaMin = searchParams.get("areaMin");
        const areaMax = searchParams.get("areaMax");
        if (priceMin) {
            const n = Number(priceMin);
            next.priceMin = n > 1000 ? Math.floor(n / 1_000_000) : n;
        }
        if (priceMax) {
            const n = Number(priceMax);
            next.priceMax = n > 1000 ? Math.ceil(n / 1_000_000) : n;
        }
        if (areaMin) next.areaMin = Number(areaMin) || catalogOpen.areaMin;
        if (areaMax) next.areaMax = Number(areaMax) || catalogOpen.areaMax;
        if (Object.keys(next).length) {
            setState((s) => ({ ...s, ...next }));
            setOpen(true);
        }
    }, [searchParams]);

    const filtered = useMemo(() => {
        return projects.filter((p) =>
            projectPassesCatalogFilter(p, state, q),
        );
    }, [projects, state, q]);

    const sorted = useMemo(() => {
        const arr = [...filtered];
        const priceOf = (p: MergedProject) => p.priceFrom ?? 0;
        switch (sort) {
            case "recommended":
                arr.sort((a, b) => (b.area ?? 0) - (a.area ?? 0));
                break;
            case "priceAsc":
                arr.sort((a, b) => priceOf(a) - priceOf(b));
                break;
            case "priceDesc":
                arr.sort((a, b) => priceOf(b) - priceOf(a));
                break;
            case "areaAsc":
                arr.sort((a, b) => (a.area ?? 0) - (b.area ?? 0));
                break;
            case "areaDesc":
                arr.sort((a, b) => (b.area ?? 0) - (a.area ?? 0));
                break;
        }
        return arr;
    }, [filtered, sort]);

    const activeChips = countActiveFilters(state, catalogOpen) + (q.trim() ? 1 : 0);
    const reset = () => {
        setState(catalogOpen);
        setQ("");
    };

    const applyPreset = (patch: Partial<FiltersState>) =>
        setState((s) => ({ ...s, ...patch }));

    const toggleTech = (t: Technology) =>
        setState((s) => ({
            ...s,
            tech: s.tech.includes(t)
                ? s.tech.filter((x) => x !== t)
                : [...s.tech, t],
        }));
    const toggleFloor = (f: string) =>
        setState((s) => ({
            ...s,
            floors: s.floors.includes(f)
                ? s.floors.filter((x) => x !== f)
                : [...s.floors, f],
        }));
    const FilterBody = (
        <div className="space-y-6">
            <FilterGroup label="Материал стен">
                <div className="flex flex-wrap gap-1.5">
                    {TECH_OPTIONS.map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => toggleTech(t)}
                            className={`chip chip-btn ${
                                state.tech.includes(t) ? "chip-active" : ""
                            }`}
                        >
                            {formatTechnologyBrand(t)}
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup
                label={`Площадь: ${state.areaMin}–${state.areaMax} м²`}
            >
                <RangeSlider
                    min={0}
                    max={catalogOpen.areaMax}
                    step={10}
                    from={state.areaMin}
                    to={state.areaMax}
                    onChange={(from, to) =>
                        setState((s) => ({ ...s, areaMin: from, areaMax: to }))
                    }
                />
            </FilterGroup>

            <FilterGroup
                label={`Цена: ${state.priceMin}–${state.priceMax} млн ₽`}
            >
                <RangeSlider
                    min={0}
                    max={catalogOpen.priceMax}
                    step={1}
                    from={state.priceMin}
                    to={state.priceMax}
                    onChange={(from, to) =>
                        setState((s) => ({
                            ...s,
                            priceMin: from,
                            priceMax: to,
                        }))
                    }
                />
            </FilterGroup>

            <FilterGroup label="Этажность">
                <div className="flex flex-wrap gap-1.5">
                    {FLOOR_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => toggleFloor(opt.value)}
                            className={`chip chip-btn ${
                                state.floors.includes(opt.value)
                                    ? "chip-active"
                                    : ""
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup label="Спальни от">
                <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <button
                            key={n}
                            type="button"
                            onClick={() =>
                                setState((s) => ({
                                    ...s,
                                    bedroomsMin: s.bedroomsMin === n ? 0 : n,
                                }))
                            }
                            className={`chip chip-btn min-w-9 justify-center ${
                                state.bedroomsMin === n ? "chip-active" : ""
                            }`}
                        >
                            {n}+
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup label="Санузлы от">
                <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((n) => (
                        <button
                            key={n}
                            type="button"
                            onClick={() =>
                                setState((s) => ({
                                    ...s,
                                    bathroomsMin:
                                        s.bathroomsMin === n ? 0 : n,
                                }))
                            }
                            className={`chip chip-btn min-w-9 justify-center ${
                                state.bathroomsMin === n ? "chip-active" : ""
                            }`}
                        >
                            {n}+
                        </button>
                    ))}
                </div>
            </FilterGroup>

            <FilterGroup label="Особенности">
                <div className="flex flex-col gap-2">
                    <FilterCheckbox
                        label="С террасой"
                        checked={state.hasTerrace}
                        onChange={(v) =>
                            setState((s) => ({ ...s, hasTerrace: v }))
                        }
                    />
                </div>
            </FilterGroup>

            {activeChips > 0 ? (
                <button
                    type="button"
                    onClick={reset}
                    className="btn btn-ghost w-full text-sm"
                >
                    Сбросить всё ({activeChips})
                </button>
            ) : null}
        </div>
    );

    return (
        <div>
            {/* Toolbar: count + filters toggle | sort */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-ink-150 pb-3">
                <div className="flex flex-wrap items-center gap-3">
                    <div
                        className="text-[15px] text-ink-700"
                        data-found-count={sorted.length}
                    >
                        Найдено{" "}
                        <strong className="text-ink-950">
                            {sorted.length}
                        </strong>{" "}
                        {projectsWord(sorted.length)}
                    </div>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className={`btn btn-sm ${open ? "btn-dark" : "btn-light"}`}
                        aria-expanded={open}
                        aria-controls="catalog-filters"
                    >
                        <FilterIcon className="h-4 w-4" />
                        {open ? "Скрыть" : "Фильтры"}
                        {activeChips > 0 ? (
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums ${
                                    open
                                        ? "bg-white/15 text-white"
                                        : "bg-accent text-accent-ink"
                                }`}
                            >
                                {activeChips}
                            </span>
                        ) : null}
                    </button>
                    {activeChips > 0 ? (
                        <button
                            type="button"
                            onClick={reset}
                            className="text-[13px] text-accent hover:underline"
                        >
                            Сбросить
                        </button>
                    ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* поиск слева от сортировки */}
                    <div className="relative min-w-[160px] flex-1 sm:min-w-[200px] sm:flex-none sm:w-[240px]">
                        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                        <input
                            className="field !py-2 !pl-9 text-sm"
                            placeholder="название, площадь…"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            suppressHydrationWarning
                            aria-label="Поиск проектов"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-ink-700">
                        <SortIcon className="h-4 w-4 text-ink-500" />
                        <span className="hidden sm:inline">Сортировка:</span>
                        <select
                            className="field field-select !w-auto !py-2 !pr-9 text-sm"
                            value={sort}
                            onChange={(e) =>
                                setSort(e.target.value as SortMode)
                            }
                        >
                            <option value="recommended">по площади</option>
                            <option value="priceAsc">цена ↑</option>
                            <option value="priceDesc">цена ↓</option>
                            <option value="areaAsc">площадь ↑</option>
                            <option value="areaDesc">площадь ↓</option>
                        </select>
                    </label>

                    {/* list / grid как у GWD */}
                    <div
                        className="inline-flex rounded-xl border border-ink-150 bg-white p-0.5"
                        role="group"
                        aria-label="Вид списка"
                    >
                        <button
                            type="button"
                            onClick={() => setView("wide")}
                            className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                                view === "wide"
                                    ? "bg-ink-950 text-white"
                                    : "text-ink-500 hover:text-ink-950"
                            }`}
                            aria-pressed={view === "wide"}
                            title="Широкие карточки"
                            aria-label="Широкие карточки"
                        >
                            <ListViewIcon className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setView("grid")}
                            className={`grid h-9 w-9 place-items-center rounded-lg transition ${
                                view === "grid"
                                    ? "bg-ink-950 text-white"
                                    : "text-ink-500 hover:text-ink-950"
                            }`}
                            aria-pressed={view === "grid"}
                            title="Сетка"
                            aria-label="Сетка"
                        >
                            <GridViewIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                    <button
                        key={p.key}
                        type="button"
                        onClick={() => applyPreset(p.apply)}
                        className="chip chip-btn !px-2.5 !py-1 !text-[12px]"
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div
                className={`grid gap-5 ${
                    open
                        ? "lg:grid-cols-[300px_minmax(0,1fr)]"
                        : "grid-cols-1"
                }`}
            >
                {open ? (
                    <aside id="catalog-filters" className="hidden lg:block">
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
                                    Фильтры
                                </div>
                                <div className="mt-0.5 text-[12px] text-ink-500">
                                    {sorted.length}{" "}
                                    {projectsWord(sorted.length)}
                                </div>
                            </div>
                            {FilterBody}
                        </div>
                    </aside>
                ) : null}

                <div className="min-w-0">
                    {sorted.length === 0 ? (
                        <EmptyState onReset={reset} />
                    ) : view === "wide" ? (
                        <div className="flex flex-col gap-4">
                            {sorted.map((p, i) => (
                                <ProjectCard
                                    key={p.slug}
                                    project={p}
                                    layout="wide"
                                    priority={i < 2}
                                />
                            ))}
                        </div>
                    ) : (
                        <div
                            className={`grid gap-5 ${
                                open
                                    ? "sm:grid-cols-2 xl:grid-cols-2"
                                    : "sm:grid-cols-2 xl:grid-cols-3"
                            }`}
                        >
                            {sorted.map((p, i) => (
                                <ProjectCard
                                    key={p.slug}
                                    project={p}
                                    layout="grid"
                                    priority={i < 2}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile / tablet: full-height sheet with all filters */}
            {open ? (
                <div
                    className="fixed inset-0 z-50 flex items-end bg-black/55 lg:hidden"
                    onClick={() => setOpen(false)}
                >
                    <div
                        id="catalog-filters-mobile"
                        className="flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-lift"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-shrink-0 items-center justify-between border-b border-ink-150 px-5 py-4">
                            <div>
                                <div className="font-display text-lg font-extrabold">
                                    Фильтры
                                </div>
                                <div className="text-[12px] text-ink-500">
                                    {sorted.length}{" "}
                                    {projectsWord(sorted.length)}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Закрыть"
                                className="grid h-10 w-10 place-items-center rounded-full border border-ink-150"
                            >
                                <CloseIcon className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                            {FilterBody}
                        </div>
                        <div className="flex-shrink-0 border-t border-ink-150 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="btn btn-primary btn-lg w-full"
                            >
                                Показать {sorted.length}{" "}
                                {projectsWord(sorted.length)}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

function EmptyState({ onReset }: { onReset: () => void }) {
    return (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink-50 text-ink-500">
                <FilterIcon className="h-6 w-6" />
            </div>
            <div className="mt-4 font-display text-lg font-extrabold">
                Ничего не нашлось
            </div>
            <p className="mt-2 text-sm text-ink-500">
                Попробуйте ослабить фильтры или сбросить всё
            </p>
            <button
                type="button"
                onClick={onReset}
                className="btn btn-light mt-4"
            >
                Сбросить фильтры
            </button>
        </div>
    );
}

function FilterGroup({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="mb-2.5 text-[12px] font-semibold uppercase tracking-wider text-ink-500">
                {label}
            </div>
            {children}
        </div>
    );
}

function FilterCheckbox({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-[14px] text-ink-700 hover:text-ink-950">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="h-4 w-4 accent-accent"
            />
            <span>{label}</span>
        </label>
    );
}

function RangeSlider({
    min,
    max,
    step,
    from,
    to,
    onChange,
}: {
    min: number;
    max: number;
    step: number;
    from: number;
    to: number;
    onChange: (from: number, to: number) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <label className="text-[12px] text-ink-500">
                от
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={from}
                    onChange={(e) =>
                        onChange(
                            Math.min(parseInt(e.target.value), to - step),
                            to,
                        )
                    }
                    className="mt-1 w-full accent-accent"
                    suppressHydrationWarning
                />
            </label>
            <label className="text-[12px] text-ink-500">
                до
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={to}
                    onChange={(e) =>
                        onChange(
                            from,
                            Math.max(parseInt(e.target.value), from + step),
                        )
                    }
                    className="mt-1 w-full accent-accent"
                    suppressHydrationWarning
                />
            </label>
        </div>
    );
}

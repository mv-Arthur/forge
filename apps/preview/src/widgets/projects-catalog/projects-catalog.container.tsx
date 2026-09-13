"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { MergedProject, Technology } from "@/types/catalog";
import { ProjectCard } from "@/widgets/project-card/project-card";
import { formatTechnologyBrand, projectsWord } from "@/lib/format";
import {
    countActiveFilters,
    CATALOG_KINDS,
    openCatalogFilter,
    parseCatalogKinds,
    projectClass,
    projectPassesCatalogFilter,
    type CatalogFilterState,
    type CatalogKind,
} from "@/lib/catalogFilter";
import {
    HIT_SALES,
    HIT_SALES_LEAD,
    LINE_ALL,
    LINE_LEAD,
    LINE_TITLE,
    POPULAR_BATH_LEAD,
    POPULAR_BATH_TAB,
    POPULAR_INDIVIDUAL_LEAD,
    POPULAR_INDIVIDUAL_TAB,
    POPULAR_SERIAL_TAB,
} from "@/lib/copy";
import { isCollectionId } from "@/lib/collections";
import { LINE_ORDER, groupByLine, parseLineIds, type LineId } from "@/lib/lines";
import {
    clearActiveFilterTag,
    listActiveFilterTags,
} from "./lib/active-tags";
import { ProjectsCatalogSection } from "./__section/projects-catalog__section";
import {
    ChevronDownIcon,
    CloseIcon,
    FilterIcon,
    GridViewIcon,
    ListViewIcon,
    SearchIcon,
    TrashIcon,
} from "@/ui/icons";
import {
    ProjectsCatalogSort,
    type CatalogSortMode,
} from "./__sort/projects-catalog__sort";

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
    { value: "2", label: "2 этажа" },
    { value: "mansard", label: "С мансардой" },
];

interface Props {
    projects: MergedProject[];
    bounds: { maxArea: number; maxPrice: number };
    promo?: ReactNode;
    consult?: ReactNode;
}

const TECH_SET = new Set<string>(TECH_OPTIONS);

export function ProjectsCatalogContainer({
    projects,
    bounds,
    promo,
    consult,
}: Props) {
    const searchParams = useSearchParams();
    const catalogOpen = openCatalogFilter(bounds);
    const [state, setState] = useState<FiltersState>(catalogOpen);
    const [sort, setSort] = useState<CatalogSortMode>("areaDesc");
    const [open, setOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
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
        const collection = searchParams.get("collection");
        if (collection && isCollectionId(collection)) {
            next.collection = collection;
        }
        const kinds = parseCatalogKinds(searchParams.get("kind"));
        if (kinds.length) next.kind = kinds;
        const lines = parseLineIds(searchParams.get("line"));
        if (lines.length) next.lines = lines;
        if (Object.keys(next).length) {
            setState((s) => ({ ...s, ...next }));
            setOpen(true);
        }
    }, [searchParams]);

    const filtered = useMemo(() => {
        return projects.filter((p) => projectPassesCatalogFilter(p, state, q));
    }, [projects, state, q]);

    const sorted = useMemo(() => {
        const arr = [...filtered];
        const priceOf = (p: MergedProject) => p.priceFrom ?? 0;
        switch (sort) {
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

    const allKindsOn = state.kind.length === 0;
    const hitsTop = useMemo(() => {
        if (!allKindsOn) return [];
        const order = { serial: 0, individual: 1, bath: 2 };
        return sorted
            .filter((p) => p.detailFilled)
            .sort(
                (a, b) =>
                    (order[a.projectClass] ?? 9) - (order[b.projectClass] ?? 9),
            );
    }, [sorted, allKindsOn]);
    const listed = allKindsOn
        ? sorted.filter((p) => !p.detailFilled)
        : sorted;

    const activeChips =
        countActiveFilters(state, catalogOpen) + (q.trim() ? 1 : 0);
    const filterTags = useMemo(
        () => listActiveFilterTags(state, catalogOpen, q),
        [state, catalogOpen, q],
    );
    const reset = () => {
        setState(catalogOpen);
        setQ("");
    };
    const clearTag = (key: string) => {
        if (key === "q") {
            setQ("");
            return;
        }
        setState((s) => clearActiveFilterTag(s, catalogOpen, key));
    };

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
    const toggleNumber = (key: "rooms" | "baths", n: number) =>
        setState((s) => ({
            ...s,
            [key]: s[key].includes(n)
                ? s[key].filter((x) => x !== n)
                : [...s[key], n],
        }));
    const kindOn = (kind: CatalogKind) =>
        state.kind.length === 0 || state.kind.includes(kind);
    const toggleKind = (kind: CatalogKind) =>
        setState((s) => {
            const allOn = s.kind.length === 0;
            const on = allOn || s.kind.includes(kind);
            if (on) {
                const current = allOn ? CATALOG_KINDS : s.kind;
                return {
                    ...s,
                    kind: current.filter((x) => x !== kind),
                    lines: kind === "serial" ? [] : s.lines,
                };
            }
            const next = [...s.kind, kind];
            if (CATALOG_KINDS.every((k) => next.includes(k))) {
                return { ...s, kind: [], lines: [] };
            }
            return { ...s, kind: next };
        });
    const toggleLine = (id: LineId) =>
        setState((s) => {
            const on = s.lines.includes(id);
            const lines = on
                ? s.lines.filter((x) => x !== id)
                : [...s.lines, id];
            const kind: CatalogKind[] =
                !on && !s.kind.includes("serial")
                    ? [...s.kind, "serial"]
                    : s.kind;
            return { ...s, lines, kind };
        });
    const clearLines = () => setState((s) => ({ ...s, lines: [] }));
    const FilterBody = (
        <div className="space-y-2.5">
            <FilterGroup
                label="Тип проекта"
                active={state.kind.length > 0 || state.lines.length > 0}
            >
                <LineDropdown
                    serialOn={kindOn("serial")}
                    onToggleSerial={() => toggleKind("serial")}
                    lines={state.lines}
                    onToggleLine={toggleLine}
                    onClearLines={clearLines}
                />
                <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-ink-800 hover:bg-white/80">
                    <input
                        type="checkbox"
                        checked={kindOn("individual")}
                        onChange={() => toggleKind("individual")}
                        className="h-4 w-4 shrink-0 accent-accent"
                    />
                    {POPULAR_INDIVIDUAL_TAB}
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1.5 text-sm text-ink-800 hover:bg-white/80">
                    <input
                        type="checkbox"
                        checked={kindOn("bath")}
                        onChange={() => toggleKind("bath")}
                        className="h-4 w-4 shrink-0 accent-accent"
                    />
                    {POPULAR_BATH_TAB}
                </label>
            </FilterGroup>

            <FilterGroup
                label="Технология строительства"
                active={state.tech.length > 0}
            >
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
                active={
                    state.areaMin !== catalogOpen.areaMin ||
                    state.areaMax !== catalogOpen.areaMax
                }
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
                <RangePresets
                    from={state.areaMin}
                    to={state.areaMax}
                    openFrom={catalogOpen.areaMin}
                    openTo={catalogOpen.areaMax}
                    presets={[
                        { key: "to200", label: "до 200 м²", min: 0, max: 200 },
                        {
                            key: "200to500",
                            label: "от 200 м² до 500 м²",
                            min: 200,
                            max: 500,
                        },
                        {
                            key: "from500",
                            label: "более 500 м²",
                            min: 500,
                            max: catalogOpen.areaMax,
                        },
                    ]}
                    onApply={(min, max) =>
                        setState((s) => ({ ...s, areaMin: min, areaMax: max }))
                    }
                />
            </FilterGroup>

            <FilterGroup
                label={`Цена: ${state.priceMin}–${state.priceMax} млн ₽`}
                active={
                    state.priceMin !== catalogOpen.priceMin ||
                    state.priceMax !== catalogOpen.priceMax
                }
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
                <RangePresets
                    from={state.priceMin}
                    to={state.priceMax}
                    openFrom={catalogOpen.priceMin}
                    openTo={catalogOpen.priceMax}
                    presets={[
                        {
                            key: "to11",
                            label: "до 11 млн ₽",
                            min: 0,
                            max: 11,
                        },
                        {
                            key: "from11",
                            label: "более 11 млн ₽",
                            min: 11,
                            max: catalogOpen.priceMax,
                        },
                    ]}
                    onApply={(min, max) =>
                        setState((s) => ({
                            ...s,
                            priceMin: min,
                            priceMax: max,
                        }))
                    }
                />
            </FilterGroup>

            <FilterGroup label="Этажность" active={state.floors.length > 0}>
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

            <FilterGroup label="Жилые комнаты" active={state.rooms.length > 0}>
                <FilterNumberRow
                    values={[1, 2, 3, 4, 5, 6, 7]}
                    plusFrom={7}
                    selected={state.rooms}
                    onToggle={(n) => toggleNumber("rooms", n)}
                />
            </FilterGroup>

            <FilterGroup label="Санузлы" active={state.baths.length > 0}>
                <FilterNumberRow
                    values={[1, 2, 3, 4, 5, 6]}
                    plusFrom={6}
                    selected={state.baths}
                    onToggle={(n) => toggleNumber("baths", n)}
                />
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

    const toolbar = (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-3 border-b border-ink-150 pb-3">
                <div className="flex w-full min-w-0 flex-1 basis-full flex-wrap items-center gap-2 sm:flex-nowrap">
                    <div className="relative min-w-0 w-full flex-1 basis-full sm:basis-0">
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

                    <div className="flex shrink-0 items-center gap-2">
                        <ProjectsCatalogSort value={sort} onChange={setSort} />

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

                <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-3">
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
                        onClick={() => {
                            if (
                                window.matchMedia("(min-width: 1024px)").matches
                            ) {
                                setOpen((v) => !v);
                            } else {
                                setMobileOpen(true);
                            }
                        }}
                        className={`btn btn-sm ${open ? "btn-dark" : "btn-light"} max-lg:!bg-white max-lg:!text-ink-950 max-lg:!shadow-none`}
                        aria-expanded={open || mobileOpen}
                        aria-controls="catalog-filters"
                    >
                        <FilterIcon className="h-4 w-4" />
                        <span className="lg:hidden">Фильтры</span>
                        <span className="hidden lg:inline">
                            {open ? "Скрыть" : "Фильтры"}
                        </span>
                        {activeChips > 0 ? (
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-xs font-bold tabular-nums ${
                                    open
                                        ? "bg-white/15 text-white max-lg:!bg-accent max-lg:!text-accent-ink"
                                        : "bg-accent text-accent-ink"
                                }`}
                            >
                                {activeChips}
                            </span>
                        ) : null}
                    </button>
                </div>
            </div>

            {filterTags.length > 0 ? (
                <div className="mb-5 flex flex-wrap items-center gap-2">
                    {filterTags.map((tag) => (
                        <button
                            key={tag.key}
                            type="button"
                            onClick={() => clearTag(tag.key)}
                            className="chip chip-btn px-3.5 py-2 text-sm"
                            aria-label={`Убрать фильтр: ${tag.label}`}
                        >
                            {tag.label}
                            <CloseIcon className="h-4 w-4" />
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-accent-soft px-3.5 py-2 text-sm font-semibold text-accent hover:bg-accent hover:text-accent-ink"
                    >
                        Сбросить
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            ) : null}
        </div>
    );

    return (
        <div>
            <div
                className={`grid gap-5 ${
                    open ? "lg:grid-cols-[380px_minmax(0,1fr)]" : "grid-cols-1"
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
                            {FilterBody}
                        </div>
                    </aside>
                ) : null}

                <div className="min-w-0">
                    {toolbar}
                    {promo ? (
                        <div key="catalog-promo">{promo}</div>
                    ) : null}
                    {sorted.length === 0 ? (
                        <EmptyState onReset={reset} />
                    ) : (
                        <>
                            {hitsTop.length > 0 ? (
                                <ProjectsCatalogSection
                                    key="hits"
                                    title={HIT_SALES}
                                    lead={HIT_SALES_LEAD}
                                >
                                    <LineCards
                                        projects={hitsTop}
                                        view={view}
                                        dense={open}
                                    />
                                </ProjectsCatalogSection>
                            ) : null}
                            {groupByLine(
                                pinFilled(
                                    listed.filter(
                                        (p) => projectClass(p) === "serial",
                                    ),
                                ),
                            ).map((group) => (
                                <ProjectsCatalogSection
                                    key={group.id}
                                    title={LINE_TITLE[group.id]}
                                    lead={LINE_LEAD[group.id]}
                                >
                                    <LineCards
                                        projects={pinFilled(group.projects)}
                                        view={view}
                                        dense={open}
                                    />
                                </ProjectsCatalogSection>
                            ))}
                            {listed.some(
                                (p) => projectClass(p) === "individual",
                            ) ? (
                                <ProjectsCatalogSection
                                    key="individual"
                                    title={POPULAR_INDIVIDUAL_TAB}
                                    lead={POPULAR_INDIVIDUAL_LEAD}
                                >
                                    <LineCards
                                        projects={pinFilled(
                                            listed.filter(
                                                (p) =>
                                                    projectClass(p) ===
                                                    "individual",
                                            ),
                                        )}
                                        view={view}
                                        dense={open}
                                    />
                                </ProjectsCatalogSection>
                            ) : null}
                            {listed.some((p) => projectClass(p) === "bath") ? (
                                <ProjectsCatalogSection
                                    key="bath"
                                    title={POPULAR_BATH_TAB}
                                    lead={POPULAR_BATH_LEAD}
                                >
                                    <LineCards
                                        projects={pinFilled(
                                            listed.filter(
                                                (p) =>
                                                    projectClass(p) === "bath",
                                            ),
                                        )}
                                        view={view}
                                        dense={open}
                                    />
                                </ProjectsCatalogSection>
                            ) : null}
                        </>
                    )}
                    {consult ? (
                        <div key="catalog-consult">{consult}</div>
                    ) : null}
                </div>
            </div>

            {/* Mobile / tablet: full-height sheet with all filters */}
            {mobileOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-end bg-black/55 lg:hidden"
                    onClick={() => setMobileOpen(false)}
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
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
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
                                onClick={() => setMobileOpen(false)}
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

function pinFilled(projects: MergedProject[]): MergedProject[] {
    const hits = projects.filter((p) => p.detailFilled);
    const rest = projects.filter((p) => !p.detailFilled);
    return hits.length ? [...hits, ...rest] : projects;
}

function LineCards({
    projects,
    view,
    dense,
}: {
    projects: MergedProject[];
    view: "wide" | "grid";
    dense: boolean;
}) {
    if (view === "wide" || projects.length === 1) {
        return (
            <div className="flex flex-col gap-4">
                {projects.map((p, i) => (
                    <ProjectCard
                        key={p.slug}
                        project={p}
                        layout="wide"
                        priority={i < 1}
                    />
                ))}
            </div>
        );
    }
    return (
        <div
            className={`grid gap-5 ${
                dense ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3"
            }`}
        >
            {projects.map((p, i) => (
                <ProjectCard
                    key={p.slug}
                    project={p}
                    layout="grid"
                    priority={i < 2}
                />
            ))}
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

function FilterNumberRow({
    values,
    plusFrom,
    selected,
    onToggle,
}: {
    values: number[];
    plusFrom?: number;
    selected: number[];
    onToggle: (n: number) => void;
}) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {values.map((n) => {
                const on = selected.includes(n);
                const label =
                    plusFrom != null && n >= plusFrom ? `${n}+` : String(n);
                return (
                    <button
                        key={n}
                        type="button"
                        onClick={() => onToggle(n)}
                        className={
                            "grid h-9 w-9 shrink-0 place-items-center rounded-full font-medium tabular-nums transition " +
                            (label.length > 1 ? "text-[11px]" : "text-sm") +
                            " " +
                            (on
                                ? "bg-accent text-white"
                                : "bg-white text-ink-500 hover:text-ink-950")
                        }
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}

function LineDropdown({
    serialOn,
    onToggleSerial,
    lines,
    onToggleLine,
    onClearLines,
}: {
    serialOn: boolean;
    onToggleSerial: () => void;
    lines: LineId[];
    onToggleLine: (id: LineId) => void;
    onClearLines: () => void;
}) {
    const [open, setOpen] = useState(lines.length > 0);

    const toggleOpen = () => {
        setOpen((v) => {
            const next = !v;
            if (next && !serialOn) onToggleSerial();
            return next;
        });
    };

    return (
        <div>
            <div className="flex items-center gap-1 rounded-lg hover:bg-white/80">
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 px-1 py-1.5 text-sm text-ink-800">
                    <input
                        type="checkbox"
                        checked={serialOn}
                        onChange={onToggleSerial}
                        className="h-4 w-4 shrink-0 accent-accent"
                    />
                    {POPULAR_SERIAL_TAB}
                </label>
                <button
                    type="button"
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-500 hover:bg-white hover:text-ink-950"
                    aria-expanded={open}
                    aria-label="Линейки"
                    onClick={toggleOpen}
                >
                    <ChevronDownIcon
                        className={`h-4 w-4 transition ${
                            open ? "rotate-180" : ""
                        }`}
                    />
                </button>
            </div>
            {open ? (
                <div className="ml-6 mt-0.5 space-y-0.5">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm text-ink-700 hover:bg-white/80">
                        <input
                            type="checkbox"
                            checked={lines.length === 0}
                            onChange={onClearLines}
                            className="h-4 w-4 shrink-0 accent-accent"
                        />
                        {LINE_ALL}
                    </label>
                    {LINE_ORDER.map((id) => (
                        <label
                            key={id}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm text-ink-700 hover:bg-white/80"
                        >
                            <input
                                type="checkbox"
                                checked={lines.includes(id)}
                                onChange={() => onToggleLine(id)}
                                className="h-4 w-4 shrink-0 accent-accent"
                            />
                            {LINE_TITLE[id]}
                        </label>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

function FilterGroup({
    label,
    active,
    children,
}: {
    label: string;
    active?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div
            className={
                "rounded-xl border p-3 " +
                (active
                    ? "border-accent/40 bg-accent-soft"
                    : "border-ink-150 bg-ink-50/80")
            }
        >
            <div
                className={
                    "mb-2.5 text-[12px] font-semibold uppercase tracking-wider " +
                    (active ? "text-accent" : "text-ink-500")
                }
            >
                {label}
            </div>
            {children}
        </div>
    );
}

function RangePresets({
    presets,
    from,
    to,
    openFrom,
    openTo,
    onApply,
}: {
    presets: Array<{ key: string; label: string; min: number; max: number }>;
    from: number;
    to: number;
    openFrom: number;
    openTo: number;
    onApply: (min: number, max: number) => void;
}) {
    return (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
            {presets.map((preset) => {
                const on = from === preset.min && to === preset.max;
                return (
                    <button
                        key={preset.key}
                        type="button"
                        onClick={() =>
                            on
                                ? onApply(openFrom, openTo)
                                : onApply(preset.min, preset.max)
                        }
                        className={`chip chip-btn !px-2.5 !py-1 !text-[12px] ${
                            on ? "chip-active" : ""
                        }`}
                    >
                        {preset.label}
                    </button>
                );
            })}
        </div>
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
                            to
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
                            Math.max(parseInt(e.target.value), from + step)
                        )
                    }
                    className="mt-1 w-full accent-accent"
                    suppressHydrationWarning
                />
            </label>
        </div>
    );
}

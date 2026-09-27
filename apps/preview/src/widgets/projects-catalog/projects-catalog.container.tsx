"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import type { MergedProject, Technology } from "@/types/catalog";
import { ProjectCard } from "@/widgets/project-card/project-card";
import { formatTechnologyBrand, projectsWord } from "@/lib/format";
import {
    countActiveFilters,
    catalogKindOn,
    isAllCatalogKinds,
    openCatalogFilter,
    parseCatalogKinds,
    projectPassesCatalogFilter,
    toggleCatalogKind,
    type CatalogFilterState,
    type CatalogKind,
} from "@/lib/catalogFilter";
import {
    LINE_ALL,
    LINE_TITLE,
    POPULAR_BATH_TAB,
    POPULAR_INDIVIDUAL_TAB,
    POPULAR_SERIAL_TAB,
} from "@/lib/copy";
import { isCollectionId } from "@/lib/collections";
import { LINE_ORDER, parseLineIds, type LineId } from "@/lib/lines";
import { parseCatalogTechs } from "@/lib/techFamily";
import { clearActiveFilterTag, listActiveFilterTags } from "./lib/active-tags";
import { buildCatalogSections } from "./lib/sections";
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
import ui from "./projects-catalog__ui.module.css";

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
        const techs = parseCatalogTechs(searchParams.get("tech"));
        if (techs.length) next.tech = techs;
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

    const sections = useMemo(
        () => buildCatalogSections(sorted, state.kind),
        [sorted, state.kind]
    );

    const activeChips =
        countActiveFilters(state, catalogOpen) + (q.trim() ? 1 : 0);
    const filterTags = useMemo(
        () => listActiveFilterTags(state, catalogOpen, q),
        [state, catalogOpen, q]
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
    const kindOn = (kind: CatalogKind) => catalogKindOn(state.kind, kind);
    const toggleKind = (kind: CatalogKind) =>
        setState((s) => {
            const next = toggleCatalogKind(s.kind, kind);
            const lines = isAllCatalogKinds(next)
                ? isAllCatalogKinds(s.kind)
                    ? s.lines
                    : []
                : catalogKindOn(next, "serial")
                  ? s.lines
                  : [];
            return { ...s, kind: next, lines };
        });
    const toggleLine = (id: LineId) =>
        setState((s) => {
            const on = s.lines.includes(id);
            const lines = on
                ? s.lines.filter((x) => x !== id)
                : [...s.lines, id];
            const kind: CatalogKind[] =
                !on && !catalogKindOn(s.kind, "serial")
                    ? [...s.kind, "serial"]
                    : s.kind;
            return { ...s, lines, kind };
        });
    const clearLines = () => setState((s) => ({ ...s, lines: [] }));
    const FilterBody = (
        <div className={ui.stack}>
            <FilterGroup
                label="Тип проекта"
                active={
                    !isAllCatalogKinds(state.kind) || state.lines.length > 0
                }
            >
                <LineDropdown
                    serialOn={kindOn("serial")}
                    onToggleSerial={() => toggleKind("serial")}
                    lines={state.lines}
                    onToggleLine={toggleLine}
                    onClearLines={clearLines}
                />
                <label className={ui.checkRow}>
                    <input
                        type="checkbox"
                        checked={kindOn("individual")}
                        onChange={() => toggleKind("individual")}
                        className={ui.check}
                    />
                    {POPULAR_INDIVIDUAL_TAB}
                </label>
                <label className={ui.checkRow}>
                    <input
                        type="checkbox"
                        checked={kindOn("bath")}
                        onChange={() => toggleKind("bath")}
                        className={ui.check}
                    />
                    {POPULAR_BATH_TAB}
                </label>
            </FilterGroup>

            <FilterGroup
                label="Технология строительства"
                active={state.tech.length > 0}
            >
                <div className={ui.chips}>
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
                <div className={ui.chips}>
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
                    className={`btn btn-ghost ${ui.reset}`}
                >
                    Сбросить всё ({activeChips})
                </button>
            ) : null}
        </div>
    );

    const toolbar = (
        <div>
            <div className={ui.toolbar}>
                <div className={ui.searchRow}>
                    <div className={ui.searchWrap}>
                        <SearchIcon className={ui.searchIcon} />
                        <input
                            className={`field ${ui.searchField}`}
                            placeholder="название, площадь…"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            suppressHydrationWarning
                            aria-label="Поиск проектов"
                        />
                    </div>

                    <div className={ui.sortRow}>
                        <ProjectsCatalogSort value={sort} onChange={setSort} />

                        <div
                            className={ui.viewToggle}
                            role="group"
                            aria-label="Вид списка"
                        >
                            <button
                                type="button"
                                onClick={() => setView("wide")}
                                className={`${ui.viewBtn} ${
                                    view === "wide" ? ui.viewOn : ""
                                }`}
                                aria-pressed={view === "wide"}
                                title="Широкие карточки"
                                aria-label="Широкие карточки"
                            >
                                <ListViewIcon className={ui.icon} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setView("grid")}
                                className={`${ui.viewBtn} ${
                                    view === "grid" ? ui.viewOn : ""
                                }`}
                                aria-pressed={view === "grid"}
                                title="Сетка"
                                aria-label="Сетка"
                            >
                                <GridViewIcon className={ui.icon} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className={ui.metaRow}>
                    <div className={ui.found} data-found-count={sorted.length}>
                        Найдено <strong>{sorted.length}</strong>{" "}
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
                        className={`btn btn-sm ${open ? "btn-dark" : "btn-light"} ${ui.filterBtn}`}
                        aria-expanded={open || mobileOpen}
                        aria-controls="catalog-filters"
                    >
                        <FilterIcon className={ui.icon} />
                        <span className={ui.filterLabelMobile}>Фильтры</span>
                        <span className={ui.filterLabelDesktop}>
                            {open ? "Скрыть" : "Фильтры"}
                        </span>
                        {activeChips > 0 ? (
                            <span
                                className={`${ui.count} ${open ? ui.countOn : ""}`}
                            >
                                {activeChips}
                            </span>
                        ) : null}
                    </button>
                </div>
            </div>

            {filterTags.length > 0 ? (
                <div className={ui.tags}>
                    {filterTags.map((tag) => (
                        <button
                            key={tag.key}
                            type="button"
                            onClick={() => clearTag(tag.key)}
                            className={`chip chip-btn ${ui.chipTag}`}
                            aria-label={`Убрать фильтр: ${tag.label}`}
                        >
                            {tag.label}
                            <CloseIcon className={ui.icon} />
                        </button>
                    ))}
                    <button type="button" onClick={reset} className={ui.clear}>
                        Сбросить
                        <TrashIcon className={ui.icon} />
                    </button>
                </div>
            ) : null}
        </div>
    );

    return (
        <div>
            <div className={`${ui.layout} ${open ? ui.layoutOpen : ""}`}>
                {open ? (
                    <aside id="catalog-filters" className={ui.aside}>
                        <div
                            className={`filters-scroll ${ui.panel}`}
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

                <div className={ui.mainCol}>
                    {toolbar}
                    {promo ? <div key="catalog-promo">{promo}</div> : null}
                    {sorted.length === 0 ? (
                        <EmptyState onReset={reset} />
                    ) : (
                        sections.map((section) => (
                            <ProjectsCatalogSection
                                key={section.key}
                                title={section.title}
                                lead={section.lead}
                            >
                                <LineCards
                                    projects={section.projects}
                                    view={view}
                                    dense={open}
                                />
                            </ProjectsCatalogSection>
                        ))
                    )}
                    {consult ? (
                        <div key="catalog-consult">{consult}</div>
                    ) : null}
                </div>
            </div>

            {/* Mobile / tablet: full-height sheet with all filters */}
            {mobileOpen ? (
                <div className={ui.drawer} onClick={() => setMobileOpen(false)}>
                    <div
                        id="catalog-filters-mobile"
                        className={ui.sheet}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={ui.sheetHead}>
                            <div>
                                <div className={ui.sheetTitle}>Фильтры</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Закрыть"
                                className={ui.sheetClose}
                            >
                                <CloseIcon className={ui.icon} />
                            </button>
                        </div>
                        <div className={ui.sheetBody}>{FilterBody}</div>
                        <div className={ui.sheetFoot}>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className={`btn btn-primary btn-lg ${ui.full}`}
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
            <div className={ui.wideList}>
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
        <div className={`${ui.gridList} ${dense ? "" : ui.gridListWide}`}>
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
        <div className={ui.empty}>
            <div className={ui.emptyIcon}>
                <FilterIcon className={ui.iconLg} />
            </div>
            <div className={ui.emptyTitle}>Ничего не нашлось</div>
            <p className={ui.emptyText}>
                Попробуйте ослабить фильтры или сбросить всё
            </p>
            <button
                type="button"
                onClick={onReset}
                className={`btn btn-light ${ui.emptyBtn}`}
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
        <div className={ui.chips}>
            {values.map((n) => {
                const on = selected.includes(n);
                const label =
                    plusFrom != null && n >= plusFrom ? `${n}+` : String(n);
                return (
                    <button
                        key={n}
                        type="button"
                        onClick={() => onToggle(n)}
                        className={`${ui.num} ${on ? ui.numOn : ""} ${
                            label.length > 1 ? ui.numSm : ""
                        }`}
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
            <div className={ui.lineRow}>
                <label className={ui.lineCheck}>
                    <input
                        type="checkbox"
                        checked={serialOn}
                        onChange={onToggleSerial}
                        className={ui.check}
                    />
                    {POPULAR_SERIAL_TAB}
                </label>
                <button
                    type="button"
                    className={ui.chevronBtn}
                    aria-expanded={open}
                    aria-label="Линейки"
                    onClick={toggleOpen}
                >
                    <ChevronDownIcon
                        className={`${ui.chevron} ${open ? ui.chevronOpen : ""}`}
                    />
                </button>
            </div>
            {open ? (
                <div className={ui.lines}>
                    <label className={`${ui.checkRow} ${ui.checkRowSm}`}>
                        <input
                            type="checkbox"
                            checked={lines.length === 0}
                            onChange={onClearLines}
                            className={ui.check}
                        />
                        {LINE_ALL}
                    </label>
                    {LINE_ORDER.map((id) => (
                        <label
                            key={id}
                            className={`${ui.checkRow} ${ui.checkRowSm}`}
                        >
                            <input
                                type="checkbox"
                                checked={lines.includes(id)}
                                onChange={() => onToggleLine(id)}
                                className={ui.check}
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
        <div className={`${ui.group} ${active ? ui.groupOn : ""}`}>
            <div className={ui.groupLabel}>{label}</div>
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
        <div className={ui.presets}>
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
                        className={`chip chip-btn ${ui.chipPreset} ${
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
        <div className={ui.ranges}>
            <label className={ui.rangeLabel}>
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
                    className={ui.range}
                    suppressHydrationWarning
                />
            </label>
            <label className={ui.rangeLabel}>
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
                    className={ui.range}
                    suppressHydrationWarning
                />
            </label>
        </div>
    );
}

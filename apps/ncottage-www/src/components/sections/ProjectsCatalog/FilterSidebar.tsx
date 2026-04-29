"use client";

import { useState } from "react";
import {
    PROJECT_FEATURE_LABELS,
    PROJECT_LIVING_TYPE_LABELS,
    PROJECT_STYLE_LABELS,
    PROJECT_TECHNOLOGY_LABELS,
} from "@/lib/constants";
import type {
    ProjectFeature,
    ProjectLivingType,
    ProjectStyle,
    Technology,
} from "@/types/project";
import { RangeSlider } from "./RangeSlider";
import type {
    FilterBounds,
    FiltersState,
} from "./useProjectsFilter";
import styles from "./FilterSidebar.module.css";

interface FilterSidebarProps {
    filters: FiltersState;
    bounds: FilterBounds;
    sizeOptions: string[];
    onChange: (patch: Partial<FiltersState>) => void;
    onReset: () => void;
}

interface FilterGroupProps {
    title: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

function FilterGroup({ title, defaultOpen = true, children }: FilterGroupProps) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className={styles.group}>
            <button
                type="button"
                className={styles.groupHeader}
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
            >
                <span>{title}</span>
                <span
                    className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
                    aria-hidden="true"
                />
            </button>
            {open && <div className={styles.groupBody}>{children}</div>}
        </div>
    );
}

interface ChipsProps<T extends string | number> {
    options: { value: T; label: string }[];
    selected: T[];
    onChange: (next: T[]) => void;
}

function Chips<T extends string | number>({
    options,
    selected,
    onChange,
}: ChipsProps<T>) {
    function toggle(value: T) {
        if (selected.includes(value)) {
            onChange(selected.filter((v) => v !== value));
        } else {
            onChange([...selected, value]);
        }
    }
    return (
        <div className={styles.chips}>
            {options.map((opt) => {
                const active = selected.includes(opt.value);
                return (
                    <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => toggle(opt.value)}
                        className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                        aria-pressed={active}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}

const TECHNOLOGY_OPTIONS = (Object.keys(PROJECT_TECHNOLOGY_LABELS) as Technology[])
    .filter((t) =>
        ["gas-concrete", "brick", "frame", "sip", "fachwerk"].includes(t)
    )
    .map((value) => ({ value, label: PROJECT_TECHNOLOGY_LABELS[value] }));

const FLOOR_OPTIONS = [
    { value: 1, label: "1 этаж" },
    { value: 2, label: "2 этажа" },
];

const BEDROOM_OPTIONS = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4+" },
];

const BATHROOM_OPTIONS = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3+" },
];

const LIVING_TYPE_OPTIONS = (
    Object.keys(PROJECT_LIVING_TYPE_LABELS) as ProjectLivingType[]
).map((value) => ({ value, label: PROJECT_LIVING_TYPE_LABELS[value] }));

const STYLE_OPTIONS = (Object.keys(PROJECT_STYLE_LABELS) as ProjectStyle[]).map(
    (value) => ({ value, label: PROJECT_STYLE_LABELS[value] })
);

const FEATURE_OPTIONS = (
    Object.keys(PROJECT_FEATURE_LABELS) as ProjectFeature[]
).map((value) => ({ value, label: PROJECT_FEATURE_LABELS[value] }));

const formatPriceShort = (n: number) => {
    if (n >= 1_000_000) {
        const m = n / 1_000_000;
        return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)} млн ₽`;
    }
    return `${new Intl.NumberFormat("ru-RU").format(n)} ₽`;
};

export function FilterSidebar({
    filters,
    bounds,
    sizeOptions,
    onChange,
    onReset,
}: FilterSidebarProps) {
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <h2 className={styles.sidebarTitle}>Фильтры</h2>
                <button
                    type="button"
                    className={styles.resetButton}
                    onClick={onReset}
                >
                    Сбросить
                </button>
            </div>

            <FilterGroup title="Технология">
                <Chips
                    options={TECHNOLOGY_OPTIONS}
                    selected={filters.technology}
                    onChange={(technology) => onChange({ technology })}
                />
            </FilterGroup>

            <FilterGroup title="Этажность">
                <Chips
                    options={FLOOR_OPTIONS}
                    selected={filters.floors}
                    onChange={(floors) => onChange({ floors })}
                />
            </FilterGroup>

            <FilterGroup title="Размеры" defaultOpen={false}>
                <Chips
                    options={sizeOptions.map((s) => ({ value: s, label: s }))}
                    selected={filters.sizes}
                    onChange={(sizes) => onChange({ sizes })}
                />
            </FilterGroup>

            <FilterGroup title="Площадь, м²">
                <RangeSlider
                    min={bounds.areaMin}
                    max={bounds.areaMax}
                    step={10}
                    value={[filters.areaMin, filters.areaMax]}
                    onChange={([areaMin, areaMax]) =>
                        onChange({ areaMin, areaMax })
                    }
                    format={(n) => `${n} м²`}
                />
            </FilterGroup>

            <FilterGroup title="Цена">
                <RangeSlider
                    min={bounds.priceMin}
                    max={bounds.priceMax}
                    step={100_000}
                    value={[filters.priceMin, filters.priceMax]}
                    onChange={([priceMin, priceMax]) =>
                        onChange({ priceMin, priceMax })
                    }
                    format={formatPriceShort}
                />
            </FilterGroup>

            <FilterGroup title="Спальни" defaultOpen={false}>
                <Chips
                    options={BEDROOM_OPTIONS}
                    selected={filters.bedrooms}
                    onChange={(bedrooms) => onChange({ bedrooms })}
                />
            </FilterGroup>

            <FilterGroup title="Санузлы" defaultOpen={false}>
                <Chips
                    options={BATHROOM_OPTIONS}
                    selected={filters.bathrooms}
                    onChange={(bathrooms) => onChange({ bathrooms })}
                />
            </FilterGroup>

            <FilterGroup title="Тип проживания" defaultOpen={false}>
                <Chips
                    options={LIVING_TYPE_OPTIONS}
                    selected={filters.livingType}
                    onChange={(livingType) => onChange({ livingType })}
                />
            </FilterGroup>

            <FilterGroup title="Стиль" defaultOpen={false}>
                <Chips
                    options={STYLE_OPTIONS}
                    selected={filters.styles}
                    onChange={(styles) => onChange({ styles })}
                />
            </FilterGroup>

            <FilterGroup title="Особенности" defaultOpen={false}>
                <Chips
                    options={FEATURE_OPTIONS}
                    selected={filters.features}
                    onChange={(features) => onChange({ features })}
                />
            </FilterGroup>
        </div>
    );
}

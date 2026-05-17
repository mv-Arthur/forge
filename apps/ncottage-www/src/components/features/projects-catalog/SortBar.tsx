"use client";

import { SearchIcon } from "@/components/ui/icons";
import { Select } from "@/components/ui/Select";
import { FilterIcon, GridIcon, ListIcon } from "./icons";
import type { SortKey, ViewMode } from "./useProjectsFilter";
import styles from "./SortBar.module.css";

interface SortBarProps {
    search: string;
    sort: SortKey;
    view: ViewMode;
    count: number;
    onSearchChange: (value: string) => void;
    onSortChange: (value: SortKey) => void;
    onViewChange: (value: ViewMode) => void;
    onOpenFilters: () => void;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "featured", label: "Рекомендованные" },
    { value: "price-asc", label: "Сначала дешевле" },
    { value: "price-desc", label: "Сначала дороже" },
    { value: "area-asc", label: "Площадь: по возрастанию" },
    { value: "area-desc", label: "Площадь: по убыванию" },
];

export function SortBar({
    search,
    sort,
    view,
    count,
    onSearchChange,
    onSortChange,
    onViewChange,
    onOpenFilters,
}: SortBarProps) {
    return (
        <div className={styles.bar}>
            <button
                type="button"
                className={styles.filtersButton}
                onClick={onOpenFilters}
            >
                <FilterIcon />
                Фильтры
            </button>

            <Select
                options={SORT_OPTIONS}
                value={sort}
                onChange={(value) => onSortChange(value as SortKey)}
                className={styles.sortSelect}
                aria-label="Сортировка"
            />

            <div
                className={styles.viewToggle}
                role="group"
                aria-label="Вид сетки"
            >
                <button
                    type="button"
                    onClick={() => onViewChange("list")}
                    className={`${styles.viewButton} ${view === "list" ? styles.viewButtonActive : ""}`}
                    aria-pressed={view === "list"}
                    aria-label="В одну колонку"
                >
                    <ListIcon />
                </button>
                <button
                    type="button"
                    onClick={() => onViewChange("grid")}
                    className={`${styles.viewButton} ${view === "grid" ? styles.viewButtonActive : ""}`}
                    aria-pressed={view === "grid"}
                    aria-label="В две колонки"
                >
                    <GridIcon />
                </button>
            </div>

            <div className={styles.searchWrap}>
                <SearchIcon
                    className={styles.searchIcon}
                    width={18}
                    height={18}
                />
                <input
                    type="search"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Введите запрос, например, Норд"
                    className={styles.search}
                    aria-label="Поиск по названию"
                />
            </div>

            <span className={styles.count}>Найдено: {count}</span>
        </div>
    );
}

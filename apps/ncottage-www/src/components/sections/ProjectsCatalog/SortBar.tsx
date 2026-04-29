"use client";

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

function GridIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
        >
            <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
            <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
            <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" />
            <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" />
        </svg>
    );
}

function ListIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
        >
            <rect x="2" y="3" width="16" height="6" rx="1.5" fill="currentColor" />
            <rect x="2" y="11" width="16" height="6" rx="1.5" fill="currentColor" />
        </svg>
    );
}

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
                Фильтры
            </button>

            <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value as SortKey)}
                className={styles.sortSelect}
                aria-label="Сортировка"
            >
                {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            <div className={styles.viewToggle} role="group" aria-label="Вид сетки">
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
                <svg
                    className={styles.searchIcon}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden="true"
                >
                    <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
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

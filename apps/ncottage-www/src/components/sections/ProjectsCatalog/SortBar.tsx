"use client";

import type { SortKey } from "./useProjectsFilter";
import styles from "./SortBar.module.css";

interface SortBarProps {
    search: string;
    sort: SortKey;
    count: number;
    onSearchChange: (value: string) => void;
    onSortChange: (value: SortKey) => void;
    onOpenFilters: () => void;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: "featured", label: "По умолчанию" },
    { value: "price-asc", label: "Сначала дешевле" },
    { value: "price-desc", label: "Сначала дороже" },
    { value: "area-asc", label: "Площадь: по возрастанию" },
    { value: "area-desc", label: "Площадь: по убыванию" },
];

export function SortBar({
    search,
    sort,
    count,
    onSearchChange,
    onSortChange,
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
            <input
                type="search"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Поиск по названию..."
                className={styles.search}
                aria-label="Поиск по названию"
            />
            <span className={styles.count}>Найдено: {count}</span>
            <label className={styles.sortLabel}>
                <span className={styles.sortLabelText}>Сортировка:</span>
                <select
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value as SortKey)}
                    className={styles.sortSelect}
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}

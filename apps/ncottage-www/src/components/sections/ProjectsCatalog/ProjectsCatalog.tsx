"use client";

import { useEffect, useMemo, useState } from "react";
import * as React from "react";
import { ProductCard } from "@/components/shared/ProductCard";
import type { Project } from "@/types/project";
import { FilterSidebar } from "./FilterSidebar";
import { SortBar } from "./SortBar";
import {
    applyFilters,
    computeBounds,
    useProjectsFilter,
} from "./useProjectsFilter";
import styles from "./ProjectsCatalog.module.css";

interface ProjectsCatalogProps {
    projects: Project[];
}

export function ProjectsCatalog(props: ProjectsCatalogProps) {
    return (
        <React.Suspense fallback={<CatalogSkeleton />}>
            <ProjectsCatalogContent {...props} />
        </React.Suspense>
    );
}

function CatalogSkeleton() {
    return <div className={styles.loading}>Загрузка каталога…</div>;
}

function ProjectsCatalogContent({ projects }: ProjectsCatalogProps) {
    const bounds = useMemo(() => computeBounds(projects), [projects]);
    const sizeOptions = useMemo(() => {
        const set = new Set(projects.map((p) => p.specs.dimensions));
        return Array.from(set).sort((a, b) => {
            const [aw, ah] = a.split("x").map(Number);
            const [bw, bh] = b.split("x").map(Number);
            return aw * ah - bw * bh;
        });
    }, [projects]);

    const { filters, setFilters, reset } = useProjectsFilter(bounds);

    const filtered = useMemo(
        () => applyFilters(projects, filters),
        [projects, filters]
    );

    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (!drawerOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [drawerOpen]);

    return (
        <div className={styles.layout}>
            <aside
                className={`${styles.sidebar} ${drawerOpen ? styles.sidebarOpen : ""}`}
            >
                <FilterSidebar
                    filters={filters}
                    bounds={bounds}
                    sizeOptions={sizeOptions}
                    onChange={setFilters}
                    onReset={reset}
                />
                <button
                    type="button"
                    className={styles.drawerApply}
                    onClick={() => setDrawerOpen(false)}
                >
                    Показать {filtered.length}
                </button>
            </aside>
            {drawerOpen && (
                <button
                    type="button"
                    aria-label="Закрыть фильтры"
                    className={styles.drawerBackdrop}
                    onClick={() => setDrawerOpen(false)}
                />
            )}
            <div className={styles.main}>
                <SortBar
                    search={filters.search}
                    sort={filters.sort}
                    count={filtered.length}
                    onSearchChange={(search) => setFilters({ search })}
                    onSortChange={(sort) => setFilters({ sort })}
                    onOpenFilters={() => setDrawerOpen(true)}
                />
                {filtered.length > 0 ? (
                    <div className={styles.grid}>
                        {filtered.map((p) => (
                            <ProductCard key={p.slug} project={p} />
                        ))}
                    </div>
                ) : (
                    <p className={styles.empty}>
                        По выбранным фильтрам ничего не найдено. Попробуйте
                        сбросить часть параметров.
                    </p>
                )}
            </div>
        </div>
    );
}

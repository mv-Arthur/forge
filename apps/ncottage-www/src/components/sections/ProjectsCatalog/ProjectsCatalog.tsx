"use client";

import { useEffect, useMemo, useState } from "react";
import * as React from "react";
import { ProductCard } from "@/components/shared/ProductCard";
import type { Project, Technology } from "@/types/project";
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
    lockedTechnology?: Technology | null;
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

function ProjectsCatalogContent({
    projects,
    lockedTechnology = null,
}: ProjectsCatalogProps) {
    const scopedProjects = useMemo(
        () =>
            lockedTechnology
                ? projects.filter((p) => p.technology === lockedTechnology)
                : projects,
        [projects, lockedTechnology]
    );

    const bounds = useMemo(
        () => computeBounds(scopedProjects),
        [scopedProjects]
    );
    const sizeOptions = useMemo(() => {
        const set = new Set(scopedProjects.map((p) => p.specs.dimensions));
        return Array.from(set).sort((a, b) => {
            const [aw, ah] = a.split("x").map(Number);
            const [bw, bh] = b.split("x").map(Number);
            return aw * ah - bw * bh;
        });
    }, [scopedProjects]);

    const { filters, setFilters, reset } = useProjectsFilter(bounds);

    const filtered = useMemo(
        () => applyFilters(scopedProjects, filters),
        [scopedProjects, filters]
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

    const gridClass =
        filters.view === "list" ? styles.gridList : styles.gridTwo;

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
                    hideTechnology={Boolean(lockedTechnology)}
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
                    view={filters.view}
                    count={filtered.length}
                    onSearchChange={(search) => setFilters({ search })}
                    onSortChange={(sort) => setFilters({ sort })}
                    onViewChange={(view) => setFilters({ view })}
                    onOpenFilters={() => setDrawerOpen(true)}
                />
                {filtered.length > 0 ? (
                    <div className={gridClass}>
                        {filtered.map((p) => (
                            <ProductCard
                                key={p.slug}
                                project={p}
                                variant={filters.view}
                            />
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

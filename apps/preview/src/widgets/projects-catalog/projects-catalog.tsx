import Link from "next/link";
import {
    formatMillions,
    formatTechnologyBrand,
    projectsWord,
} from "@/lib/format";
import { CATALOG_EYEBROW } from "@/lib/copy";
import { HouseIcon } from "@/ui/icons";
import type { ReactNode } from "react";
import type { CatalogStats, MergedProject, Technology } from "@/types/catalog";

export function ProjectsCatalog({
    projects,
    techs,
    stats,
    filters,
}: {
    projects: MergedProject[];
    techs: Technology[];
    stats: CatalogStats;
    filters: ReactNode;
}) {
    return (
        <main>
            <section
                data-section="catalog-header"
                className="border-b border-ink-150 bg-white"
            >
                <div className="container-page py-6 md:py-8">
                    <div className="text-xs text-ink-500">
                        <Link href="/" className="hover:text-ink-950">
                            Главная
                        </Link>{" "}
                        · <span className="text-ink-700">Готовые проекты</span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                        <div className="max-w-2xl">
                            <div className="eyebrow text-accent">
                                {CATALOG_EYEBROW}
                            </div>
                            <h1
                                data-catalog-count={projects.length}
                                className="mt-2 font-display text-[clamp(2rem,3.8vw,3rem)] font-semibold leading-[1.02] text-ink-950"
                            >
                                {projects.length}{" "}
                                {projectsWord(projects.length)} под ключ
                            </h1>
                            <p className="mt-2 text-sm leading-relaxed text-ink-500 md:text-base">
                                От {formatMillions(stats.minPrice)} до{" "}
                                {formatMillions(stats.maxPrice)}. Каждый дом
                                можно построить в нескольких материалах.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5">
                        <div className="eyebrow text-accent">Материалы</div>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-5">
                            {techs.map((t) => (
                                <Link
                                    key={t}
                                    href={`/projects?tech=${t}#catalog`}
                                    className="flex items-center gap-2 rounded-xl border border-ink-150 bg-ink-50/50 px-3 py-2.5 text-sm transition hover:border-accent/40 hover:bg-white hover:shadow-card"
                                >
                                    <HouseIcon className="h-4 w-4 text-ink-500" />
                                    <span className="font-semibold text-ink-950">
                                        {formatTechnologyBrand(t)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section
                data-section="catalog-grid"
                id="catalog"
                className="bg-white pb-28 md:pb-20"
            >
                <div className="container-page pt-8">{filters}</div>
            </section>
        </main>
    );
}

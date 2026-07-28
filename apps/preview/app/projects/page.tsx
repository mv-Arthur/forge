import Link from "next/link";
import { Suspense } from "react";
import {
    getAllProjects,
    getCatalogStats,
    getTechnologiesInCatalog,
} from "@/lib/data";
import { ProjectFilters } from "@/components/ProjectFilters";
import { QuizLauncher } from "@/components/QuizLauncher";

import {
    formatMillions,
    formatTechnologyBrand,
    projectsWord,
} from "@/lib/format";
import { HouseIcon } from "@/components/Icons";

export const metadata = {
    title: `Готовые проекты · Новый Коттедж`,
};

const TECH_DESCRIPTIONS: Record<string, string> = {
    gas_concrete: "тёплые для ПМЖ",
    brick: "премиум-класса",
    frame: "быстрые и бюджетные",
    sip: "сборка за 5 дней",
    fachwerk: "дизайнерские",
};

export default function ProjectsPage() {
    const projects = getAllProjects();
    const techs = getTechnologiesInCatalog();
    const stats = getCatalogStats();

    return (
        <main>

            <section className="border-b border-ink-150 bg-white">
                <div className="container-page py-8 md:py-10">
                    <div className="text-[12px] text-ink-500">
                        <Link href="/" className="hover:text-ink-950">
                            Главная
                        </Link>{" "}
                        · <span className="text-ink-700">Готовые проекты</span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="eyebrow text-accent">Каталог домов</div>
                            <h1 className="mt-2 font-display text-display-2">
                                {projects.length} {projectsWord(projects.length)}{" "}
                                под ключ
                            </h1>
                            <p className="mt-3 text-ink-500">
                                От {formatMillions(stats.minPrice)} до{" "}
                                {formatMillions(stats.maxPrice)}. Каждый дом
                                можно построить в нескольких материалах.
                            </p>
                        </div>
                        <QuizLauncher projects={projects} />
                    </div>

                    <div className="mt-6">
                        <div className="eyebrow text-accent">
                            Популярные теги
                        </div>
                        <div className="mt-2.5 grid gap-2 md:grid-cols-5">
                            {techs.map((t) => (
                                <Link
                                    key={t}
                                    href={`/projects?tech=${t}#catalog`}
                                    className="flex items-center gap-2 rounded-xl border border-ink-150 bg-ink-50/40 px-3 py-2.5 text-sm transition hover:border-ink-950 hover:bg-white"
                                >
                                    <HouseIcon className="h-4 w-4 text-ink-500" />
                                    <span className="font-semibold text-ink-950">
                                        {formatTechnologyBrand(t)}
                                    </span>
                                    <span className="text-[12px] text-ink-500">
                                        {TECH_DESCRIPTIONS[t]}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div id="catalog" className="container-page pt-4 md:pt-6 scroll-mt-28">
                <Suspense
                    fallback={
                        <div className="py-16 text-center text-ink-500">
                            Загрузка каталога…
                        </div>
                    }
                >
                    <ProjectFilters projects={projects} />
                </Suspense>
            </div>
        </main>
    );
}

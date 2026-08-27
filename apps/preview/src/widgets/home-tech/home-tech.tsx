import Link from "next/link";
import { MATERIALS_LEAD } from "@/lib/copy";
import { formatTechnologyBrand, projectsWord } from "@/lib/format";
import type { Technology } from "@/types/catalog";

export function HomeTech({
    techCounts,
}: {
    techCounts: Array<{ tech: Technology; count: number }>;
}) {
    if (techCounts.length === 0) return null;
    return (
        <section
            data-section="tech"
            className="section border-t border-ink-150 bg-white"
        >
            <div className="container-page">
                <div className="eyebrow text-accent">Материалы</div>
                <h2 className="mt-2 font-display text-h1 text-ink-950">
                    Из чего строим
                </h2>
                <p className="mt-3 max-w-2xl text-base text-ink-500">
                    {MATERIALS_LEAD}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {techCounts.map(({ tech, count }) => (
                        <Link
                            key={tech}
                            href={`/projects?tech=${tech}`}
                            className="rounded-2xl border border-ink-150 bg-ink-50/60 px-4 py-4 transition hover:border-accent/40 hover:bg-white hover:shadow-card"
                        >
                            <div className="font-display text-xl font-semibold text-ink-950">
                                {formatTechnologyBrand(tech)}
                            </div>
                            <div className="mt-1 text-sm text-ink-500">
                                {count} {projectsWord(count)}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

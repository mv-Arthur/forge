import type { ReactNode } from "react";
import Link from "next/link";
import { formatTechnologyBrand, housesWord } from "@/lib/format";
import {
    BUILT_HOUSES_HEADING,
    EMPTY_HOUSES,
    WORKS_EYEBROW,
} from "@/lib/copy";
import { BuiltObjectCard } from "@/widgets/built-object-card/built-object-card";
import type { EnrichedBuiltObject, Technology } from "@/types/catalog";

export function WorksCatalog({
    objects,
    built,
    techs,
    visit,
}: {
    objects: EnrichedBuiltObject[];
    built: number;
    techs: Technology[];
    visit: ReactNode;
}) {
    return (
        <main>
            <section
                data-section="works-header"
                className="border-b border-ink-150 bg-white"
            >
                <div className="container-page py-12 md:py-16">
                    <div className="text-xs text-ink-500">
                        <Link href="/" className="hover:text-ink-950">
                            Главная
                        </Link>{" "}
                        ·{" "}
                        <span className="text-ink-700">Построенные дома</span>
                    </div>

                    <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="eyebrow text-accent">
                                {WORKS_EYEBROW}
                            </div>
                            <h1 className="mt-3 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold leading-[1.02] text-ink-950">
                                {BUILT_HOUSES_HEADING}
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-ink-500">
                                {objects.length} {housesWord(objects.length)}
                                {built > 0 ? `, из них ${built} сданы` : ""}.
                            </p>
                            {techs.length > 0 ? (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {techs.map((t) => (
                                        <span key={t} className="chip">
                                            {formatTechnologyBrand(t)}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {visit}
                            <Link
                                href="/projects"
                                className="btn btn-light btn-lg"
                            >
                                Выбрать проект
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section
                data-section="works-grid"
                className="bg-ink-50/40 pb-28 md:pb-20"
            >
                <div className="container-page pt-10">
                    {objects.length > 0 ? (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {objects.map((o) => (
                                <BuiltObjectCard key={o.slug} object={o} />
                            ))}
                        </div>
                    ) : (
                        <p className="py-16 text-center text-ink-500">
                            {EMPTY_HOUSES}
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}

import type { ReactNode } from "react";
import { Breadcrumb } from "@/ui/breadcrumb";
import {
    EMPTY_HOUSES,
    NAV_WORKS,
    WORKS_EYEBROW,
    WORKS_HEADING,
    WORKS_LEAD,
} from "@/lib/copy";
import { BuiltObjectCard } from "@/widgets/built-object-card/built-object-card";
import type { EnrichedBuiltObject } from "@/types/catalog";

export function WorksCatalog({
    objects,
    visit,
}: {
    objects: EnrichedBuiltObject[];
    visit: ReactNode;
}) {
    return (
        <main>
            <div className="container-page">
                <Breadcrumb
                    items={[
                        { label: "Главная", href: "/" },
                        { label: NAV_WORKS },
                    ]}
                />
            </div>
            <section
                data-section="works-header"
                className="border-b border-ink-150 bg-white"
            >
                <div className="container-page py-12 md:py-16">
                    <div className="flex flex-wrap items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="eyebrow text-accent">
                                {WORKS_EYEBROW}
                            </div>
                            <h1 className="mt-3 font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold leading-[1.02] text-ink-950">
                                {WORKS_HEADING}
                            </h1>
                            <p className="mt-4 text-base leading-relaxed text-ink-500">
                                {WORKS_LEAD}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">{visit}</div>
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

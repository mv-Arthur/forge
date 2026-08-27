import type { ReactNode } from "react";
import Link from "next/link";
import {
    BUILT_HOUSES_HEADING,
    SEE_HOUSES,
    WORKS_EYEBROW,
} from "@/lib/copy";

export function HomeWorks({
    builtCount,
    carousel,
}: {
    builtCount: number;
    carousel: ReactNode;
}) {
    return (
        <section
            data-section="side-banner-slider"
            className="section border-b border-ink-150 bg-gradient-to-b from-ink-50/80 to-white"
        >
            <div className="container-page">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                    <div className="max-w-2xl">
                        <div className="eyebrow text-accent">{WORKS_EYEBROW}</div>
                        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] text-ink-950">
                            {BUILT_HOUSES_HEADING}
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-ink-500">
                            {builtCount > 0
                                ? `${builtCount} построенных в Ленобласти — можно приехать и посмотреть.`
                                : "Построенные дома в Ленобласти — можно приехать и посмотреть."}
                        </p>
                    </div>
                    <Link href="/works" className="btn btn-light">
                        {SEE_HOUSES}
                    </Link>
                </div>
                {carousel}
            </div>
        </section>
    );
}

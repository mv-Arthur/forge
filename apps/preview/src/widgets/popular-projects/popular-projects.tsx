import type { ReactNode } from "react";
import Link from "next/link";
import { POPULAR_HEADING, POPULAR_LEAD } from "@/lib/copy";

export function PopularProjects({ cards }: { cards: ReactNode }) {
    return (
        <section data-section="popular" className="section bg-ink-50/50">
            <div className="container-page">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                    <div className="max-w-2xl">
                        <div className="eyebrow text-accent">
                            Популярные проекты
                        </div>
                        <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-[1.05] text-ink-950">
                            {POPULAR_HEADING}
                        </h2>
                        <p className="mt-3 text-base leading-relaxed text-ink-500">
                            {POPULAR_LEAD}
                        </p>
                    </div>
                    <Link href="/projects" className="btn btn-light">
                        Все проекты
                    </Link>
                </div>
                {cards}
            </div>
        </section>
    );
}

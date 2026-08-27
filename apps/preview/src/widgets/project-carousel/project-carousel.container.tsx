"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MergedProject } from "@/types/catalog";
import { ProjectCard } from "@/widgets/project-card/project-card";
import { ChevronLeftIcon, ChevronRightIcon } from "@/ui/icons";

export function ProjectCarouselContainer({
    projects,
}: {
    projects: MergedProject[];
}) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const update = useCallback(() => {
        const el = scrollerRef.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        setCanPrev(el.scrollLeft > 4);
        setCanNext(max > 4 && el.scrollLeft < max - 4);
    }, []);

    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;
        update();
        el.addEventListener("scroll", update, { passive: true });
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => {
            el.removeEventListener("scroll", update);
            ro.disconnect();
        };
    }, [update, projects.length]);

    const scrollByDir = (dir: -1 | 1) => {
        const el = scrollerRef.current;
        if (!el) return;
        const card = el.querySelector<HTMLElement>("[data-carousel-item]");
        const step = card
            ? card.offsetWidth + 20
            : Math.max(280, el.clientWidth * 0.7);
        el.scrollBy({ left: dir * step, behavior: "smooth" });
    };

    if (projects.length === 0) return null;

    const showControls = projects.length > 1;

    return (
        <div className="relative">
            {showControls ? (
                <div className="mb-4 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => scrollByDir(-1)}
                        disabled={!canPrev}
                        className="grid h-10 w-10 place-items-center rounded-full border border-ink-150 bg-white text-ink-900 shadow-sm transition hover:border-ink-900 disabled:pointer-events-none disabled:opacity-30"
                        aria-label="Предыдущие проекты"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollByDir(1)}
                        disabled={!canNext}
                        className="grid h-10 w-10 place-items-center rounded-full border border-ink-150 bg-white text-ink-900 shadow-sm transition hover:border-ink-900 disabled:pointer-events-none disabled:opacity-30"
                        aria-label="Следующие проекты"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>
            ) : null}
            <div
                ref={scrollerRef}
                className="scroll-hide -mx-1 flex gap-5 overflow-x-auto px-1 pb-2 snap-x snap-mandatory"
            >
                {projects.map((p) => (
                    <div
                        key={p.slug}
                        data-carousel-item
                        className="w-[min(100%,340px)] flex-shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
                    >
                        <ProjectCard project={p} />
                    </div>
                ))}
            </div>
        </div>
    );
}

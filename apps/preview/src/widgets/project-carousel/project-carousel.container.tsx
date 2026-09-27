"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MergedProject } from "@/types/catalog";
import { ProjectCard } from "@/widgets/project-card/project-card";
import { ChevronLeftIcon, ChevronRightIcon } from "@/ui/icons";
import styles from "./project-carousel.module.css";

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
        <div className={styles.root}>
            {showControls ? (
                <div className={styles.controls}>
                    <button
                        type="button"
                        onClick={() => scrollByDir(-1)}
                        disabled={!canPrev}
                        className={styles.btn}
                        aria-label="Предыдущие проекты"
                    >
                        <ChevronLeftIcon className={styles.icon} />
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollByDir(1)}
                        disabled={!canNext}
                        className={styles.btn}
                        aria-label="Следующие проекты"
                    >
                        <ChevronRightIcon className={styles.icon} />
                    </button>
                </div>
            ) : null}
            <div ref={scrollerRef} className={`scroll-hide ${styles.scroller}`}>
                {projects.map((p) => (
                    <div
                        key={p.slug}
                        data-carousel-item
                        className={styles.item}
                    >
                        <ProjectCard project={p} layout="similar" />
                    </div>
                ))}
            </div>
        </div>
    );
}

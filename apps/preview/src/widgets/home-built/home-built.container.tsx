"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BUILT_STRIP_HEADING, BUILT_STRIP_SEE } from "@/lib/copy";
import { routes } from "@/lib/routes";
import { HomeBuilt } from "./home-built";
import type { HomeBuiltItem, HomeBuiltStat } from "./home-built.types";

export function HomeBuiltContainer({
    items,
    stats,
}: {
    items: HomeBuiltItem[];
    stats: HomeBuiltStat[];
}) {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(false);

    const measure = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setShowPrev(el.scrollLeft > 12);
        setShowNext(el.scrollWidth - el.clientWidth - el.scrollLeft > 12);
    }, []);

    const scrollByPage = useCallback((dir: 1 | -1) => {
        const el = trackRef.current;
        if (!el) return;
        const card = 279;
        const visible = Math.max(1, Math.floor(el.clientWidth / card));
        el.scrollBy({ left: dir * visible * card, behavior: "smooth" });
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        measure();
        el.addEventListener("scroll", measure, { passive: true });
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => {
            el.removeEventListener("scroll", measure);
            ro.disconnect();
        };
    }, [measure, items.length]);

    if (items.length === 0) return null;

    return (
        <HomeBuilt
            heading={BUILT_STRIP_HEADING}
            seeLabel={BUILT_STRIP_SEE}
            seeHref={routes.worksGallery()}
            stats={stats}
            items={items}
            trackRef={trackRef}
            onPrev={() => scrollByPage(-1)}
            onNext={() => scrollByPage(1)}
            showPrev={showPrev}
            showNext={showNext}
        />
    );
}

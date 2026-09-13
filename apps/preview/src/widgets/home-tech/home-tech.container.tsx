"use client";

import { useMemo, useState } from "react";
import { TECH_SECTION_HEADING, TECH_SEE_PROJECTS } from "@/lib/copy";
import type { Technology } from "@/types/catalog";
import { HomeTech } from "./home-tech";
import { TECH_COPY, TECH_ORDER, TECH_THUMBS, techAssets } from "./lib/content";
import type { HomeTechSlide } from "./home-tech.types";

export function HomeTechContainer({
    techCounts,
}: {
    techCounts: Array<{ tech: Technology; count: number }>;
}) {
    const slides = useMemo<HomeTechSlide[]>(() => {
        const byTech = new Map(techCounts.map((row) => [row.tech, row.count]));
        return TECH_ORDER.flatMap((id) => {
            const count = byTech.get(id) ?? 0;
            if (count <= 0) return [];
            const copy = TECH_COPY[id];
            const assets = techAssets(id);
            return [
                {
                    id,
                    tab: copy.tab,
                    title: copy.title,
                    lead: copy.lead,
                    href: `/projects?tech=${id}`,
                    count,
                    house: assets.house,
                    houseAlt: copy.houseAlt,
                    samples: [
                        { src: assets.samples[0], alt: copy.samples[0].alt },
                        { src: assets.samples[1], alt: copy.samples[1].alt },
                    ],
                },
            ];
        });
    }, [techCounts]);

    const [active, setActive] = useState<Technology>(
        () => slides[0]?.id ?? "gas_concrete",
    );

    if (slides.length === 0) return null;

    const current = slides.some((s) => s.id === active)
        ? active
        : slides[0].id;

    return (
        <HomeTech
            heading={TECH_SECTION_HEADING}
            cta={TECH_SEE_PROJECTS}
            slides={slides}
            thumbs={[...TECH_THUMBS]}
            active={current}
            onTab={setActive}
        />
    );
}

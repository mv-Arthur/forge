"use client";

import { useMemo, useState } from "react";
import { TECH_SECTION_HEADING, TECH_SEE_PROJECTS } from "@/lib/copy";
import { routes } from "@/lib/routes";
import type { Technology } from "@/types/catalog";
import { HomeTech } from "./home-tech";
import { slotUrl } from "@/lib/homeSlots";
import { TECH_COPY, TECH_ORDER, techAssets } from "./lib/content";
import type { HomeTechSlide } from "./home-tech.types";

export function HomeTechContainer({
    techCounts,
    slots,
}: {
    techCounts: Array<{ tech: Technology; count: number }>;
    slots: Record<string, string>;
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
                    href: routes.projects({ tech: id }),
                    count,
                    house: slotUrl(slots, `tech.${id}.house`) || assets.house,
                    houseAlt: copy.houseAlt,
                    samples: [
                        {
                            src:
                                slotUrl(slots, `tech.${id}.sample-a`) ||
                                assets.samples[0],
                            alt: copy.samples[0].alt,
                        },
                        {
                            src:
                                slotUrl(slots, `tech.${id}.sample-b`) ||
                                assets.samples[1],
                            alt: copy.samples[1].alt,
                        },
                    ],
                },
            ];
        });
    }, [techCounts, slots]);

    const [active, setActive] = useState<Technology>(
        () => slides[0]?.id ?? "gas_concrete"
    );

    if (slides.length === 0) return null;

    const current = slides.some((s) => s.id === active) ? active : slides[0].id;

    return (
        <HomeTech
            heading={TECH_SECTION_HEADING}
            cta={TECH_SEE_PROJECTS}
            slides={slides}
            thumbs={[0, 1, 2].map((i) => slotUrl(slots, `tech.thumb.${i}`))}
            active={current}
            onTab={setActive}
        />
    );
}

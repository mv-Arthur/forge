"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { MergedProject, ProjectFloorPlan } from "@/types/catalog";
import {
    formatArea,
    formatFloors,
    bedroomsWord,
    bathroomsWord,
} from "@/lib/format";

interface Props {
    project: MergedProject;
    plans: ProjectFloorPlan[];
}

/** Real floor plan images only — no synthetic room lists. */
export function ProjectDetailPlans({ project, plans }: Props) {
    const [active, setActive] = useState(0);
    const grouped = useMemo(() => {
        const groups = new Map<string, ProjectFloorPlan[]>();
        for (const p of plans) {
            const key = p.floor || "План";
            const arr = groups.get(key) ?? [];
            arr.push(p);
            groups.set(key, arr);
        }
        return Array.from(groups.entries()).map(([floor, items]) => ({
            floor,
            items,
        }));
    }, [plans]);

    if (grouped.length === 0) return null;
    const activeGroup = grouped[active];
    const plan = activeGroup.items[0];

    return (
        <div className="rounded-2xl border border-ink-150 bg-white p-5 md:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="eyebrow">Планировка</div>
                    <h3 className="mt-1 font-display text-h2">
                        Этажи и планы
                    </h3>
                    <p className="mt-2 text-[13px] text-ink-500">
                        {[
                            formatArea(project.area),
                            formatFloors(project.floors),
                            project.bedrooms
                                ? `${project.bedrooms} ${bedroomsWord(project.bedrooms)}`
                                : null,
                            project.bathrooms
                                ? `${project.bathrooms} ${bathroomsWord(project.bathrooms)}`
                                : null,
                            project.dimensions
                                ? `${project.dimensions.replace(/x/gi, "×")} м`
                                : null,
                        ]
                            .filter(Boolean)
                            .join(" · ")}
                    </p>
                </div>
            </div>

            {grouped.length > 1 ? (
                <div className="mb-5 flex flex-wrap gap-1.5">
                    {grouped.map((g, i) => (
                        <button
                            key={g.floor + i}
                            type="button"
                            onClick={() => setActive(i)}
                            className={`chip chip-btn ${
                                i === active ? "chip-active" : ""
                            }`}
                        >
                            {g.floor}
                        </button>
                    ))}
                </div>
            ) : null}

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-ink-150 bg-white">
                <Image
                    src={plan.url}
                    alt={`Планировка · ${activeGroup.floor}`}
                    fill
                    sizes="(min-width:1024px) 55vw, 100vw"
                    className="object-contain p-2"
                />
            </div>
        </div>
    );
}

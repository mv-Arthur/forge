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
import styles from "./project-detail__plans.module.css";

interface Props {
    project: MergedProject;
    plans: ProjectFloorPlan[];
}

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
        <div className={styles.card}>
            <div className={styles.head}>
                <div>
                    <div className="eyebrow">Планировка</div>
                    <h3 className={styles.title}>Этажи и планы</h3>
                    <p className={styles.meta}>
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
                <div className={styles.tabs}>
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

            <div className={styles.frame}>
                <Image
                    src={plan.url}
                    alt={`Планировка · ${activeGroup.floor}`}
                    fill
                    unoptimized={plan.url.startsWith("/media/")}
                    sizes="(min-width:1024px) 55vw, 100vw"
                    className={styles.img}
                />
            </div>
        </div>
    );
}

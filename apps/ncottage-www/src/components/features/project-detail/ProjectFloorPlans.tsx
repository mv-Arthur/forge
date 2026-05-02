"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProjectFloorPlan } from "@/domain/project";
import { formatArea } from "@/lib/utils";
import styles from "./ProjectFloorPlans.module.css";

interface ProjectFloorPlansProps {
    plans: ProjectFloorPlan[];
}

export function ProjectFloorPlans({ plans }: ProjectFloorPlansProps) {
    const [active, setActive] = useState(0);
    const plan = plans[active];

    return (
        <div className={styles.root}>
            <div className={styles.tabs} role="tablist">
                {plans.map((p, i) => (
                    <button
                        key={p.label}
                        type="button"
                        role="tab"
                        aria-selected={i === active}
                        onClick={() => setActive(i)}
                        className={`${styles.tab} ${i === active ? styles.tabActive : ""}`}
                    >
                        <span>{p.label}</span>
                        {p.area && (
                            <span className={styles.tabArea}>
                                {formatArea(p.area)}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className={styles.body}>
                <div className={styles.image}>
                    <Image
                        src={plan.image}
                        alt={`Планировка: ${plan.label}`}
                        fill
                        sizes="(max-width: 900px) 100vw, 60vw"
                        className={styles.imageInner}
                    />
                </div>

                {plan.rooms && plan.rooms.length > 0 && (
                    <div className={styles.rooms}>
                        <p className={styles.roomsTitle}>Состав помещений</p>
                        <ul className={styles.roomsList}>
                            {plan.rooms.map((r, i) => (
                                <li
                                    key={`${r.name}-${i}`}
                                    className={styles.room}
                                >
                                    <span className={styles.roomName}>
                                        {r.name}
                                    </span>
                                    <span className={styles.roomDots} />
                                    <span className={styles.roomArea}>
                                        {formatArea(r.area)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { DETAIL_FACADES_HEADING } from "@/lib/copy";
import type { DetailFacade } from "../lib/illustrations";
import styles from "./project-detail__facades.module.css";

export function ProjectDetailFacades({
    facades,
    stub = false,
}: {
    facades: DetailFacade[];
    stub?: boolean;
}) {
    const [active, setActive] = useState(0);
    const current = facades[active];
    if (!current) return null;

    return (
        <div data-stub={stub ? "true" : undefined}>
            <div className={styles.tabs}>
                {facades.map((f, i) => (
                    <button
                        key={f.id}
                        type="button"
                        onClick={() => setActive(i)}
                        className={`${styles.tab} ${i === active ? styles.tabOn : ""}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
            <div className={styles.frame}>
                <Image
                    src={current.src}
                    alt={`${DETAIL_FACADES_HEADING}: ${current.label}`}
                    fill
                    unoptimized={current.src.startsWith("/media/")}
                    className={styles.img}
                    sizes="(min-width:1024px) 70vw, 100vw"
                />
            </div>
        </div>
    );
}

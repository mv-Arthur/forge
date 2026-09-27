"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
    DETAIL_NAV_FACADES,
    DETAIL_NAV_SECTIONS,
    DETAIL_UNIQUE_TAB_PLANS,
    detailFloorAreaHint,
} from "@/lib/copy";
import { formatAreaTenths } from "@/lib/format";
import type { ProjectFloorPlan, ShowcaseFacade } from "@/types/catalog";
import styles from "./individual-drawings.module.css";

type Tab = "plans" | "facades" | "sections";

function DrawingShot({
    src,
    alt,
    className,
}: {
    src: string;
    alt: string;
    className: string;
}) {
    if (src.endsWith(".svg")) {
        return <img src={src} alt={alt} className={className} />;
    }
    return (
        <Image
            src={src}
            alt={alt}
            width={1400}
            height={900}
            unoptimized={src.startsWith("/media/")}
            className={className}
            sizes="(min-width: 768px) 42rem, 100vw"
        />
    );
}

export function ProjectDetailIndividualDrawings({
    plans,
    facades,
    sections,
    fallbackArea,
}: {
    plans: ProjectFloorPlan[];
    facades: ShowcaseFacade[];
    sections: ShowcaseFacade[];
    fallbackArea: number | null;
}) {
    const tabs = useMemo(() => {
        const items: Array<{ id: Tab; label: string }> = [];
        if (plans.length > 0) {
            items.push({ id: "plans", label: DETAIL_UNIQUE_TAB_PLANS });
        }
        if (facades.length > 0) {
            items.push({ id: "facades", label: DETAIL_NAV_FACADES });
        }
        if (sections.length > 0) {
            items.push({ id: "sections", label: DETAIL_NAV_SECTIONS });
        }
        return items;
    }, [plans.length, facades.length, sections.length]);

    const [tab, setTab] = useState<Tab>(tabs[0]?.id ?? "plans");
    const [floor, setFloor] = useState(0);
    const active = tabs.some((item) => item.id === tab)
        ? tab
        : (tabs[0]?.id ?? "plans");
    const plan = plans[Math.min(floor, Math.max(plans.length - 1, 0))];
    const floorArea = plan?.area ?? fallbackArea;

    if (tabs.length === 0) return null;

    return (
        <section data-section="detail-drawings" className={styles.root}>
            <div className={styles.inner}>
            <div className={styles.tabs} role="tablist">
                {tabs.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        role="tab"
                        className={styles.tab}
                        aria-selected={item.id === active}
                        onClick={() => setTab(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {active === "plans" && plan ? (
                <div className={styles.plan}>
                    {plans.length > 1 ? (
                        <div className={styles.floors}>
                            {plans.map((item, i) => (
                                <button
                                    key={item.floor + item.url}
                                    type="button"
                                    className={styles.floor}
                                    data-active={i === floor}
                                    onClick={() => setFloor(i)}
                                >
                                    {item.floor}
                                </button>
                            ))}
                        </div>
                    ) : null}
                    <DrawingShot
                        src={plan.url}
                        alt={plan.floor}
                        className={styles.shot}
                    />
                    {floorArea != null ? (
                        <div className={styles.area}>
                            <span className={styles.areaBar} aria-hidden />
                            <p className={styles.areaHint}>
                                {detailFloorAreaHint(plan.floor)}
                            </p>
                            <p className={styles.areaValue}>
                                {formatAreaTenths(floorArea)}
                            </p>
                        </div>
                    ) : null}
                </div>
            ) : null}

            {active === "facades" ? (
                <div className={styles.facades}>
                    {facades.map((item) => (
                        <DrawingShot
                            key={item.id}
                            src={item.src}
                            alt={item.label}
                            className={styles.shot}
                        />
                    ))}
                </div>
            ) : null}

            {active === "sections" ? (
                <div className={styles.facades}>
                    {sections.map((item) => (
                        <DrawingShot
                            key={item.id}
                            src={item.src}
                            alt={item.label}
                            className={styles.shot}
                        />
                    ))}
                </div>
            ) : null}
            </div>
        </section>
    );
}

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import type { GeographyContent } from "@/content/home";
import styles from "./GeographySection.module.css";

interface GeographySectionProps {
    eyebrow: GeographyContent["eyebrow"];
    title: GeographyContent["title"];
    titleAccent?: GeographyContent["titleAccent"];
    lead?: GeographyContent["lead"];
    totalLabel: GeographyContent["totalLabel"];
    totalValue: GeographyContent["totalValue"];
    regions: GeographyContent["regions"];
    cta: GeographyContent["cta"];
}

const ROW_DURATION = 1200;
const ROW_STAGGER = 110;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function GeographySection({
    eyebrow,
    title,
    titleAccent,
    lead,
    totalLabel,
    totalValue,
    regions,
    cta,
}: GeographySectionProps) {
    const max = Math.max(...regions.map((r) => r.percent));
    const totalDuration = ROW_DURATION + (regions.length - 1) * ROW_STAGGER;
    const sectionRef = useRef<HTMLElement | null>(null);
    const [elapsed, setElapsed] = useState(totalDuration);

    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;
        if (
            window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
            typeof IntersectionObserver === "undefined"
        ) {
            return;
        }

        const rect = node.getBoundingClientRect();
        const visibleAtMount =
            rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
        if (visibleAtMount) return;

        setElapsed(0);

        let rafId = 0;
        let startTime = 0;
        const tick = (now: number) => {
            if (!startTime) startTime = now;
            const t = now - startTime;
            setElapsed(t);
            if (t < totalDuration) {
                rafId = requestAnimationFrame(tick);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        observer.disconnect();
                        rafId = requestAnimationFrame(tick);
                        break;
                    }
                }
            },
            { threshold: 0.25 }
        );
        observer.observe(node);
        return () => {
            observer.disconnect();
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [totalDuration]);

    const rowProgress = (i: number) =>
        easeOutCubic(clamp01((elapsed - i * ROW_STAGGER) / ROW_DURATION));

    return (
        <section ref={sectionRef} className={styles.section}>
            <Container className={styles.layout}>
                <header className={styles.head}>
                    <span className={styles.eyebrow}>{eyebrow}</span>
                    <h2 className={styles.title}>
                        {title}
                        {titleAccent && (
                            <>
                                {" "}
                                <span className={styles.titleAccent}>
                                    {titleAccent}
                                </span>
                            </>
                        )}
                    </h2>
                    {lead && <p className={styles.lead}>{lead}</p>}
                    <div className={styles.total}>
                        <span className={styles.totalValue}>{totalValue}</span>
                        <span className={styles.totalLabel}>{totalLabel}</span>
                    </div>
                    <Link href={cta.href} className={styles.cta}>
                        {cta.label} →
                    </Link>
                </header>

                <ul className={styles.list}>
                    {regions.map((region, i) => {
                        const p = rowProgress(i);
                        const displayPercent = Math.round(region.percent * p);
                        const displayCount = Math.round(region.count * p);
                        const fillWidth = ((region.percent * p) / max) * 100;
                        return (
                            <li key={region.label} className={styles.row}>
                                <div className={styles.rowHead}>
                                    <span className={styles.regionLabel}>
                                        {region.label}
                                    </span>
                                    <span className={styles.regionMeta}>
                                        <span className={styles.regionCount}>
                                            {displayCount}
                                        </span>
                                        <span className={styles.regionPercent}>
                                            {displayPercent}%
                                        </span>
                                    </span>
                                </div>
                                <div className={styles.bar} role="presentation">
                                    <span
                                        className={styles.barFill}
                                        style={{ width: `${fillWidth}%` }}
                                    />
                                </div>
                                {region.note && (
                                    <p className={styles.regionNote}>
                                        {region.note}
                                    </p>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </Container>
        </section>
    );
}

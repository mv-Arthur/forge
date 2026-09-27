"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
    CATALOG_BATH_TILE,
    DETAIL_FACT_AREA_AXES,
    DETAIL_FACT_TECH,
    DETAIL_PACKAGE_CTA,
    HUB_INDIVIDUAL_TITLE,
    INDIVIDUAL_PROJECT_LABEL,
} from "@/lib/copy";
import { routes } from "@/lib/routes";
import {
    bathroomsWord,
    formatArea,
    formatTechnologyBrand,
    roomsWord,
} from "@/lib/format";
import {
    formatLikeCount,
    isLiked,
    likeCount,
    toggleLiked,
} from "@/widgets/project-card/lib/prefs";
import { Breadcrumb } from "@/ui/breadcrumb";
import { HeartIcon, HeartSolidIcon, InfoIcon } from "@/ui/icons";
import type { MergedProject } from "@/types/catalog";
import styles from "./individual-hero.module.css";

function cap(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function ProjectDetailIndividualHero({
    project,
    images,
    className,
}: {
    project: MergedProject;
    images: string[];
    className?: string;
}) {
    const [i, setI] = useState(0);
    const [liked, setLiked] = useState(false);
    const n = images.length;
    const likes = formatLikeCount(likeCount(project.slug, liked));
    const bath = project.projectClass === "bath";
    const kindLabel = bath ? CATALOG_BATH_TILE : HUB_INDIVIDUAL_TITLE;
    const kindHref = routes.projects({
        kind: bath ? "bath" : "individual",
    });

    useEffect(() => {
        setLiked(isLiked(project.slug));
    }, [project.slug]);

    const facts: Array<{
        key: string;
        value: string;
        hint: string;
        info?: string;
    }> = [];
    if (project.area != null) {
        facts.push({
            key: "area",
            value: formatArea(project.area),
            hint: DETAIL_FACT_AREA_AXES,
            info: DETAIL_FACT_AREA_AXES,
        });
    }
    if (project.technologies[0]) {
        facts.push({
            key: "tech",
            value: formatTechnologyBrand(project.technologies[0]),
            hint: DETAIL_FACT_TECH,
        });
    }
    if (project.bedrooms != null) {
        facts.push({
            key: "rooms",
            value: String(project.bedrooms),
            hint: cap(roomsWord(project.bedrooms)),
        });
    }
    if (project.bathrooms != null) {
        facts.push({
            key: "baths",
            value: String(project.bathrooms),
            hint: cap(bathroomsWord(project.bathrooms)),
        });
    }

    return (
        <section
            data-section="detail-hero"
            className={className ? `${styles.root} ${className}` : styles.root}
        >
            <div className={styles.stage}>
                {images.map((img, idx) => (
                    <div
                        key={img + idx}
                        className={styles.slide}
                        data-active={idx === i}
                        aria-hidden={idx !== i}
                    >
                        <Image
                            src={img}
                            alt={idx === i ? project.displayName : ""}
                            fill
                            priority={idx === 0}
                            unoptimized={img.startsWith("/media/")}
                            className={styles.photo}
                            sizes="100vw"
                        />
                    </div>
                ))}
            </div>
            <div className={styles.scrim} />
            <div className={styles.top}>
                <div className={styles.crumbs}>
                    <Breadcrumb
                        items={[
                            { label: "Главная", href: routes.home },
                            { label: "Проекты", href: routes.projects() },
                            { label: kindLabel, href: kindHref },
                            { label: project.displayName },
                        ]}
                    />
                </div>
                <button
                    type="button"
                    className={styles.like}
                    aria-pressed={liked}
                    aria-label={`Нравится, ${likes}`}
                    onClick={() => setLiked(toggleLiked(project.slug))}
                >
                    {liked ? <HeartSolidIcon /> : <HeartIcon />}
                    {likes}
                </button>
            </div>
            <div className={styles.copy}>
                <p className={styles.eyebrow}>{INDIVIDUAL_PROJECT_LABEL}</p>
                <h1 className={styles.title}>{project.displayName}</h1>
                {facts.length > 0 ? (
                    <div className={styles.facts}>
                        {facts.map((fact) => (
                            <div key={fact.key} className={styles.fact}>
                                <div className={styles.value}>{fact.value}</div>
                                <div className={styles.hint}>
                                    {fact.hint}
                                    {fact.info ? (
                                        <span title={fact.info}>
                                            <InfoIcon />
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
            {n > 1 ? (
                <div className={styles.dots} role="tablist">
                    {images.map((img, idx) => (
                        <button
                            key={img + idx}
                            type="button"
                            className={styles.dot}
                            data-active={idx === i}
                            aria-label={`Слайд ${idx + 1}`}
                            onClick={() => setI(idx)}
                        />
                    ))}
                </div>
            ) : null}
            <a
                href="#detail-lead"
                className={`btn btn-primary ${styles.cta}`}
            >
                {DETAIL_PACKAGE_CTA}
            </a>
        </section>
    );
}

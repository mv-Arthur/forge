"use client";

import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    AreaIcon,
    BathIcon,
    BedIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    GridViewIcon,
    MapPinIcon,
    SizeIcon,
    ThumbUpIcon,
    ThumbUpSolidIcon,
} from "@/ui/icons";
import {
    formatLikeCount,
    isCompared,
    isLiked,
    likeCount,
    toggleCompared,
    toggleLiked,
} from "../lib/prefs";
import { HIT_SALES } from "@/lib/copy";
import type {
    ProjectCardLayout,
    ProjectCardMetric,
    ProjectCardMetricIcon,
} from "../project-card.types";
import styles from "./project-card__shell.module.css";

const METRIC_ICONS: Record<
    ProjectCardMetricIcon,
    ComponentType<SVGProps<SVGSVGElement>>
> = {
    pin: MapPinIcon,
    size: SizeIcon,
    area: AreaIcon,
    bed: BedIcon,
    bath: BathIcon,
};

function MetricIcon({ icon }: { icon: ProjectCardMetricIcon }) {
    const Icon = METRIC_ICONS[icon];
    return <Icon />;
}

export function ProjectCardShell({
    href,
    slug,
    name,
    hero,
    images,
    layout,
    priority,
    floorsLabel,
    techLabel,
    priceKicker,
    price,
    metrics,
    hit = false,
    stub = false,
}: {
    href: string;
    slug: string;
    name: string;
    hero: string;
    images: string[];
    layout: ProjectCardLayout;
    priority: boolean;
    floorsLabel: string | null;
    techLabel: string | null;
    priceKicker: string | null;
    price: string;
    metrics: ProjectCardMetric[];
    hit?: boolean;
    stub?: boolean;
}) {
    const [slide, setSlide] = useState(0);
    const [liked, setLiked] = useState(false);
    const [compared, setCompared] = useState(false);
    const total = images.length;
    const src = images[slide] || hero;
    const likes = formatLikeCount(likeCount(slug, liked));

    useEffect(() => {
        setLiked(isLiked(slug));
        setCompared(isCompared(slug));
    }, [slug]);

    const advance = (dir: 1 | -1) => (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (total < 2) return;
        setSlide((n) => (n + dir + total) % total);
    };

    return (
        <article
            className={`${styles.root} ${layout === "wide" ? styles.wide : ""}`}
            data-stub={stub ? "true" : undefined}
        >
            {src ? (
                <Image
                    src={src}
                    alt={name}
                    fill
                    unoptimized={src.startsWith("/media/")}
                    sizes={
                        layout === "wide"
                            ? "(min-width:1024px) 70vw, 100vw"
                            : "(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
                    }
                    className={styles.photo}
                    priority={priority && slide === 0}
                />
            ) : (
                <div className="grid h-full place-items-center text-ink-500">
                    нет фото
                </div>
            )}
            <div className={styles.veil} />
            <Link href={href} className={styles.hit} aria-label={name} />
            <div className={styles.top}>
                <div className={styles.chips}>
                    {hit ? (
                        <span className={`badge badge-hit ${styles.hitBadge}`}>
                            {HIT_SALES}
                        </span>
                    ) : null}
                    {floorsLabel ? (
                        <span className={styles.chip}>{floorsLabel}</span>
                    ) : null}
                    {techLabel ? (
                        <span className={styles.chip}>{techLabel}</span>
                    ) : null}
                </div>
                <div className={styles.acts}>
                    <button
                        type="button"
                        className={styles.act}
                        aria-pressed={compared}
                        aria-label="Добавить к сравнению"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCompared(toggleCompared(slug));
                        }}
                    >
                        <GridViewIcon />
                        <span className={styles.label}>
                            {compared ? "В сравнении" : "Сравнить"}
                        </span>
                    </button>
                    <button
                        type="button"
                        className={`${styles.act} ${styles.like}`}
                        aria-pressed={liked}
                        aria-label={`Нравится, ${likes}`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setLiked(toggleLiked(slug));
                        }}
                    >
                        {liked ? <ThumbUpSolidIcon /> : <ThumbUpIcon />}
                        <span className={styles.count}>{likes}</span>
                    </button>
                </div>
            </div>
            <div className={styles.bot}>
                <div className={styles.head}>
                    <h3 className={styles.name}>{name}</h3>
                    {price ? (
                        <div className={styles.price}>
                            {priceKicker ? (
                                <span>{priceKicker}</span>
                            ) : null}
                            <b>{price}</b>
                        </div>
                    ) : null}
                </div>
                {metrics.length > 0 ? (
                    <ul className={styles.metrics}>
                        {metrics.map((m) => (
                            <li
                                key={m.icon + m.label}
                                className={styles.metric}
                                data-icon={m.icon}
                            >
                                <MetricIcon icon={m.icon} />
                                {m.label}
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
            {total > 1 ? (
                <>
                    <button
                        type="button"
                        className={`${styles.arrow} ${styles.prev}`}
                        onClick={advance(-1)}
                        aria-label="Предыдущее фото"
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        type="button"
                        className={`${styles.arrow} ${styles.next}`}
                        onClick={advance(1)}
                        aria-label="Следующее фото"
                    >
                        <ChevronRightIcon />
                    </button>
                </>
            ) : null}
        </article>
    );
}

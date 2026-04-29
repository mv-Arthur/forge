"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/types/project";
import { TECHNOLOGY_GENITIVE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import styles from "./ProductCard.module.css";

const STAT_ICONS = {
    area: "/images/projects/icons/ploshhad-doma.svg",
    bedrooms: "/images/projects/icons/kolichestvo-spalen.svg",
    bathrooms: "/images/projects/icons/kolichestvo-vannyh-komnat.svg",
    floors: "/images/projects/icons/kolichestvo-etazhej.svg",
    size: "/images/projects/icons/razmer-doma.svg",
};

const DEFAULT_STAT_LABELS = {
    area: "Площадь",
    bedrooms: "Спальни",
    bathrooms: "Санузлов",
    floors: "Этажей",
    size: "Размер",
};

interface ProductCardProps {
    project: Project;
    titlePrefix?: string;
    priceLabel?: string;
    statLabels?: {
        area: string;
        bedrooms: string;
        bathrooms: string;
        floors: string;
        size: string;
    };
}

function HeartIcon({ active }: { active: boolean }) {
    return (
        <svg
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill={active ? "currentColor" : "none"}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M5.95 1C3.21625 1 1 3.29564 1 6.12731C1 11.2546 6.85 15.9158 10 17C13.15 15.9158 19 11.2546 19 6.12731C19 3.29564 16.7837 1 14.05 1C12.376 1 10.8955 1.86092 10 3.17864C9.54348 2.50528 8.93708 1.95573 8.23211 1.57651C7.52715 1.19728 6.74436 0.999536 5.95 1Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CompareIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 23 23"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path d="M22.9038 14.0405L19.0288 7.58168L22.5064 6.61568C22.865 6.51608 23.0749 6.14467 22.9753 5.7861C22.8757 5.42754 22.5042 5.21757 22.1457 5.31721L17.8228 6.51797L17.8219 6.51824L12.1739 8.08709V0.67395C12.1739 0.301817 11.8722 0.00012207 11.5 0.00012207C11.1279 0.00012207 10.8262 0.301817 10.8262 0.67395V8.46143L4.83169 10.1265L4.83075 10.1267L0.493674 11.3314C0.135062 11.431 -0.0748127 11.8024 0.0247342 12.161C0.107615 12.4592 0.378449 12.6547 0.673586 12.6547C0.734669 12.6546 0.795465 12.6463 0.854306 12.6299L3.55797 11.8789L0.0962947 17.6491C0.0334726 17.7538 0.000276455 17.8736 0.000251781 17.9957C0.000251781 20.755 2.24513 22.9998 5.00441 22.9998C7.76378 22.9998 10.0086 20.755 10.0086 17.9957C10.0086 17.8736 9.97542 17.7538 9.91258 17.6491L6.03753 11.1902L16.5491 8.27042L13.0874 14.0405C13.0246 14.1452 12.9914 14.265 12.9914 14.3872C12.9914 17.1464 15.2363 19.3912 17.9956 19.3912C19.3322 19.3912 20.5888 18.8707 21.5341 17.9255C22.4793 16.9803 22.9998 15.7237 22.9997 14.3871C22.9998 14.265 22.9666 14.1452 22.9038 14.0405ZM5.00441 21.6521C3.21845 21.6521 1.72813 20.3648 1.41084 18.6695H8.59798C8.28075 20.3648 6.79042 21.6521 5.00441 21.6521ZM8.14481 17.3219H1.86411L5.00441 12.0876L8.14481 17.3219ZM17.9956 8.47904L21.136 13.7133H14.8552L17.9956 8.47904ZM17.9956 18.0436C16.2097 18.0436 14.7193 16.7563 14.402 15.061H21.5893C21.2719 16.7563 19.7816 18.0436 17.9956 18.0436Z" />
        </svg>
    );
}

export function ProductCard({
    project,
    titlePrefix = "Дом из",
    priceLabel = "Цена от:",
    statLabels = DEFAULT_STAT_LABELS,
}: ProductCardProps) {
    const [favorited, setFavorited] = useState(false);
    const [compared, setCompared] = useState(false);

    const techWord =
        TECHNOLOGY_GENITIVE[project.technology] ?? project.technology;
    const cardTitle = `${titlePrefix} ${techWord} ${project.specs.dimensions}м`;

    return (
        <article className={styles.card}>
            <div className={styles.imageWrapper}>
                <div
                    className={styles.image}
                    style={{ backgroundImage: `url(${project.image})` }}
                />
                <span className={styles.badge}>{project.name}</span>
            </div>
            <div className={styles.actions}>
                <button
                    type="button"
                    className={
                        favorited
                            ? `${styles.action} ${styles.actionActive}`
                            : styles.action
                    }
                    aria-label="В избранное"
                    aria-pressed={favorited}
                    onClick={() => setFavorited((v) => !v)}
                >
                    <HeartIcon active={favorited} />
                </button>
                <button
                    type="button"
                    className={
                        compared
                            ? `${styles.action} ${styles.actionActive}`
                            : styles.action
                    }
                    aria-label="К сравнению"
                    aria-pressed={compared}
                    onClick={() => setCompared((v) => !v)}
                >
                    <CompareIcon />
                </button>
            </div>
            <h3 className={styles.title}>
                <Link
                    href={`/projects/${project.slug}`}
                    className={styles.titleLink}
                >
                    {cardTitle}
                </Link>
            </h3>
            <ul className={styles.stats}>
                <li className={styles.stat}>
                    <img
                        src={STAT_ICONS.area}
                        alt=""
                        className={styles.statIcon}
                    />
                    <span
                        className={styles.statValue}
                    >{`${project.area} м²`}</span>
                    <span className={styles.statLabel}>{statLabels.area}</span>
                </li>
                <li className={styles.stat}>
                    <img
                        src={STAT_ICONS.bedrooms}
                        alt=""
                        className={styles.statIcon}
                    />
                    <span className={styles.statValue}>{project.bedrooms}</span>
                    <span className={styles.statLabel}>
                        {statLabels.bedrooms}
                    </span>
                </li>
                <li className={styles.stat}>
                    <img
                        src={STAT_ICONS.bathrooms}
                        alt=""
                        className={styles.statIcon}
                    />
                    <span className={styles.statValue}>
                        {project.bathrooms}
                    </span>
                    <span className={styles.statLabel}>
                        {statLabels.bathrooms}
                    </span>
                </li>
                <li className={styles.stat}>
                    <img
                        src={STAT_ICONS.floors}
                        alt=""
                        className={styles.statIcon}
                    />
                    <span className={styles.statValue}>{project.floors}</span>
                    <span className={styles.statLabel}>
                        {statLabels.floors}
                    </span>
                </li>
                <li className={styles.stat}>
                    <img
                        src={STAT_ICONS.size}
                        alt=""
                        className={styles.statIcon}
                    />
                    <span className={styles.statValue}>
                        {project.specs.dimensions}
                    </span>
                    <span className={styles.statLabel}>{statLabels.size}</span>
                </li>
            </ul>
            <div className={styles.footer}>
                <span className={styles.priceLabel}>{priceLabel}</span>
                <span className={styles.priceValue}>
                    {formatPrice(project.price)}
                </span>
            </div>
        </article>
    );
}

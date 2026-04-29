"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import type { Project } from "@/types/project";
import { PROJECT_TECHNOLOGY_LABELS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
    project: Project;
    variant?: "grid" | "list";
}

function HeartIcon({ active }: { active: boolean }) {
    return (
        <svg
            width="18"
            height="16"
            viewBox="0 0 20 18"
            fill={active ? "currentColor" : "none"}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M5.95 1C3.21625 1 1 3.29564 1 6.12731C1 11.2546 6.85 15.9158 10 17C13.15 15.9158 19 11.2546 19 6.12731C19 3.29564 16.7837 1 14.05 1C12.376 1 10.8955 1.86092 10 3.17864C9.54348 2.50528 8.93708 1.95573 8.23211 1.57651C7.52715 1.19728 6.74436 0.999536 5.95 1Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CompareIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 23 23"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path d="M22.9038 14.0405L19.0288 7.58168L22.5064 6.61568C22.865 6.51608 23.0749 6.14467 22.9753 5.7861C22.8757 5.42754 22.5042 5.21757 22.1457 5.31721L17.8228 6.51797L17.8219 6.51824L12.1739 8.08709V0.67395C12.1739 0.301817 11.8722 0.00012207 11.5 0.00012207C11.1279 0.00012207 10.8262 0.301817 10.8262 0.67395V8.46143L4.83169 10.1265L4.83075 10.1267L0.493674 11.3314C0.135062 11.431 -0.0748127 11.8024 0.0247342 12.161C0.107615 12.4592 0.378449 12.6547 0.673586 12.6547C0.734669 12.6546 0.795465 12.6463 0.854306 12.6299L3.55797 11.8789L0.0962947 17.6491C0.0334726 17.7538 0.000276455 17.8736 0.000251781 17.9957C0.000251781 20.755 2.24513 22.9998 5.00441 22.9998C7.76378 22.9998 10.0086 20.755 10.0086 17.9957C10.0086 17.8736 9.97542 17.7538 9.91258 17.6491L6.03753 11.1902L16.5491 8.27042L13.0874 14.0405C13.0246 14.1452 12.9914 14.265 12.9914 14.3872C12.9914 17.1464 15.2363 19.3912 17.9956 19.3912C19.3322 19.3912 20.5888 18.8707 21.5341 17.9255C22.4793 16.9803 22.9998 15.7237 22.9997 14.3871C22.9998 14.265 22.9666 14.1452 22.9038 14.0405Z" />
        </svg>
    );
}

function pluralFloors(n: number) {
    if (n === 1) return "этаж";
    if (n >= 2 && n <= 4) return "этажа";
    return "этажей";
}

function pluralBedrooms(n: number) {
    if (n === 1) return "спальня";
    if (n >= 2 && n <= 4) return "спальни";
    return "спален";
}

function pluralBathrooms(n: number) {
    if (n === 1) return "санузел";
    if (n >= 2 && n <= 4) return "санузла";
    return "санузлов";
}

export function ProductCard({ project, variant = "grid" }: ProductCardProps) {
    const [favorited, setFavorited] = useState(false);
    const [compared, setCompared] = useState(false);

    const stop = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <article className={`${styles.card} ${styles[variant]}`}>
            <Link
                href={`/project/${project.slug}`}
                className={styles.cardLink}
                aria-label={`Проект ${project.name}`}
            />
            <div
                className={styles.image}
                style={{ backgroundImage: `url(${project.image})` }}
            />
            <div className={styles.gradient} />

            <div className={styles.tags}>
                <span className={styles.tag}>
                    {project.floors} {pluralFloors(project.floors)}
                </span>
                <span className={styles.tag}>
                    {PROJECT_TECHNOLOGY_LABELS[project.technology]}
                </span>
            </div>

            <div className={styles.actions}>
                <button
                    type="button"
                    className={`${styles.action} ${compared ? styles.actionActive : ""}`}
                    aria-label="К сравнению"
                    aria-pressed={compared}
                    onClick={(e) => {
                        stop(e);
                        setCompared((v) => !v);
                    }}
                >
                    <CompareIcon />
                </button>
                <button
                    type="button"
                    className={`${styles.action} ${favorited ? styles.actionActive : ""}`}
                    aria-label="В избранное"
                    aria-pressed={favorited}
                    onClick={(e) => {
                        stop(e);
                        setFavorited((v) => !v);
                    }}
                >
                    <HeartIcon active={favorited} />
                </button>
            </div>

            <div className={styles.body}>
                <div className={styles.bodyMain}>
                    <h3 className={styles.title}>{project.name}</h3>
                    <ul className={styles.stats}>
                        <li className={styles.stat}>{project.area} м²</li>
                        <li className={styles.stat}>
                            {project.bedrooms} {pluralBedrooms(project.bedrooms)}
                        </li>
                        <li className={styles.stat}>
                            {project.bathrooms}{" "}
                            {pluralBathrooms(project.bathrooms)}
                        </li>
                        <li className={styles.stat}>
                            {project.specs.dimensions} м
                        </li>
                    </ul>
                </div>
                <div className={styles.price}>
                    {formatPrice(project.price)}
                </div>
            </div>
        </article>
    );
}

"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import type { Project } from "@/domain/project";
import { PROJECT_TECHNOLOGY_LABELS } from "@/domain/technology";
import { formatPrice } from "@/lib/utils";
import { CompareScaleIcon, HeartIcon } from "./icons";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
    project: Project;
    variant?: "grid" | "list";
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
                    <CompareScaleIcon />
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
                            {project.bedrooms}{" "}
                            {pluralBedrooms(project.bedrooms)}
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
                <div className={styles.price}>{formatPrice(project.price)}</div>
            </div>
        </article>
    );
}

import Link from "next/link";
import type { Project } from "@/types/project";
import { TECHNOLOGY_GENITIVE } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import styles from "./FeaturedProjectCard.module.css";

const STAT_ICONS = {
    area: "/images/projects/icons/ploshhad-doma.svg",
    bedrooms: "/images/projects/icons/kolichestvo-spalen.svg",
    bathrooms: "/images/projects/icons/kolichestvo-vannyh-komnat.svg",
    floors: "/images/projects/icons/kolichestvo-etazhej.svg",
    size: "/images/projects/icons/razmer-doma.svg",
};

interface FeaturedProjectCardProps {
    project: Project;
    titlePrefix: string;
    priceLabel: string;
    statLabels: {
        area: string;
        bedrooms: string;
        bathrooms: string;
        floors: string;
        size: string;
    };
}

export function FeaturedProjectCard({
    project,
    titlePrefix,
    priceLabel,
    statLabels,
}: FeaturedProjectCardProps) {
    const techWord =
        TECHNOLOGY_GENITIVE[project.technology] ?? project.technology;
    const cardTitle = `${titlePrefix} ${techWord} ${project.specs.dimensions}м`;

    return (
        <Link
            href={`/projects/${project.slug}`}
            className={styles.card}
            aria-label={`${cardTitle} — ${project.name}`}
        >
            <div className={styles.imageWrapper}>
                <div
                    className={styles.image}
                    style={{ backgroundImage: `url(${project.image})` }}
                />
                <span className={styles.badge}>{project.name}</span>
            </div>
            <h3 className={styles.title}>{cardTitle}</h3>
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
        </Link>
    );
}

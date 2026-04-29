import Link from "next/link";
import {
    PROJECT_HUB_CATEGORIES,
    type ProjectCategoryInfo,
    type ProjectCategorySlug,
} from "@/lib/constants";
import styles from "./ProjectsHub.module.css";

const TILE_VARIANT: Record<ProjectCategorySlug, string> = {
    all: styles.tileAll,
    "gas-concrete": styles.tileGasConcrete,
    brick: styles.tileBrick,
    frame: styles.tileFrame,
    sip: styles.tileSip,
    fachwerk: styles.tileFachwerk,
};

function ArrowIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M3 9H15M15 9L9 3M15 9L9 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CategoryTile({ category }: { category: ProjectCategoryInfo }) {
    const isAccent = category.slug === "all";
    return (
        <Link
            href={`/projects/${category.slug}`}
            className={`${styles.tile} ${TILE_VARIANT[category.slug]} ${isAccent ? styles.tileAccent : ""}`}
            style={
                isAccent
                    ? undefined
                    : { backgroundImage: `url(${category.image})` }
            }
        >
            <span className={styles.gradient} aria-hidden="true" />
            <span className={styles.arrow} aria-hidden="true">
                <ArrowIcon />
            </span>
            <span className={styles.body}>
                <span className={styles.title}>{category.title}</span>
                <span className={styles.description}>
                    {category.description}
                </span>
            </span>
        </Link>
    );
}

export function ProjectsHub() {
    return (
        <div className={styles.grid}>
            {PROJECT_HUB_CATEGORIES.map((category) => (
                <CategoryTile key={category.slug} category={category} />
            ))}
        </div>
    );
}

import Link from "next/link";
import {
    CONSTRUCTION_INDIVIDUAL_ALL,
    CONSTRUCTION_INDIVIDUAL_HEADING,
    CONSTRUCTION_INDIVIDUAL_LEAD,
} from "@/lib/copy";
import type { TechFamily } from "@/lib/techFamily";
import type { MergedProject } from "@/types/catalog";
import { ProjectCard } from "@/widgets/project-card/project-card";
import styles from "./individual.module.css";

function AllArrow() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M5 12h12.5M13.5 6.5L20 12l-6.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ConstructionHubIndividual({
    family,
    projects,
    allHref,
}: {
    family: TechFamily;
    projects: MergedProject[];
    allHref: string;
}) {
    if (projects.length === 0) return null;

    return (
        <section data-section="construction-individual" className={styles.root}>
            <div className={styles.head}>
                <div className={styles.copy}>
                    <h2 className={styles.title}>
                        {CONSTRUCTION_INDIVIDUAL_HEADING[family]}
                    </h2>
                    <p className={styles.lead}>{CONSTRUCTION_INDIVIDUAL_LEAD}</p>
                </div>
                <Link href={allHref} className={styles.all}>
                    {CONSTRUCTION_INDIVIDUAL_ALL}
                    <AllArrow />
                </Link>
            </div>
            <div className={styles.grid}>
                {projects.map((project, i) => (
                    <ProjectCard
                        key={project.slug}
                        project={project}
                        layout="grid"
                        priority={i < 2}
                    />
                ))}
            </div>
        </section>
    );
}

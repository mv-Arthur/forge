import Link from "next/link";
import {
    PLANNING_ARCHIVE_ALL,
    PLANNING_ARCHIVE_HEADING,
    PLANNING_ARCHIVE_LEAD,
} from "@/lib/copy";
import { routes } from "@/lib/routes";
import { ProjectCard } from "@/widgets/project-card/project-card";
import type { MergedProject } from "@/types/catalog";
import styles from "./archive.module.css";

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

export function IndividualPlanningArchive({
    projects,
}: {
    projects: MergedProject[];
}) {
    if (projects.length === 0) return null;

    return (
        <section data-section="planning-archive" className={styles.root}>
            <div className={styles.head}>
                <div className={styles.copy}>
                    <h2 className={styles.title}>{PLANNING_ARCHIVE_HEADING}</h2>
                    <p className={styles.lead}>{PLANNING_ARCHIVE_LEAD}</p>
                </div>
                <Link
                    href={routes.projects({ kind: "individual" })}
                    className={styles.all}
                >
                    {PLANNING_ARCHIVE_ALL}
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

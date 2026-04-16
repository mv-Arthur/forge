import Link from "next/link";
import type { Project } from "@/types/project";
import { formatPrice, formatArea } from "@/lib/utils";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link
            href={`/projects/${project.slug}`}
            className={styles.card}
        >
            <div className={styles.imageWrapper}>
                <div
                    className={styles.image}
                    style={{ backgroundImage: `url(${project.image})` }}
                />
                <div className={styles.imageOverlay} />
                <span className={styles.price}>
                    от {formatPrice(project.price)}
                </span>
            </div>
            <div className={styles.body}>
                <h3 className={styles.name}>
                    {project.name}{" "}
                    <span className={styles.dims}>
                        {project.specs.dimensions} м
                    </span>
                </h3>
                <div className={styles.specs}>
                    <span>{formatArea(project.area)}</span>
                    <span className={styles.dot} />
                    <span>
                        {project.bedrooms}{" "}
                        {project.bedrooms === 1 ? "спальня" : "спален"}
                    </span>
                    <span className={styles.dot} />
                    <span>
                        {project.floors}{" "}
                        {project.floors === 1 ? "этаж" : "этажа"}
                    </span>
                </div>
            </div>
        </Link>
    );
}

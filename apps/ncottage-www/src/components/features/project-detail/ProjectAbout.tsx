import type { Project } from "@/domain/project";
import {
    PROJECT_FEATURE_LABELS,
    PROJECT_LIVING_TYPE_LABELS,
    PROJECT_STYLE_LABELS,
    PROJECT_TECHNOLOGY_LABELS,
} from "@/domain/technology";
import { CheckIcon } from "./icons";
import styles from "./ProjectAbout.module.css";

interface ProjectAboutProps {
    project: Project;
}

export function ProjectAbout({ project }: ProjectAboutProps) {
    const meta = [
        PROJECT_TECHNOLOGY_LABELS[project.technology],
        PROJECT_STYLE_LABELS[project.style],
        PROJECT_LIVING_TYPE_LABELS[project.livingType],
    ];

    return (
        <div className={styles.about}>
            <div className={styles.tags}>
                {meta.map((m) => (
                    <span key={m} className={styles.tag}>
                        {m}
                    </span>
                ))}
            </div>
            <p className={styles.description}>{project.description}</p>

            {project.features.length > 0 && (
                <ul className={styles.features}>
                    {project.features.map((f) => (
                        <li key={f} className={styles.feature}>
                            <CheckIcon className={styles.featureIcon} />
                            <span>{PROJECT_FEATURE_LABELS[f]}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

import { ProductCard } from "@/components/shared/ProductCard";
import type { Project } from "@/domain/project";
import styles from "./SimilarProjects.module.css";

interface SimilarProjectsProps {
    projects: Project[];
}

export function SimilarProjects({ projects }: SimilarProjectsProps) {
    if (projects.length === 0) return null;
    return (
        <div className={styles.grid}>
            {projects.map((p) => (
                <ProductCard key={p.slug} project={p} />
            ))}
        </div>
    );
}

import type { Project } from "@/domain/project";
import { formatPrice } from "@/lib/utils";
import styles from "./ProjectMobileBar.module.css";

interface ProjectMobileBarProps {
    project: Project;
}

export function ProjectMobileBar({ project }: ProjectMobileBarProps) {
    return (
        <div className={styles.bar}>
            <div className={styles.priceCol}>
                <span className={styles.priceLabel}>от</span>
                <span className={styles.price}>
                    {formatPrice(project.price)}
                </span>
            </div>
            <a href="#lead" className={styles.cta}>
                Заказать расчёт
            </a>
        </div>
    );
}

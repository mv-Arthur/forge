import type { ReactNode } from "react";
import styles from "./projects-catalog__section.module.css";

export function ProjectsCatalogSection({
    title,
    lead,
    children,
}: {
    title: string;
    lead: string;
    children: ReactNode;
}) {
    return (
        <section className={styles.section} data-section="catalog-line">
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.lead}>{lead}</p>
            {children}
        </section>
    );
}

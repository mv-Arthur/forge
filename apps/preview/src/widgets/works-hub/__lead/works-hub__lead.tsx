import type { ReactNode } from "react";
import styles from "../works-hub.module.css";

export function WorksHubLead({
    heading,
    lead,
    form,
}: {
    heading: string;
    lead: string;
    form: ReactNode;
}) {
    return (
        <section id="lead" data-section="works-visit" className={styles.visit}>
            <h2 className={styles.visitTitle}>{heading}</h2>
            <p className={styles.visitLead}>{lead}</p>
            <div className={styles.visitForm}>{form}</div>
        </section>
    );
}

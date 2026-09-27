import type { ReactNode } from "react";
import { PLANNING_FORM_HEADING, PLANNING_FORM_LEAD } from "@/lib/copy";
import styles from "./lead.module.css";

export function IndividualPlanningLead({ form }: { form: ReactNode }) {
    return (
        <section id="lead" data-section="planning-lead" className={styles.root}>
            <h2 className={styles.title}>{PLANNING_FORM_HEADING}</h2>
            <p className={styles.lead}>{PLANNING_FORM_LEAD}</p>
            <div className={styles.form}>{form}</div>
        </section>
    );
}

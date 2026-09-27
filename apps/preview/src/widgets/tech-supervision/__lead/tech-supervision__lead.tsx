import type { ReactNode } from "react";
import {
    TECH_SUPERVISION_FORM_HEADING,
    TECH_SUPERVISION_FORM_LEAD,
} from "@/lib/copy";
import styles from "./lead.module.css";

export function TechSupervisionLead({ form }: { form: ReactNode }) {
    return (
        <section
            id="lead"
            data-section="tech-supervision-lead"
            className={styles.root}
        >
            <h2 className={styles.title}>{TECH_SUPERVISION_FORM_HEADING}</h2>
            <p className={styles.lead}>{TECH_SUPERVISION_FORM_LEAD}</p>
            <div className={styles.form}>{form}</div>
        </section>
    );
}

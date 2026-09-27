import type { ReactNode } from "react";
import {
    ENGINEERING_EXTERNAL_FORM_HEADING,
    ENGINEERING_EXTERNAL_FORM_LEAD,
} from "@/lib/copy";
import styles from "./lead.module.css";

export function EngineeringExternalLead({ form }: { form: ReactNode }) {
    return (
        <section
            id="lead"
            data-section="engineering-external-lead"
            className={styles.root}
        >
            <h2 className={styles.title}>{ENGINEERING_EXTERNAL_FORM_HEADING}</h2>
            <p className={styles.lead}>{ENGINEERING_EXTERNAL_FORM_LEAD}</p>
            <div className={styles.form}>{form}</div>
        </section>
    );
}

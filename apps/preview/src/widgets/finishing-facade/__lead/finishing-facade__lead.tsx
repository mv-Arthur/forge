import type { ReactNode } from "react";
import { FACADE_FORM_HEADING, FACADE_FORM_LEAD } from "@/lib/copy";
import styles from "./lead.module.css";

export function FinishingFacadeLead({ form }: { form: ReactNode }) {
    return (
        <section id="lead" data-section="facade-lead" className={styles.root}>
            <h2 className={styles.title}>{FACADE_FORM_HEADING}</h2>
            <p className={styles.lead}>{FACADE_FORM_LEAD}</p>
            <div className={styles.form}>{form}</div>
        </section>
    );
}

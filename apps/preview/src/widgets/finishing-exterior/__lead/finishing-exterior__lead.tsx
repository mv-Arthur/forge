import type { ReactNode } from "react";
import { EXTERIOR_FORM_HEADING, EXTERIOR_FORM_LEAD } from "@/lib/copy";
import styles from "./lead.module.css";

export function FinishingExteriorLead({ form }: { form: ReactNode }) {
    return (
        <section id="lead" data-section="exterior-lead" className={styles.root}>
            <h2 className={styles.title}>{EXTERIOR_FORM_HEADING}</h2>
            <p className={styles.lead}>{EXTERIOR_FORM_LEAD}</p>
            <div className={styles.form}>{form}</div>
        </section>
    );
}

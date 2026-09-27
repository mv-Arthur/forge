import type { ReactNode } from "react";
import { PAINT_FORM_HEADING, PAINT_FORM_LEAD } from "@/lib/copy";
import styles from "./lead.module.css";

export function FinishingPaintLead({ form }: { form: ReactNode }) {
    return (
        <section id="lead" data-section="paint-lead" className={styles.root}>
            <h2 className={styles.title}>{PAINT_FORM_HEADING}</h2>
            <p className={styles.lead}>{PAINT_FORM_LEAD}</p>
            <div className={styles.form}>{form}</div>
        </section>
    );
}

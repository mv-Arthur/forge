import type { ReactNode } from "react";
import { TECH_HUB_LEAD_HEADING, TECH_HUB_LEAD_TEXT } from "@/lib/copy";
import styles from "./lead.module.css";

export function TechFaqLead({ form }: { form: ReactNode }) {
    return (
        <section id="lead" data-section="tech-faq-lead" className={styles.root}>
            <h2 className={styles.title}>{TECH_HUB_LEAD_HEADING}</h2>
            <p className={styles.lead}>{TECH_HUB_LEAD_TEXT}</p>
            <div className={styles.form}>{form}</div>
        </section>
    );
}

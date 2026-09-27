import type { ReactNode } from "react";
import { SITE_SURVEY_FORM_HEADING, SITE_SURVEY_FORM_LEAD } from "@/lib/copy";
import styles from "./lead.module.css";

export function SiteSurveyLead({ form }: { form: ReactNode }) {
    return (
        <section id="lead" data-section="site-survey-lead" className={styles.root}>
            <h2 className={styles.title}>{SITE_SURVEY_FORM_HEADING}</h2>
            <p className={styles.lead}>{SITE_SURVEY_FORM_LEAD}</p>
            <div className={styles.form}>{form}</div>
        </section>
    );
}

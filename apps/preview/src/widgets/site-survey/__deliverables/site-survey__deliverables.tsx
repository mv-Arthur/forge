import { SITE_SURVEY_DELIVERABLES_HEADING } from "@/lib/copy";
import { DELIVERABLES } from "../lib/content";
import { DeliverableIcon } from "./icons";
import styles from "./deliverables.module.css";

export function SiteSurveyDeliverables() {
    return (
        <section
            data-section="site-survey-deliverables"
            className={styles.root}
        >
            <h2 className={styles.heading}>
                {SITE_SURVEY_DELIVERABLES_HEADING}
            </h2>
            <div className={styles.grid}>
                {DELIVERABLES.map((item) => (
                    <article key={item.id} className={styles.card}>
                        <span className={styles.icon} aria-hidden>
                            <DeliverableIcon id={item.id} />
                        </span>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.text}>{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

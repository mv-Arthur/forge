import { PLANNING_CTA, PLANNING_LEAD, PLANNING_TITLE } from "@/lib/copy";
import styles from "./hero.module.css";

export function IndividualPlanningHero() {
    return (
        <section data-section="planning-hero" className={styles.root}>
            <h1 className={styles.title}>{PLANNING_TITLE}</h1>
            <p className={styles.lead}>{PLANNING_LEAD}</p>
            <a href="#lead" className={`btn btn-primary ${styles.cta}`}>
                {PLANNING_CTA}
            </a>
        </section>
    );
}

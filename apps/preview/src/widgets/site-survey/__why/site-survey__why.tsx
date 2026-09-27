import {
    SITE_SURVEY_WHY_HEADING,
    SITE_SURVEY_WHY_LEAD,
    SITE_SURVEY_WHY_LIST_HEADING,
} from "@/lib/copy";
import { WHY_ITEMS } from "../lib/content";
import styles from "./why.module.css";

export function SiteSurveyWhy() {
    return (
        <section data-section="site-survey-why" className={styles.root}>
            <div className={styles.intro}>
                <h2 className={styles.heading}>{SITE_SURVEY_WHY_HEADING}</h2>
                <p className={styles.lead}>{SITE_SURVEY_WHY_LEAD}</p>
            </div>
            <div className={styles.panel}>
                <h3 className={styles.panelTitle}>
                    {SITE_SURVEY_WHY_LIST_HEADING}
                </h3>
                <ul className={styles.list}>
                    {WHY_ITEMS.map((item) => (
                        <li key={item.id} className={styles.item}>
                            {item.text}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

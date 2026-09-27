import {
    TECH_SUPERVISION_WHY_HEADING,
    TECH_SUPERVISION_WHY_LEAD,
    TECH_SUPERVISION_WHY_LIST_HEADING,
} from "@/lib/copy";
import { WHY_ITEMS } from "../lib/content";
import styles from "./why.module.css";

export function TechSupervisionWhy() {
    return (
        <section data-section="tech-supervision-why" className={styles.root}>
            <div className={styles.intro}>
                <h2 className={styles.heading}>
                    {TECH_SUPERVISION_WHY_HEADING}
                </h2>
                <p className={styles.lead}>{TECH_SUPERVISION_WHY_LEAD}</p>
            </div>
            <div className={styles.panel}>
                <h3 className={styles.panelTitle}>
                    {TECH_SUPERVISION_WHY_LIST_HEADING}
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

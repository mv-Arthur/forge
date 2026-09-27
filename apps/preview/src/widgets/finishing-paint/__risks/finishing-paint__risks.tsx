import {
    PAINT_RISKS_HEADING,
    PAINT_RISKS_LEAD,
    PAINT_RISKS_LIST_HEADING,
} from "@/lib/copy";
import { PAINT_RISKS } from "../lib/content";
import styles from "./risks.module.css";

export function FinishingPaintRisks() {
    return (
        <section data-section="paint-risks" className={styles.root}>
            <div>
                <h2 className={styles.heading}>{PAINT_RISKS_HEADING}</h2>
                <p className={styles.lead}>{PAINT_RISKS_LEAD}</p>
            </div>
            <div className={styles.panel}>
                <h3 className={styles.panelTitle}>{PAINT_RISKS_LIST_HEADING}</h3>
                <ul className={styles.list}>
                    {PAINT_RISKS.map((item) => (
                        <li key={item.id} className={styles.item}>
                            {item.text}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

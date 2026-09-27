import { PAINT_APPROACH_HEADING, PAINT_APPROACH_TEXT } from "@/lib/copy";
import styles from "./approach.module.css";

export function FinishingPaintApproach() {
    return (
        <section data-section="paint-approach" className={styles.root}>
            <div className={styles.inner}>
                <h2 className={styles.title}>{PAINT_APPROACH_HEADING}</h2>
                <p className={styles.text}>{PAINT_APPROACH_TEXT}</p>
            </div>
        </section>
    );
}

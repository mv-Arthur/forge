import { PLANNING_NOTE_HEADING, PLANNING_NOTE_TEXT } from "@/lib/copy";
import styles from "./note.module.css";

export function IndividualPlanningNote() {
    return (
        <section data-section="planning-note" className={styles.root}>
            <div className={styles.inner}>
                <h2 className={styles.title}>{PLANNING_NOTE_HEADING}</h2>
                <p className={styles.text}>{PLANNING_NOTE_TEXT}</p>
            </div>
        </section>
    );
}

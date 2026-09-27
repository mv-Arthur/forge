import { PAINT_STEPS_HEADING } from "@/lib/copy";
import { PAINT_STEPS } from "../lib/content";
import styles from "./steps.module.css";

export function FinishingPaintSteps() {
    return (
        <section data-section="paint-steps" className={styles.root}>
            <h2 className={styles.title}>{PAINT_STEPS_HEADING}</h2>
            <ol className={styles.list}>
                {PAINT_STEPS.map((step) => (
                    <li key={step.n} className={styles.item}>
                        <span className={styles.n} aria-hidden>
                            {step.n}
                        </span>
                        <p className={styles.text}>{step.text}</p>
                    </li>
                ))}
            </ol>
        </section>
    );
}

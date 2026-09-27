import { PLANNING_STEPS_HEADING } from "@/lib/copy";
import { PLANNING_STEPS } from "../lib/content";
import styles from "./steps.module.css";

export function IndividualPlanningSteps() {
    return (
        <section data-section="planning-steps" className={styles.root}>
            <h2 className={styles.title}>{PLANNING_STEPS_HEADING}</h2>
            <ol className={styles.list}>
                {PLANNING_STEPS.map((step) => (
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

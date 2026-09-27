import { EXTERIOR_WHEN_HEADING, EXTERIOR_WHEN_LEAD, EXTERIOR_WHEN_NOTE } from "@/lib/copy";
import { EXTERIOR_WHEN_STEPS } from "../lib/content";
import styles from "./when.module.css";

export function FinishingExteriorWhen() {
    return (
        <section data-section="exterior-when" className={styles.root}>
            <h2 className={styles.title}>{EXTERIOR_WHEN_HEADING}</h2>
            <p className={styles.lead}>{EXTERIOR_WHEN_LEAD}</p>
            <ol className={styles.list}>
                {EXTERIOR_WHEN_STEPS.map((step) => (
                    <li key={step.n} className={styles.item}>
                        <span className={styles.n} aria-hidden>
                            {step.n}
                        </span>
                        <p className={styles.text}>{step.text}</p>
                    </li>
                ))}
            </ol>
            <p className={styles.note}>{EXTERIOR_WHEN_NOTE}</p>
        </section>
    );
}

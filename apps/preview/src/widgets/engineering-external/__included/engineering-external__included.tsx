import { ENGINEERING_INCLUDED_HEADING } from "@/lib/copy";
import { INCLUDED_STEPS } from "../lib/content";
import styles from "./included.module.css";

export function EngineeringExternalIncluded() {
    return (
        <section
            data-section="engineering-external-included"
            className={styles.root}
        >
            <h2 className={styles.heading}>{ENGINEERING_INCLUDED_HEADING}</h2>
            <ol className={styles.list}>
                {INCLUDED_STEPS.map((step) => (
                    <li key={step.n} className={styles.item}>
                        <span className={styles.n} aria-hidden>
                            {step.n}
                        </span>
                        <div>
                            <h3 className={styles.title}>{step.title}</h3>
                            <ul className={styles.points}>
                                {step.items.map((line) => (
                                    <li key={line}>{line}</li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}

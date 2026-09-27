import { TECH_SUPERVISION_DIFFER_HEADING } from "@/lib/copy";
import { DIFFER } from "../lib/content";
import { DifferIcon } from "./icons";
import styles from "./differ.module.css";

export function TechSupervisionDiffer() {
    return (
        <section data-section="tech-supervision-differ" className={styles.root}>
            <h2 className={styles.heading}>{TECH_SUPERVISION_DIFFER_HEADING}</h2>
            <div className={styles.grid}>
                {DIFFER.map((item) => (
                    <article key={item.id} className={styles.card}>
                        <span className={styles.icon} aria-hidden>
                            <DifferIcon id={item.id} />
                        </span>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.text}>{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

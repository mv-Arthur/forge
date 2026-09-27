import { ENGINEERING_PRINCIPLES_HEADING } from "@/lib/copy";
import { PRINCIPLES } from "../lib/content";
import styles from "./principles.module.css";

export function EngineeringExternalPrinciples() {
    return (
        <section
            data-section="engineering-external-principles"
            className={styles.root}
        >
            <h2 className={styles.heading}>{ENGINEERING_PRINCIPLES_HEADING}</h2>
            <div className={styles.grid}>
                {PRINCIPLES.map((item) => (
                    <article key={item.id} className={styles.card}>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.text}>{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

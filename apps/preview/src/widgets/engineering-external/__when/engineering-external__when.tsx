import { ENGINEERING_WHEN_HEADING, ENGINEERING_WHEN_LEAD } from "@/lib/copy";
import { WHEN_ITEMS } from "../lib/content";
import styles from "./when.module.css";

export function EngineeringExternalWhen() {
    return (
        <section data-section="engineering-external-when" className={styles.root}>
            <h2 className={styles.heading}>{ENGINEERING_WHEN_HEADING}</h2>
            <p className={styles.lead}>{ENGINEERING_WHEN_LEAD}</p>
            <div className={styles.grid}>
                {WHEN_ITEMS.map((item, index) => (
                    <article key={item.id} className={styles.card}>
                        <span className={styles.n} aria-hidden>
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.text}>{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

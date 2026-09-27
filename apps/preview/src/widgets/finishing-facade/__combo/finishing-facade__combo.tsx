import { FACADE_COMBO_HEADING, FACADE_COMBO_LEAD } from "@/lib/copy";
import { FACADE_COMBOS } from "../lib/content";
import styles from "./combo.module.css";

export function FinishingFacadeCombo() {
    return (
        <section data-section="facade-combo" className={styles.root}>
            <h2 className={styles.heading}>{FACADE_COMBO_HEADING}</h2>
            <p className={styles.lead}>{FACADE_COMBO_LEAD}</p>
            <div className={styles.grid}>
                {FACADE_COMBOS.map((item) => (
                    <article key={item.n} className={styles.card}>
                        <span className={styles.n} aria-hidden>
                            {item.n}
                        </span>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.text}>{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

import { PAINT_BENEFITS } from "../lib/content";
import { PaintBenefitIcon } from "./icons";
import styles from "./benefits.module.css";

export function FinishingPaintBenefits() {
    return (
        <section data-section="paint-benefits" className={styles.root}>
            <div className={styles.grid}>
                {PAINT_BENEFITS.map((item) => (
                    <article key={item.id} className={styles.card}>
                        <span className={styles.icon} aria-hidden>
                            <PaintBenefitIcon id={item.id} />
                        </span>
                        <h2 className={styles.title}>{item.title}</h2>
                        <p className={styles.text}>{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

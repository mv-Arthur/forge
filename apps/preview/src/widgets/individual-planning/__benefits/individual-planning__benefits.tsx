import { PLANNING_BENEFITS } from "../lib/content";
import { BenefitIcon } from "./icons";
import styles from "./benefits.module.css";

export function IndividualPlanningBenefits() {
    return (
        <section data-section="planning-benefits" className={styles.root}>
            <div className={styles.grid}>
                {PLANNING_BENEFITS.map((item) => (
                    <article key={item.id} className={styles.card}>
                        <span className={styles.icon} aria-hidden>
                            <BenefitIcon id={item.id} />
                        </span>
                        <h2 className={styles.title}>{item.title}</h2>
                        <p className={styles.text}>{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

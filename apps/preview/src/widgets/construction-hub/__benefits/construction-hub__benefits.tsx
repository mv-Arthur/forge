import { CONSTRUCTION_BENEFITS_HEADING } from "@/lib/copy";
import type { TechFamily } from "@/lib/techFamily";
import { CONSTRUCTION_BENEFITS } from "../lib/content";
import { BenefitIcon } from "./icons";
import styles from "./benefits.module.css";

export function ConstructionHubBenefits({ family }: { family: TechFamily }) {
    return (
        <section data-section="construction-benefits" className={styles.root}>
            <h2 className={styles.heading}>
                {CONSTRUCTION_BENEFITS_HEADING[family]}
            </h2>
            <div className={styles.grid}>
                {CONSTRUCTION_BENEFITS[family].map((item) => (
                    <article key={item.id} className={styles.card}>
                        <span className={styles.icon} aria-hidden>
                            <BenefitIcon id={item.id} />
                        </span>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.text}>{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

import { ENGINEERING_WHY_HEADING } from "@/lib/copy";
import { WHY_ITEMS } from "../lib/content";
import type { EngineeringExternalStat } from "../engineering-external.types";
import styles from "./why.module.css";

export function EngineeringExternalWhy({
    stats,
}: {
    stats: EngineeringExternalStat[];
}) {
    return (
        <section data-section="engineering-external-why" className={styles.root}>
            <div className={styles.intro}>
                <h2 className={styles.heading}>{ENGINEERING_WHY_HEADING}</h2>
                {stats.length > 0 ? (
                    <div className={styles.stats}>
                        {stats.map((stat) => (
                            <div key={stat.hint} className={styles.stat}>
                                <div className={styles.value}>{stat.value}</div>
                                <div className={styles.hint}>{stat.hint}</div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
            <div className={styles.grid}>
                {WHY_ITEMS.map((item) => (
                    <article key={item.id} className={styles.card}>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.text}>{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

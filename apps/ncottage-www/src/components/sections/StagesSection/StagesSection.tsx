import type { StagesSectionContent } from "@/lib/constants";
import styles from "./StagesSection.module.css";

interface StagesSectionProps {
    title: StagesSectionContent["title"];
    stages: StagesSectionContent["stages"];
}

export function StagesSection({ title, stages }: StagesSectionProps) {
    return (
        <section className={styles.section}>
            <div className={styles.wrapper}>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.list}>
                    {stages.map((stage) => (
                        <div key={stage.num} className={styles.item}>
                            <div className={styles.num}>{stage.num}</div>
                            <div className={styles.itemTitle}>
                                {stage.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

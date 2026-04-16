import { Container } from "@/components/ui/Container";
import styles from "./StagesSection.module.css";

const STAGES = [
    { num: "01", title: "Встреча в офисе" },
    { num: "02", title: "Заключение договора" },
    { num: "03", title: "Разработка проекта" },
    { num: "04", title: "Строительство дома" },
    { num: "05", title: "Технический надзор" },
    { num: "06", title: "Сдача дома" },
];

export function StagesSection() {
    return (
        <section className={styles.section}>
            <Container>
                <h2 className={styles.title}>Этапы работы с нами</h2>
                <div className={styles.grid}>
                    {STAGES.map((stage) => (
                        <div key={stage.num} className={styles.item}>
                            <span className={styles.num}>{stage.num}</span>
                            <span className={styles.itemTitle}>
                                {stage.title}
                            </span>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

import { Container } from "@/components/ui/Container";
import styles from "./CtaSection.module.css";

export function CtaSection() {
    return (
        <section className={styles.section}>
            <Container className={styles.inner}>
                <h2 className={styles.title}>
                    Хотите оригинальный дом, не похожий ни на один другой?
                </h2>
                <p className={styles.text}>
                    Закажите разработку индивидуального проекта с учетом всех
                    ваших пожеланий и предпочтений!
                </p>
                <button className={styles.button}>
                    Оставить заявку на проектирование
                </button>
            </Container>
        </section>
    );
}

import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Акции — Новый Коттедж",
    description: "Актуальные акции и специальные предложения на строительство.",
};

const PROMOTIONS = [
    {
        title: "Проект в подарок",
        description:
            "При заказе строительства дома под ключ — разработка проекта бесплатно. Экономия до 150 000 ₽.",
        badge: "Хит",
    },
    {
        title: "Зимняя скидка 10%",
        description:
            "При заключении договора на строительство в зимний период — скидка 10% на все работы.",
        badge: "Сезонная",
    },
    {
        title: "Приведи друга",
        description:
            "Порекомендуйте нас другу, и вы оба получите скидку 50 000 ₽ на строительство.",
        badge: "Бонус",
    },
];

export default function PromotionsPage() {
    return (
        <section className={styles.page}>
            <Container>
                <SectionHeading
                    label="Акции"
                    title="Специальные предложения"
                    description="Выгодные условия на строительство загородных домов."
                />
                <div className={styles.grid}>
                    {PROMOTIONS.map((promo) => (
                        <div key={promo.title} className={styles.card}>
                            <span className={styles.badge}>{promo.badge}</span>
                            <h3 className={styles.cardTitle}>{promo.title}</h3>
                            <p className={styles.cardText}>
                                {promo.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

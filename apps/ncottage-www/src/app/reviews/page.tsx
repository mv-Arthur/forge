import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getReviews } from "@/lib/data";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Отзывы клиентов — Новый Коттедж",
    description: "Отзывы наших клиентов о строительстве домов.",
};

export default function ReviewsPage() {
    const reviews = getReviews();

    return (
        <section className={styles.page}>
            <Container>
                <SectionHeading
                    label="Отзывы"
                    title="Что говорят наши клиенты"
                />
                <div className={styles.grid}>
                    {reviews.map((review) => (
                        <div key={review.id} className={styles.card}>
                            <p className={styles.text}>{review.text}</p>
                            <div className={styles.author}>
                                <div className={styles.avatar}>
                                    {review.author[0]}
                                </div>
                                <div>
                                    <p className={styles.name}>
                                        {review.author}
                                    </p>
                                    <p className={styles.date}>{review.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

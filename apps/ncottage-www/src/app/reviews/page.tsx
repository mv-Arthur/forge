import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getReviews } from "@/data/reviews";
import { getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

const metrics = [
    { value: "320+", label: "построенных домов" },
    { value: "95%", label: "клиентов рекомендуют компанию" },
    { value: "с 2007", label: "года строим дома" },
];

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeo();
    return buildPageMetadata({
        seo,
        title: seo.indexes["reviews"].title,
        description: seo.indexes["reviews"].description,
        path: "/reviews",
    });
}

export default async function ReviewsPage() {
    const reviews = await getReviews();

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Отзывы" },
                    ]}
                />

                <section className={styles.hero}>
                    <SectionHeading
                        eyebrow="Опыт клиентов"
                        title="Отзывы тех, кто уже"
                        titleAccent="переехал"
                        lead="Собрали отзывы клиентов: о выборе проекта, контроле стройки, сроках, работе менеджеров и качестве готовых домов."
                        align="left"
                        tone="h1"
                    />
                    <div className={styles.metrics}>
                        {metrics.map((metric) => (
                            <div
                                key={metric.label}
                                className={styles.metricCard}
                            >
                                <strong>{metric.value}</strong>
                                <span>{metric.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section
                    className={styles.reviewsGrid}
                    aria-label="Отзывы клиентов"
                >
                    {reviews.map((review) => (
                        <article key={review.id} className={styles.card}>
                            <div className={styles.cardTop}>
                                <span className={styles.type}>
                                    {review.type}
                                </span>
                                <time>{review.date}</time>
                            </div>
                            <p className={styles.text}>«{review.text}»</p>
                            <footer className={styles.author}>
                                {review.author}
                            </footer>
                        </article>
                    ))}
                </section>

                <section className={styles.storySection}>
                    <div className={styles.storyPanel}>
                        <SectionHeading
                            eyebrow="Посмотреть вживую"
                            title="Лучший отзыв — готовый дом"
                            titleAccent="и разговор с владельцем"
                            lead="Покажем построенные объекты рядом с вашим районом, объясним решения по фундаменту, стенам и инженерии, а при возможности познакомим с владельцами домов."
                            align="left"
                            className={styles.sectionHead}
                        />
                        <Link className={styles.storyCta} href="/works">
                            Смотреть построенные дома
                        </Link>
                    </div>
                    <div className={styles.storyImage} aria-hidden="true" />
                </section>

                <section className={styles.ctaBlock}>
                    <div>
                        <h2>Хотите посмотреть готовые объекты?</h2>
                        <p>
                            Организуем выезд на построенные дома и покажем, как
                            выглядят проекты после сдачи.
                        </p>
                    </div>
                    <Link className={styles.cta} href="/works">
                        Перейти к построенным домам
                    </Link>
                </section>
            </Container>
        </section>
    );
}

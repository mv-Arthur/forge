import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.css";

const reviews = [
    {
        author: "Алексей",
        date: "22.02.2019",
        type: "Каркасный дом",
        text: "Выбирали каркасный дом и до договора ездили смотреть реальный объект. Менеджер подробно объяснил нюансы технологии, а типовой проект адаптировали под нашу планировку. Дом под крышу собрали за три недели, качеством работ остались довольны.",
    },
    {
        author: "Михаил",
        date: "06.03.2019",
        type: "СИП-панели",
        text: "Строили зимой дом из СИП-панелей. Объект с внешней отделкой завершили за два месяца, на стройке установили камеру, поэтому следить за процессом было удобно. Результатом довольны.",
    },
    {
        author: "Оксана",
        date: "22.06.2019",
        type: "Газобетон",
        text: "Участок был сложный, поэтому в компании сначала предложили сделать геологию и только после этого выбирать фундамент. Дом из газобетона с внешней отделкой построили за три месяца, смета получилась разумной.",
    },
    {
        author: "Валерия О.",
        date: "2023",
        type: "Каркасный дом",
        text: "Обратились по рекомендации соседей после покупки участка. Нам помогли выбрать проект и адаптировали «Довер» под наши задачи. Строители соблюдали этапы и сроки, дом получился теплым и полностью соответствует проекту.",
    },
    {
        author: "Виталий А.",
        date: "2023",
        type: "Газобетон 160 м²",
        text: "Заказывал дом из газобетона площадью 160 м². Фундамент, фасады и коробка выполнены аккуратно, без ощущения временных решений. Понравилось, что компания несет ответственность за результат и дает гарантию.",
    },
    {
        author: "Семья Тихомировых",
        date: "2023",
        type: "Дом для постоянного проживания",
        text: "Выбирали подрядчика среди нескольких компаний. Здесь понравились реальные отзывы, готовые проекты и возможность наблюдать за стройкой по видеонаблюдению. Уже живем в доме, он теплый и комфортный.",
    },
    {
        author: "Рустам и Анастасия",
        date: "2023",
        type: "Газобетон 250 м²",
        text: "Нам было важно получить ключи точно к семейной дате. Дом из газобетона построили в срок, за этапами следили по видеосвязи. Отдельно благодарим прораба, бригаду, менеджера и архитектора за постоянную связь.",
    },
    {
        author: "Максим и Елена",
        date: "2023",
        type: "Проект «Касл»",
        text: "Мы пришли без готового понимания будущего дома. Менеджер и архитектор предложили несколько планировок под нашу семью, учли пожелания и помогли остановиться на проекте из газобетона.",
    },
];

const metrics = [
    { value: "320+", label: "построенных домов" },
    { value: "95%", label: "клиентов рекомендуют компанию" },
    { value: "с 2007", label: "года строим дома" },
];

export const metadata: Metadata = {
    title: "Отзывы клиентов | Новый Коттедж",
    description:
        "Отзывы клиентов о строительстве домов из газобетона, кирпича, СИП-панелей и каркасных домов компанией Новый Коттедж.",
    alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
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
                            <div key={metric.label} className={styles.metricCard}>
                                <strong>{metric.value}</strong>
                                <span>{metric.label}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className={styles.reviewsGrid} aria-label="Отзывы клиентов">
                    {reviews.map((review) => (
                        <article key={`${review.author}-${review.type}`} className={styles.card}>
                            <div className={styles.cardTop}>
                                <span className={styles.type}>{review.type}</span>
                                <time>{review.date}</time>
                            </div>
                            <p className={styles.text}>«{review.text}»</p>
                            <footer className={styles.author}>{review.author}</footer>
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
                            Организуем выезд на построенные дома и покажем,
                            как выглядят проекты после сдачи.
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

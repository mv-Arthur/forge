import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EMAIL } from "@/content/contacts";
import { getVacancies } from "@/data/vacancies";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Вакансии — Новый Коттедж",
    description:
        "Открытые вакансии строительной компании Новый Коттедж: архитектор и менеджер по продажам.",
    alternates: { canonical: "/vacancies" },
};

export default async function VacanciesPage() {
    const vacancies = await getVacancies();

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "О компании", href: "/about" },
                        { label: "Вакансии" },
                    ]}
                />

                <section className={styles.hero}>
                    <SectionHeading
                        eyebrow="Карьера"
                        title="Команда, которая проектирует"
                        titleAccent="и строит дома"
                        lead="Ищем специалистов, которым близка спокойная точность в работе: от первой консультации и архитектурного эскиза до стройплощадки и передачи дома заказчику."
                        tone="h1"
                        align="left"
                    />
                    <div className={styles.applyCard}>
                        <span>Отклик</span>
                        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                        <p>
                            В теме письма укажите вакансию, а в письме — опыт,
                            сильные стороны и удобный формат связи.
                        </p>
                    </div>
                </section>

                <div className={styles.list}>
                    {vacancies.map((vacancy) => (
                        <article key={vacancy.title} className={styles.card}>
                            <div className={styles.cardHead}>
                                <div>
                                    <h2>{vacancy.title}</h2>
                                    <p>{vacancy.intro}</p>
                                </div>
                                <div className={styles.meta}>
                                    <span>{vacancy.salary}</span>
                                    <span>Опыт: {vacancy.experience}</span>
                                </div>
                            </div>

                            <div className={styles.columns}>
                                <section>
                                    <h3>Требования</h3>
                                    <ul>
                                        {vacancy.requirements.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </section>
                                <section>
                                    <h3>Условия</h3>
                                    <ul>
                                        {vacancy.conditions.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </section>
                            </div>
                        </article>
                    ))}
                </div>

                <section className={styles.cta}>
                    <div>
                        <span>Отклик</span>
                        <h2>Расскажите о своем опыте и приложите резюме</h2>
                    </div>
                    <a href={`mailto:${EMAIL}`}>Отправить резюме</a>
                </section>
            </Container>
        </section>
    );
}

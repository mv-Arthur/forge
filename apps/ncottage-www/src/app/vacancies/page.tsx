import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getContacts, getSeo, toContactRecords } from "@/data/settings";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { getVacancies } from "@/data/vacancies";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeo();
    return buildPageMetadata({
        seo,
        title: seo.indexes["vacancies"].title,
        description: seo.indexes["vacancies"].description,
        path: "/vacancies",
    });
}

export default async function VacanciesPage() {
    const { email } = toContactRecords(await getContacts());
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
                        <a href={`mailto:${email}`}>{email}</a>
                        <p>
                            В теме письма укажите вакансию, а в письме — опыт,
                            сильные стороны и удобный формат связи.
                        </p>
                    </div>
                </section>

                {vacancies.length === 0 && (
                    <EmptyState
                        title="Открытых вакансий нет"
                        description="Сейчас активных вакансий нет, но мы всегда рады резюме — напишите нам."
                    />
                )}
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
                    <a href={`mailto:${email}`}>Отправить резюме</a>
                </section>
            </Container>
        </section>
    );
}

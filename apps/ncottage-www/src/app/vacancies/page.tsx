import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EMAIL } from "@/content/contacts";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Вакансии — Новый Коттедж",
    description:
        "Открытые вакансии строительной компании Новый Коттедж: архитектор и менеджер по продажам.",
    alternates: { canonical: "/vacancies" },
};

const vacancies = [
    {
        title: "Архитектор",
        intro: "Постоянная занятость для специалиста с опытом 3–6 лет. Работа над индивидуальными проектами малоэтажных домов и визуализациями.",
        salary: "от 100 000 до 200 000 ₽",
        experience: "3–6 лет",
        requirements: [
            "законченное высшее архитектурное образование",
            "уверенное владение ARCHICAD для 3D-визуализаций",
            "понимание каркасной, газоблочной, СИП-панельной и кирпичной технологий",
            "проектирование от эскизов и планировок до рабочей документации",
            "знание СНиП, ГОСТ и умение работать по техническому заданию",
            "коммуникабельность и готовность взаимодействовать с ПТО, строителями и менеджерами",
            "знание Photoshop и Lumion будет преимуществом",
        ],
        conditions: [
            "официальное трудоустройство по ТК РФ",
            "работа в офисе",
            "график 5/2, с 10:00 до 19:00",
            "офисы в Санкт-Петербурге и Москве",
            "дружная команда и возможность карьерного роста",
        ],
    },
    {
        title: "Менеджер по продажам",
        intro: "Полная занятость для менеджера с опытом 1–3 года. Консультирование входящих клиентов без самостоятельного поиска заявок.",
        salary: "от 80 000 ₽ + процент",
        experience: "1–3 года",
        requirements: [
            "опыт работы менеджером по продажам",
            "умение консультировать клиентов и выявлять потребности",
            "проведение телефонных переговоров по теплым обращениям",
            "знание техник продаж будет преимуществом",
            "навык делового общения и уверенное владение ПК",
            "ответственность, целеустремленность, оптимизм и коммуникабельность",
        ],
        conditions: [
            "официальное трудоустройство по ТК РФ",
            "график 5/2, с 10:00 до 19:00",
            "оклад и процент от продаж",
            "работа в офисе на полную занятость",
            "офисы в Санкт-Петербурге и Москве",
            "возможность профессионального роста",
        ],
    },
];

export default function VacanciesPage() {
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

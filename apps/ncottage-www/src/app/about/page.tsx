import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "О компании — Новый Коттедж",
    description:
        "История строительной компании Новый Коттедж, команда, опыт и полный цикл работ по строительству загородных домов.",
    alternates: { canonical: "/about" },
};

const facts = [
    { value: "с 2007", label: "строим загородные дома" },
    { value: "320+", label: "построенных домов" },
    { value: "95%", label: "клиентов рекомендуют компанию" },
    { value: "4", label: "ключевые технологии строительства" },
];

const team = [
    {
        name: "Бочанов Александр Борисович",
        role: "Генеральный директор",
        text: "Профильное образование в промышленном и гражданском строительстве. В строительстве с 2000 года, руководящий опыт — с 2008 года.",
    },
    {
        name: "Чернаков Антон Александрович",
        role: "Специалист по строительству",
        text: "Инженер-строитель с опытом в производстве и строительстве с 2007 года. Участвовал в реализации более 80 домов.",
    },
    {
        name: "Хотенов Петр Евгеньевич",
        role: "Специалист по строительству",
        text: "Работает с оценкой участков, недвижимости и транспорта с 2007 года, помогает учитывать особенности площадки до начала проекта.",
    },
    {
        name: "Мелков Константин Иванович",
        role: "Начальник строительного участка",
        text: "Специалист по строительству жилых и общественных зданий под ключ. Курирует организацию работ на площадке.",
    },
    {
        name: "Романова Екатерина Геннадьевна",
        role: "Главный бухгалтер",
        text: "Ведет финансовый учет и сопровождает договорную часть проектов. Опыт работы главным бухгалтером — с 2008 года.",
    },
    {
        name: "Грицюк Элина Станиславовна",
        role: "Архитектор",
        text: "Работает с планировками, визуализациями и индивидуальными решениями для малоэтажных домов.",
    },
    {
        name: "Воинов Павел Александрович",
        role: "Проектировщик",
        text: "Готовит проектные решения и рабочую документацию с учетом строительной технологии и требований нормативов.",
    },
    {
        name: "Олег Юрьевич Шорохов",
        role: "Инженер по коммуникациям и отделке",
        text: "Отвечает за инженерные системы и внутренние работы, чтобы дом был готов к комфортному проживанию.",
    },
];

const timeline = [
    {
        year: "2007",
        text: "Старт компании, запуск производства в Новгородской области и первые каркасные дома.",
    },
    {
        year: "2009",
        text: "Открытие представительства в Москве и настройка логистики домокомплектов по Московской области.",
    },
    {
        year: "2011",
        text: "Расширение технологий: к каркасным домам добавились газобетон и СИП-панели.",
    },
    {
        year: "2012",
        text: "Открытие филиала в Ленинградской области и офиса в Санкт-Петербурге.",
    },
    {
        year: "2014",
        text: "Усиление проектного отдела и формирование каталога типовых проектов.",
    },
    {
        year: "2016",
        text: "Запуск регулярного обучения сотрудников для повышения качества проектирования и строительства.",
    },
    {
        year: "2018",
        text: "Компания отметила 10 лет работы на рынке загородного строительства.",
    },
    {
        year: "2019",
        text: "Появились типовые проекты кирпичных домов и первые новые малоэтажные объекты в этой технологии.",
    },
    {
        year: "2021",
        text: "Портфель компании вырос до 320+ построенных домов и большого каталога типовых проектов.",
    },
];

export default function AboutPage() {
    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "О компании" },
                    ]}
                />

                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <span className={styles.eyebrow}>Новый Коттедж</span>
                        <h1 className={styles.title}>
                            Строим дома для спокойной жизни за городом
                        </h1>
                        <p className={styles.lead}>
                            Компания ведет проекты полного цикла: от оценки
                            участка, проектирования и 3D-визуализации до
                            поставки домокомплекта, строительства, инженерных
                            сетей и сдачи дома в согласованные сроки.
                        </p>
                    </div>
                    <div className={styles.heroCard}>
                        <p>
                            Проектируем и строим каркасные, кирпичные дома, дома
                            из СИП-панелей и газобетона. Если в каталоге нет
                            подходящего решения, архитекторы подготовят
                            индивидуальный проект под участок, бюджет и сценарий
                            жизни семьи.
                        </p>
                        <dl className={styles.heroMeta}>
                            <div>
                                <dt>Цикл работ</dt>
                                <dd>от проекта до инженерии</dd>
                            </div>
                            <div>
                                <dt>География</dt>
                                <dd>Санкт-Петербург и Москва</dd>
                            </div>
                        </dl>
                    </div>
                </section>

                <section
                    className={styles.factsGrid}
                    aria-label="Факты о компании"
                >
                    {facts.map((fact) => (
                        <div key={fact.label} className={styles.factCard}>
                            <strong>{fact.value}</strong>
                            <span>{fact.label}</span>
                        </div>
                    ))}
                </section>
            </Container>

            <section className={styles.sectionAlt}>
                <Container>
                    <SectionHeading
                        eyebrow="Подход"
                        title="Контроль качества"
                        titleAccent="на каждом этапе"
                        lead="Работа строится вокруг технического надзора, проверенных материалов и проектных решений, которые учитывают действующие СНиП и ГОСТ."
                        align="left"
                        className={styles.sectionHead}
                    />
                    <div className={styles.principles}>
                        <article className={styles.principleCard}>
                            <h3>Полный цикл</h3>
                            <p>
                                Инженерно-геодезические изыскания, оценка
                                участка, проектирование, фундамент, коробка,
                                кровля, окна, двери и подключение инженерных
                                сетей собираются в один управляемый процесс.
                            </p>
                        </article>
                        <article className={styles.principleCard}>
                            <h3>Технический надзор</h3>
                            <p>
                                Строительство сопровождается контролем работ и
                                материалов. Это помогает выдерживать сроки,
                                технологию и итоговое качество дома.
                            </p>
                        </article>
                        <article className={styles.principleCard}>
                            <h3>Надежные поставщики</h3>
                            <p>
                                Компания сотрудничает с российскими
                                производителями строительных материалов и
                                использует собственное производство
                                пиломатериала для деревянных конструкций.
                            </p>
                        </article>
                    </div>
                </Container>
            </section>

            <section className={styles.section}>
                <Container>
                    <SectionHeading
                        eyebrow="Команда"
                        title="Люди, которые ведут"
                        titleAccent="проект"
                        lead="В команде архитекторы, проектировщики, специалисты по строительству, начальники участков, инженеры и сотрудники снабжения."
                        align="left"
                        className={styles.sectionHead}
                    />
                    <div className={styles.teamGrid}>
                        {team.map((person) => (
                            <article
                                key={person.name}
                                className={styles.teamCard}
                            >
                                <div
                                    className={styles.avatar}
                                    aria-hidden="true"
                                >
                                    {person.name
                                        .split(" ")
                                        .slice(0, 2)
                                        .map((part) => part[0])
                                        .join("")}
                                </div>
                                <div>
                                    <h3>{person.name}</h3>
                                    <span>{person.role}</span>
                                    <p>{person.text}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </Container>
            </section>

            <section className={styles.sectionAlt}>
                <Container>
                    <SectionHeading
                        eyebrow="История"
                        title="Развитие компании"
                        titleAccent="с 2007 года"
                        lead="От первых каркасных домов и собственного производства до большого каталога проектов и работы в нескольких регионах."
                        align="left"
                        className={styles.sectionHead}
                    />
                    <ol className={styles.timeline}>
                        {timeline.map((item) => (
                            <li key={item.year} className={styles.timelineItem}>
                                <time>{item.year}</time>
                                <p>{item.text}</p>
                            </li>
                        ))}
                    </ol>
                </Container>
            </section>

            <Container>
                <section className={styles.cta}>
                    <div>
                        <span className={styles.eyebrow}>Следующий шаг</span>
                        <h2>Посмотрите производство и реквизиты компании</h2>
                    </div>
                    <div className={styles.ctaLinks}>
                        <Link href="/production">Производство</Link>
                        <Link href="/requisites">Реквизиты</Link>
                    </div>
                </section>
            </Container>
        </section>
    );
}

import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Производство — Новый Коттедж",
    description:
        "Собственное производство пиломатериала для каркасных домов и домов из СИП-панелей: сушка, строгание, контроль влажности и сортировка.",
    alternates: { canonical: "/production" },
};

const features = [
    {
        title: "Собственный пиломатериал",
        text: "Используем ель и сосну 1 и 2 сорта. Заготовка и подготовка материала проходят в производственном цеху компании.",
    },
    {
        title: "Камерная сушка",
        text: "Древесина сушится до влажности 8–12%. Такой диапазон подходит для каркасной технологии и домов из СИП-панелей.",
    },
    {
        title: "Немецкое оборудование",
        text: "Профессиональная обработка помогает получать ровную поверхность и стабильную геометрию деталей.",
    },
    {
        title: "Складское хранение",
        text: "Готовый материал хранится в сухом проветриваемом помещении, чтобы сохранить эксплуатационные свойства.",
    },
];

const steps = [
    {
        num: "01",
        title: "Отбор древесины",
        text: "Специалисты вручную проверяют партии пиломатериала и отсеивают доски, которые не соответствуют стандартам.",
    },
    {
        num: "02",
        title: "Сушка и строгание",
        text: "Материал проходит камерную сушку, обработку на оборудовании и контроль технического соответствия.",
    },
    {
        num: "03",
        title: "Защитная обработка",
        text: "Обработка выполняется с учетом требований СП 28.13330-2017 и норм пожарной и химической безопасности.",
    },
    {
        num: "04",
        title: "Маркировка и склад",
        text: "Финальная партия маркируется по стандартам и отправляется на хранение до комплектации объекта.",
    },
];

const standards = ["ГОСТ 24454-80", "ГОСТ 8486-86", "СП 28.13330-2017"];

export default function ProductionPage() {
    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "О компании", href: "/about" },
                        { label: "Производство" },
                    ]}
                />

                <section className={styles.hero}>
                    <SectionHeading
                        eyebrow="Производство"
                        title="Материал для дома начинается"
                        titleAccent="с точной подготовки"
                        lead="Для каркасных домов и домов из СИП-панелей компания использует строганную доску собственного производства. Контроль влажности, геометрии и условий хранения помогает получать надежные конструкции, перекрытия и несущие элементы."
                        align="left"
                        tone="h1"
                    />
                    <aside className={styles.heroPanel}>
                        <span className={styles.panelEyebrow}>Пиломатериал</span>
                        <strong>8–12%</strong>
                        <p>
                            рабочий диапазон влажности после камерной сушки
                            перед строганием, сортировкой и хранением.
                        </p>
                    </aside>
                </section>

                <section className={styles.featureGrid}>
                    {features.map((item) => (
                        <article
                            key={item.title}
                            className={styles.featureCard}
                        >
                            <h2>{item.title}</h2>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </section>
            </Container>

            <section className={styles.sectionAlt}>
                <Container>
                    <SectionHeading
                        eyebrow="Процесс"
                        title="Как проходит"
                        titleAccent="подготовка"
                        lead="Каждый этап производства настроен так, чтобы материал соответствовал технологии строительства и условиям эксплуатации дома."
                        align="left"
                        className={styles.sectionHead}
                    />
                    <ol className={styles.steps}>
                        {steps.map((step) => (
                            <li key={step.num} className={styles.step}>
                                <span>{step.num}</span>
                                <div>
                                    <h3>{step.title}</h3>
                                    <p>{step.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </Container>
            </section>

            <Container>
                <section className={styles.qualityBlock}>
                    <SectionHeading
                        eyebrow="Стандарты"
                        title="Контроль без случайностей"
                        titleAccent="и лишней химии"
                        lead="Производство ведется по действующим нормативам. Защитная обработка не должна вредить здоровью человека, а технический контроль идет на всех этапах."
                        align="left"
                    />
                    <div className={styles.standards}>
                        {standards.map((item) => (
                            <span key={item}>{item}</span>
                        ))}
                    </div>
                </section>
            </Container>
        </section>
    );
}

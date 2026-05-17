import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EMAIL, PHONES } from "@/content/contacts";
import styles from "./page.module.css";

const conditions = [
    "Работы выполнялись компанией «Новый Коттедж» и передавались заказчику по договору.",
    "После сдачи объекта не было несогласованного вмешательства заказчика или сторонних бригад.",
    "Соблюдались правила эксплуатации дома, инженерных систем и отделочных материалов.",
    "Обращение подано в пределах гарантийного срока, указанного в договоре.",
];

const cases = [
    {
        title: "Строительные нормы",
        text: "Разбираем ситуации, связанные с нарушением строительных норм, геометрией конструкций и качеством выполненных работ.",
    },
    {
        title: "Фундамент и коробка",
        text: "Проверяем трещины, деформации и другие признаки конструктивных дефектов по несущим элементам дома.",
    },
    {
        title: "Материалы",
        text: "Помогаем зафиксировать заводской брак строительных материалов и определить порядок устранения проблемы.",
    },
];

const exclusions = [
    "естественный износ и загрязнение материалов",
    "повреждения из-за насекомых или грызунов",
    "самовольные переделки, не согласованные с компанией",
    "нарушение правил эксплуатации объекта",
];

export const metadata: Metadata = {
    title: "Гарантия на строительство | Новый Коттедж",
    description:
        "Гарантийные обязательства компании Новый Коттедж: условия, сроки, порядок обращения и контакты гарантийного отдела.",
    alternates: { canonical: "/guarantee" },
};

export default function GuaranteePage() {
    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Гарантия" },
                    ]}
                />

                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <SectionHeading
                            eyebrow="Гарантийные обязательства"
                            title="Отвечаем за качество"
                            titleAccent="после сдачи"
                            lead="Компания «Новый Коттедж» фиксирует гарантийные условия в договоре и рассматривает обращения через клиентский сервис. Для стандартных проектов действует гарантийный период 7 лет."
                            align="left"
                            tone="h1"
                        />
                        <div className={styles.heroActions}>
                            <a className={styles.cta} href="#claim">
                                Сообщить о проблеме
                            </a>
                            <Link className={styles.secondaryLink} href="/faq">
                                Частые вопросы
                            </Link>
                        </div>
                    </div>
                    <aside className={styles.summaryCard}>
                        <span className={styles.summaryNumber}>7</span>
                        <span className={styles.summaryLabel}>лет гарантии для стандартных проектов</span>
                        <p>
                            Точный срок зависит от технологии строительства,
                            комплектации и сложности проекта.
                        </p>
                    </aside>
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow="Условия"
                        title="Когда действует гарантия"
                        lead="Конкретные условия обсуждаются перед подписанием договора. Базовые требования одинаковы для всех объектов."
                        align="left"
                        className={styles.sectionHead}
                    />
                    <ul className={styles.conditionGrid}>
                        {conditions.map((condition, index) => (
                            <li key={condition} className={styles.conditionCard}>
                                <span className={styles.cardIndex}>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <p>{condition}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className={styles.splitSection}>
                    <div>
                        <SectionHeading
                            eyebrow="Гарантийные случаи"
                            title="Что проверяем"
                            align="left"
                            className={styles.sectionHead}
                        />
                        <div className={styles.caseList}>
                            {cases.map((item) => (
                                <article key={item.title} className={styles.caseCard}>
                                    <h3>{item.title}</h3>
                                    <p>{item.text}</p>
                                </article>
                            ))}
                        </div>
                    </div>

                    <aside className={styles.noteCard}>
                        <h2>Что не входит</h2>
                        <p>
                            Есть ситуации, которые не относятся к гарантийным
                            обязательствам и рассматриваются отдельно.
                        </p>
                        <ul>
                            {exclusions.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </aside>
                </section>

                <section id="claim" className={styles.claimSection}>
                    <div className={styles.claimInfo}>
                        <SectionHeading
                            eyebrow="Гарантийный отдел"
                            title="Опишите проблему — мы свяжемся с вами"
                            lead="Подготовьте номер договора, фотографии и краткое описание ситуации. Специалист уточнит детали и согласует дальнейшие действия."
                            align="left"
                            className={styles.sectionHead}
                        />
                        <dl className={styles.contacts}>
                            <div>
                                <dt>Санкт-Петербург</dt>
                                <dd>
                                    <a href={`tel:${PHONES.spb.number}`}>
                                        {PHONES.spb.display}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt>Москва</dt>
                                <dd>
                                    <a href={`tel:${PHONES.msk.number}`}>
                                        {PHONES.msk.display}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt>Email</dt>
                                <dd>
                                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <form className={styles.form}>
                        <label>
                            <span>Номер договора</span>
                            <input name="contract" placeholder="Например, НК-2026-001" />
                        </label>
                        <label>
                            <span>Ваше имя</span>
                            <input name="name" placeholder="Как к вам обращаться" />
                        </label>
                        <label>
                            <span>Телефон</span>
                            <input name="phone" placeholder="+7" required />
                        </label>
                        <label>
                            <span>Описание проблемы</span>
                            <textarea name="message" placeholder="Что произошло и когда заметили проблему" rows={5} />
                        </label>
                        <button className={styles.cta} type="submit">
                            Отправить обращение
                        </button>
                        <p className={styles.privacy}>
                            Нажимая кнопку, вы соглашаетесь с{" "}
                            <Link href="/privacy">политикой конфиденциальности</Link>.
                        </p>
                    </form>
                </section>
            </Container>
        </section>
    );
}

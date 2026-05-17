import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.css";

const partners = [
    { name: "ЛСР", href: "https://www.lsr.ru", category: "материалы" },
    { name: "Top House", href: "https://www.tophouse.ru", category: "домокомплекты" },
    { name: "Петрович", href: "https://petrovich.ru", category: "строительные материалы" },
    { name: "Пеноплекс", href: "https://www.penoplex.ru", category: "теплоизоляция" },
    { name: "Paroc", href: "https://www.paroc.ru", category: "изоляция" },
    { name: "Rockwool", href: "https://www.rockwool.ru", category: "каменная вата" },
    { name: "Наноизол", href: "https://www.nanoizol.com", category: "мембраны" },
    { name: "Изоспан", href: "https://isospan.gexa.ru", category: "изоляционные материалы" },
    { name: "Ренессанс Бетон", category: "бетон" },
    { name: "Монолит", href: "https://www.monolittex.ru", category: "строительные решения" },
    { name: "Greenside", href: "https://www.greenside.ru", category: "фасады" },
    { name: "QuickDeck", href: "https://quickdeck.ru", category: "плиты" },
];

const principles = [
    "работаем с поставщиками, чьи материалы применялись на реальных объектах",
    "подбираем технологию под задачу заказчика, а не под универсальное решение",
    "фиксируем комплектацию и материалы в смете до начала строительства",
];

export const metadata: Metadata = {
    title: "Партнёры | Новый Коттедж",
    description:
        "Партнёры и поставщики компании Новый Коттедж: строительные материалы, изоляция, фасадные решения и домокомплекты.",
    alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Партнёры" },
                    ]}
                />

                <section className={styles.hero}>
                    <div>
                        <SectionHeading
                            eyebrow="Поставщики"
                            title="Партнёры, которым"
                            titleAccent="доверяем"
                            lead="Компании, с которыми «Новый Коттедж» сотрудничает по материалам, домокомплектам, утеплению и строительным решениям."
                            align="left"
                            tone="h1"
                        />
                        <Link className={styles.cta} href="/certificates">
                            Сертификаты
                        </Link>
                    </div>
                    <aside className={styles.heroPanel}>
                        <span>Комплектация</span>
                        <strong>12</strong>
                        <p>
                            направлений поставок: бетон, утепление, фасады,
                            плиты, мембраны и домокомплекты.
                        </p>
                    </aside>
                </section>

                <section className={styles.principles}>
                    {principles.map((principle, index) => (
                        <article key={principle} className={styles.principleCard}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <p>{principle}</p>
                        </article>
                    ))}
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow="Список партнёров"
                        title="Материалы и решения для строительства"
                        lead="Карточки ведут на сайты партнёров, если у компании есть открытая страница."
                        align="left"
                        className={styles.sectionHead}
                    />
                    <div className={styles.partnerGrid}>
                        {partners.map((partner) => {
                            const content = (
                                <article className={styles.partnerCard}>
                                    <div className={styles.logoMark}>
                                        {partner.name.slice(0, 2)}
                                    </div>
                                    <div>
                                        <span>{partner.category}</span>
                                        <h2>{partner.name}</h2>
                                    </div>
                                    <p>{partner.href ? "Перейти на сайт партнёра" : "Поставка согласуется в смете"}</p>
                                </article>
                            );

                            if (!partner.href) {
                                return <div key={partner.name}>{content}</div>;
                            }

                            return (
                                <a
                                    key={partner.name}
                                    href={partner.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {content}
                                </a>
                            );
                        })}
                    </div>
                </section>

                <section className={styles.ctaBlock}>
                    <div>
                        <h2>Подбираем материалы под проект</h2>
                        <p>
                            На этапе сметы объясняем, какие материалы входят в
                            комплектацию и почему они подходят выбранной технологии.
                        </p>
                    </div>
                    <Link className={styles.cta} href="/projects">
                        Выбрать проект
                    </Link>
                </section>
            </Container>
        </section>
    );
}

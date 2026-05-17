import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROJECT_HUB_CATEGORIES } from "@/domain/technology";
import { SERVICES } from "@/app/services/services";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Карта сайта — Новый Коттедж",
    description:
        "Карта сайта Новый Коттедж: проекты домов, услуги, страницы для клиентов, контакты и правовая информация.",
    alternates: { canonical: "/sitemap" },
};

const clientLinks = [
    { label: "О компании", href: "/about" },
    { label: "Наши работы", href: "/works" },
    { label: "Отзывы", href: "/reviews" },
    { label: "Гарантия", href: "/guarantee" },
    { label: "Сертификаты", href: "/certificates" },
    { label: "Партнёры", href: "/partners" },
    { label: "Производство", href: "/production" },
    { label: "Оплата и доставка", href: "/payment" },
    { label: "Ипотека", href: "/mortgage" },
    { label: "В кредит", href: "/credit" },
    { label: "Материнский капитал", href: "/maternity-capital" },
    { label: "Вакансии", href: "/vacancies" },
    { label: "Реквизиты", href: "/requisites" },
    { label: "Контакты", href: "/contacts" },
];

const legalLinks = [
    { label: "Политика конфиденциальности", href: "/privacy" },
    { label: "Обработка персональных данных", href: "/personal-data" },
    { label: "Публичная оферта", href: "/offer" },
    { label: "Карта сайта", href: "/sitemap" },
];

const userLinks = [
    { label: "Избранное", href: "/favourites" },
    { label: "Сравнение", href: "/compare" },
];

const featuredLinks = [
    {
        label: "Каталог проектов",
        href: "/projects",
        text: "Подбор дома по технологии, площади и планировке.",
    },
    {
        label: "Услуги",
        href: "/services",
        text: "Проектирование, строительство, инженерия и отделка.",
    },
    {
        label: "Наши работы",
        href: "/works",
        text: "Построенные дома и объекты для знакомства с подходом.",
    },
];

function LinkList({ items }: { items: { label: string; href: string }[] }) {
    return (
        <ul className={styles.linkList}>
            {items.map((item) => (
                <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                </li>
            ))}
        </ul>
    );
}

export default function SitemapPage() {
    const projectLinks = [
        { label: "Все проекты", href: "/projects" },
        ...PROJECT_HUB_CATEGORIES.map((category) => ({
            label: category.title,
            href: `/projects/${category.slug}`,
        })),
    ];

    const serviceLinks = [
        { label: "Все услуги", href: "/services" },
        ...SERVICES.map((service) => ({
            label: service.shortTitle,
            href: `/services/${service.slug}`,
        })),
    ];

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Карта сайта" },
                    ]}
                />

                <section className={styles.hero}>
                    <SectionHeading
                        eyebrow="Навигация"
                        title="Карта"
                        titleAccent="сайта"
                        lead="Основные разделы собраны в одном месте: каталог проектов, услуги, клиентские страницы и правовая информация."
                        tone="h1"
                        align="left"
                    />
                    <div className={styles.heroPanel}>
                        <span>Быстрый старт</span>
                        <p>
                            Если вы выбираете дом, начните с каталога или
                            подборок, а затем сохраните варианты в избранное.
                        </p>
                    </div>
                </section>

                <section className={styles.featuredGrid} aria-label="Основные разделы">
                    {featuredLinks.map((item) => (
                        <Link key={item.href} href={item.href} className={styles.featuredCard}>
                            <span>{item.label}</span>
                            <p>{item.text}</p>
                        </Link>
                    ))}
                </section>

                <div className={styles.grid}>
                    <section className={styles.card}>
                        <span>Каталог</span>
                        <h2>Проекты домов</h2>
                        <LinkList items={projectLinks} />
                    </section>

                    <section className={styles.card}>
                        <span>Работы</span>
                        <h2>Услуги</h2>
                        <LinkList items={serviceLinks} />
                    </section>

                    <section className={styles.card}>
                        <span>Клиентам</span>
                        <h2>Компания, условия и полезное</h2>
                        <LinkList items={clientLinks} />
                    </section>

                    <section className={styles.card}>
                        <span>Сервис</span>
                        <h2>Подборки и материалы</h2>
                        <LinkList
                            items={[
                                ...userLinks,
                                { label: "Подборки проектов", href: "/project-selections" },
                                { label: "Акции", href: "/promos" },
                                { label: "Статьи", href: "/blog" },
                                { label: "Вопросы и ответы", href: "/faq" },
                            ]}
                        />
                    </section>

                    <section className={styles.cardWide}>
                        <span>Документы</span>
                        <h2>Правовая информация</h2>
                        <LinkList items={legalLinks} />
                    </section>
                </div>
            </Container>
        </section>
    );
}

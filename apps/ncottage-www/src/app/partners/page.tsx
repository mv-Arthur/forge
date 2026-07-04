import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { getPartners } from "@/data/partners";
import { getListingPages, getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeo();
    return buildPageMetadata({
        seo,
        title: seo.indexes["partners"].title,
        description: seo.indexes["partners"].description,
        path: "/partners",
    });
}

export default async function PartnersPage() {
    const [partners, listingPages] = await Promise.all([
        getPartners(),
        getListingPages(),
    ]);
    const { principles } = listingPages.partners;

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
                        <strong>{partners.length}</strong>
                        <p>
                            направлений поставок: бетон, утепление, фасады,
                            плиты, мембраны и домокомплекты.
                        </p>
                    </aside>
                </section>

                <section className={styles.principles}>
                    {principles.map((principle, index) => (
                        <article
                            key={principle}
                            className={styles.principleCard}
                        >
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
                    {partners.length === 0 && (
                        <EmptyState
                            title="Список партнёров пуст"
                            description="Мы обновляем список поставщиков и партнёров — он скоро появится здесь."
                        />
                    )}
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
                                    <p>
                                        {partner.href
                                            ? "Перейти на сайт партнёра"
                                            : "Поставка согласуется в смете"}
                                    </p>
                                </article>
                            );

                            if (!partner.href) {
                                return <div key={partner.slug}>{content}</div>;
                            }

                            return (
                                <a
                                    key={partner.slug}
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
                            комплектацию и почему они подходят выбранной
                            технологии.
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

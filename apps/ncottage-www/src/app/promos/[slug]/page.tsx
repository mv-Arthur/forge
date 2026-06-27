import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPromoBySlug, getPromos } from "@/data/promos";
import { getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import styles from "../page.module.css";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const promos = await getPromos();
    return promos.map((promo) => ({ slug: promo.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const [promo, seo] = await Promise.all([getPromoBySlug(slug), getSeo()]);

    if (!promo) return { title: "Акция не найдена" };

    return buildPageMetadata({
        seo,
        title:
            promo.seoTitle ??
            `${promo.shortTitle} по специальным условиям | Новый Коттедж`,
        description:
            promo.seoDescription ??
            `${promo.lead} ${promo.price}. Условия и заявка на полный расчёт строительства дома.`,
        path: `/promos/${promo.slug}`,
    });
}

export default async function PromoDetailPage({ params }: Props) {
    const { slug } = await params;
    const promo = await getPromoBySlug(slug);

    if (!promo) notFound();

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Акции", href: "/promos" },
                        { label: promo.shortTitle },
                    ]}
                />

                <section className={styles.detailHero}>
                    <div>
                        <SectionHeading
                            eyebrow={promo.eyebrow}
                            title={promo.title}
                            lead={promo.lead}
                            align="left"
                            tone="h1"
                            className={styles.heroHeading}
                        />
                        <div className={styles.heroActions}>
                            <a className={styles.primaryLink} href="#request">
                                Получить полный расчёт
                            </a>
                            <Link
                                className={styles.secondaryLink}
                                href={promo.projectsHref}
                            >
                                Подобрать проект
                            </Link>
                        </div>
                    </div>

                    <aside className={styles.priceAside}>
                        <span className={styles.panelLabel}>
                            Ориентир стоимости
                        </span>
                        <strong>{promo.price}</strong>
                        <p>{promo.priceNote}</p>
                        <small>{promo.period}</small>
                        <small>
                            Не является публичной офертой: итоговая стоимость
                            зависит от проекта, участка и выбранных опций.
                        </small>
                    </aside>
                </section>

                <section className={styles.detailGrid}>
                    <article className={styles.detailCard}>
                        <span className={styles.cardEyebrow}>Комплектация</span>
                        <h2>Что входит в предложение</h2>
                        <ul className={styles.checkList}>
                            {promo.includes.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </article>

                    <article className={styles.detailCard}>
                        <span className={styles.cardEyebrow}>Условия</span>
                        <h2>Как применяется спеццена</h2>
                        <ul className={styles.checkList}>
                            {promo.terms.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </article>
                </section>

                <section className={styles.copySection}>
                    <SectionHeading
                        eyebrow="Описание"
                        title="Подберём решение под проект и бюджет"
                        align="left"
                        className={styles.sectionHead}
                    />
                    <div className={styles.copyGrid}>
                        {promo.details.map((text) => (
                            <p key={text}>{text}</p>
                        ))}
                    </div>
                </section>

                <section id="request" className={styles.requestSection}>
                    <div className={styles.requestIntro}>
                        <span className={styles.cardEyebrow}>Заявка</span>
                        <h2>
                            Запросить расчёт: {promo.shortTitle.toLowerCase()}
                        </h2>
                        <p>
                            Уточним актуальность спецусловий, предложим
                            подходящий проект, базовую комплектацию и смету под
                            ваш участок.
                        </p>
                    </div>
                    <form
                        className={styles.form}
                        action={`/promos/${promo.slug}`}
                    >
                        <input
                            name="name"
                            type="text"
                            placeholder="Ваше имя"
                            autoComplete="name"
                        />
                        <input
                            name="phone"
                            type="tel"
                            placeholder="Телефон *"
                            autoComplete="tel"
                            required
                        />
                        <input
                            name="promo"
                            type="hidden"
                            value={promo.shortTitle}
                        />
                        <textarea
                            name="message"
                            rows={4}
                            placeholder="Площадь дома, участок, сроки строительства"
                        />
                        <button type="submit">Получить полный расчёт</button>
                        <p>
                            Нажимая кнопку, вы соглашаетесь с обработкой
                            персональных данных.
                        </p>
                    </form>
                </section>
            </Container>
        </section>
    );
}

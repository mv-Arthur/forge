import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPromos } from "@/data/promos";
import { getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import { PromoLeadForm } from "./PromoLeadForm";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeo();
    return buildPageMetadata({
        seo,
        title: seo.indexes["promos"].title,
        description: seo.indexes["promos"].description,
        path: "/promos",
    });
}

export default async function PromosPage() {
    const promos = await getPromos();

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Акции" },
                    ]}
                />

                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <SectionHeading
                            eyebrow="Специальные предложения"
                            title="Строительство дома"
                            titleAccent="по специальной цене"
                            lead="Популярные технологии строительства с прозрачной базовой комплектацией и индивидуальным расчётом под ваш участок."
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
                                href="/projects/all"
                            >
                                Смотреть проекты
                            </Link>
                        </div>
                    </div>

                    <aside
                        className={styles.heroPanel}
                        aria-label="Условия предложения"
                    >
                        <span className={styles.panelLabel}>
                            Индивидуальный расчёт
                        </span>
                        <strong>
                            Смета фиксируется после выбора проекта и
                            комплектации
                        </strong>
                        <p>
                            Покажем базовую стоимость, уточним особенности
                            участка и подготовим спокойный коммерческий маршрут
                            без навязчивых обещаний.
                        </p>
                    </aside>
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow="Предложения"
                        title="Выберите технологию"
                        lead="Каждая карточка ведёт на детальную страницу с комплектацией, условиями и формой заявки."
                        align="left"
                        className={styles.sectionHead}
                    />

                    <div className={styles.cardsGrid}>
                        {promos.map((promo) => (
                            <article
                                key={promo.slug}
                                className={styles.promoCard}
                            >
                                <div className={styles.cardHead}>
                                    <span className={styles.cardEyebrow}>
                                        {promo.eyebrow}
                                    </span>
                                    <h2>{promo.shortTitle}</h2>
                                    <p>{promo.lead}</p>
                                </div>

                                <div className={styles.priceBlock}>
                                    <span className={styles.priceKicker}>
                                        Предварительный ориентир
                                    </span>
                                    <strong>{promo.price}</strong>
                                    <span>{promo.priceNote}</span>
                                    <p>
                                        Финальная смета — после выбора проекта,
                                        комплектации и проверки участка.
                                    </p>
                                </div>

                                <ul className={styles.checkList}>
                                    {promo.includes.slice(0, 4).map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>

                                <div className={styles.cardFooter}>
                                    <Link
                                        className={styles.cardLink}
                                        href={`/promos/${promo.slug}`}
                                    >
                                        Подробнее
                                    </Link>
                                    <Link
                                        className={styles.ghostLink}
                                        href={promo.projectsHref}
                                    >
                                        Проекты
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={styles.storySection}>
                    <div className={styles.storyText}>
                        <span className={styles.cardEyebrow}>
                            Почему это предложение
                        </span>
                        <h2>
                            Сохраняем качество и подбираем решение под бюджет
                        </h2>
                        <p>
                            Главный приоритет — строительство качественных и
                            надёжных домов для постоянного проживания. За счёт
                            опыта, запаса материалов и проверенных технических
                            решений можно подобрать рациональную комплектацию
                            без отказа от надёжности.
                        </p>
                    </div>
                    <div className={styles.storyCard}>
                        <strong>Что будет после заявки</strong>
                        <ol>
                            <li>
                                Уточним участок, площадь и желаемую технологию.
                            </li>
                            <li>
                                Подберём проект и базовую комплектацию под
                                бюджет.
                            </li>
                            <li>
                                Подготовим смету, сроки и понятный порядок
                                оплаты.
                            </li>
                        </ol>
                    </div>
                </section>

                <section id="request" className={styles.requestSection}>
                    <div className={styles.requestIntro}>
                        <span className={styles.cardEyebrow}>Заявка</span>
                        <h2>Получите полный расчёт по акции</h2>
                        <p>
                            Оставьте контакты и коротко опишите будущий дом.
                            Менеджер уточнит параметры проекта и подготовит
                            следующий шаг.
                        </p>
                    </div>
                    <PromoLeadForm
                        buttonLabel="Получить расчёт"
                        messagePlaceholder="Площадь, участок, пожелания по комплектации"
                        options={promos.map((promo) => promo.shortTitle)}
                    />
                </section>
            </Container>
        </section>
    );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { articleCategories, articles } from "./articles";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Блог о строительстве загородных домов | Новый Коттедж",
    description:
        "Экспертные статьи Нового Коттеджа о выборе технологии, проектировании, фундаменте, этапах строительства, инженерных сетях и ипотеке на дом.",
    alternates: { canonical: "/blog" },
};

export default function BlogPage() {
    const featuredArticle = articles[0];
    const regularArticles = articles.slice(1);

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[{ label: "Главная", href: "/" }, { label: "Блог" }]}
                />

                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <p className={styles.eyebrow}>Блог</p>
                        <h1 className={styles.title}>
                            Практичные статьи о строительстве дома
                        </h1>
                        <p className={styles.lead}>
                            Разбираем решения, которые влияют на комфорт, бюджет
                            и срок строительства: от выбора технологии до
                            инженерных систем и подготовки к ипотеке.
                        </p>
                    </div>
                    <div className={styles.heroPanel}>
                        <span>Темы редакции</span>
                        <div className={styles.heroMark} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </div>
                        <div className={styles.categoryList}>
                            {articleCategories.map((category) => (
                                <a key={category} href={`#${category}`}>
                                    {category}
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={styles.featured}>
                    <SectionHeading
                        eyebrow="Гид покупателя"
                        title="С чего начать"
                        titleAccent="выбор дома"
                        lead="Самые важные решения принимаются до стройки: технология, участок, проект, фундамент и инженерные сценарии."
                        align="left"
                        className={styles.sectionHead}
                    />
                    <Link
                        href={`/blog/${featuredArticle.slug}`}
                        className={styles.featuredCard}
                    >
                        <div>
                            <span className={styles.cardCategory}>
                                {featuredArticle.category}
                            </span>
                            <h2>{featuredArticle.title}</h2>
                            <p>{featuredArticle.description}</p>
                        </div>
                        <div className={styles.featuredMeta}>
                            <span>{featuredArticle.readTime}</span>
                            <span>Читать статью</span>
                        </div>
                    </Link>
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow="Материалы"
                        title="Все статьи"
                        lead="Короткие практичные материалы для тех, кто выбирает проект, готовит участок или сравнивает технологии строительства."
                        align="left"
                        className={styles.sectionHead}
                    />
                    <div className={styles.grid}>
                        {regularArticles.map((article) => (
                            <Link
                                key={article.slug}
                                id={article.category}
                                href={`/blog/${article.slug}`}
                                className={styles.card}
                            >
                                <span className={styles.cardCategory}>
                                    {article.category}
                                </span>
                                <h2>{article.title}</h2>
                                <p>{article.description}</p>
                                <span className={styles.cardFooter}>
                                    <span>{article.readTime}</span>
                                    <span>Подробнее</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className={styles.cta}>
                    <div>
                        <p className={styles.eyebrow}>Нужен совет</p>
                        <h2>Поможем выбрать проект и технологию</h2>
                        <p>
                            Расскажите о семье, участке и бюджете — подберем
                            подходящие проекты и объясним, какие решения важны
                            именно для вашего дома.
                        </p>
                    </div>
                    <Link href="/contacts" className={styles.ctaButton}>
                        Получить консультацию
                    </Link>
                </section>
            </Container>
        </section>
    );
}

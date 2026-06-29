import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getArticleCategories, getArticles, getBlogPage } from "@/data/blog";
import { getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeo();
    return buildPageMetadata({
        seo,
        title: seo.indexes["blog"].title,
        description: seo.indexes["blog"].description,
        path: "/blog",
    });
}

export default async function BlogPage() {
    const [articles, blogPage] = await Promise.all([
        getArticles(),
        getBlogPage(),
    ]);
    const categories = getArticleCategories(articles);
    const featuredArticle = articles[0];
    const regularArticles = articles.slice(1);

    // Валидный (без кириллицы/пробелов) и уникальный якорь на категорию. Цель —
    // первая статья категории (включая featured), чтобы ссылка не была мёртвой
    // и не дублировала id.
    const categoryAnchor = (category: string) =>
        `category-${categories.indexOf(category)}`;
    const anchorSlugByCategory = new Map<string, string>();
    for (const article of articles) {
        if (!anchorSlugByCategory.has(article.category)) {
            anchorSlugByCategory.set(article.category, article.slug);
        }
    }
    const anchorIdFor = (article: { slug: string; category: string }) =>
        anchorSlugByCategory.get(article.category) === article.slug
            ? categoryAnchor(article.category)
            : undefined;

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[{ label: "Главная", href: "/" }, { label: "Блог" }]}
                />

                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <p className={styles.eyebrow}>
                            {blogPage.hero.eyebrow}
                        </p>
                        <h1 className={styles.title}>{blogPage.hero.title}</h1>
                        <p className={styles.lead}>{blogPage.hero.lead}</p>
                    </div>
                    <div className={styles.heroPanel}>
                        <span>{blogPage.hero.panelLabel}</span>
                        <div className={styles.heroMark} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </div>
                        <div className={styles.categoryList}>
                            {categories.map((category) => (
                                <a
                                    key={category}
                                    href={`#${categoryAnchor(category)}`}
                                >
                                    {category}
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {featuredArticle && (
                    <section className={styles.featured}>
                        <SectionHeading
                            eyebrow={blogPage.featured.eyebrow}
                            title={blogPage.featured.title}
                            titleAccent={blogPage.featured.titleAccent}
                            lead={blogPage.featured.lead}
                            align="left"
                            className={styles.sectionHead}
                        />
                        <Link
                            id={anchorIdFor(featuredArticle)}
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
                )}

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow={blogPage.list.eyebrow}
                        title={blogPage.list.title}
                        lead={blogPage.list.lead}
                        align="left"
                        className={styles.sectionHead}
                    />
                    <div className={styles.grid}>
                        {regularArticles.map((article) => (
                            <Link
                                key={article.slug}
                                id={anchorIdFor(article)}
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
                        <p className={styles.eyebrow}>{blogPage.cta.eyebrow}</p>
                        <h2>{blogPage.cta.title}</h2>
                        <p>{blogPage.cta.text}</p>
                    </div>
                    <Link
                        href={blogPage.cta.buttonHref}
                        className={styles.ctaButton}
                    >
                        {blogPage.cta.buttonLabel}
                    </Link>
                </section>
            </Container>
        </section>
    );
}

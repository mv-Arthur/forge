import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getArticleBySlug, getArticles, getRelatedArticles } from "@/data/blog";
import styles from "./page.module.css";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const articles = await getArticles();
    return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return { title: "Статья не найдена" };
    }

    return {
        title: `${article.title} | Блог Нового Коттеджа`,
        description: article.description,
        alternates: { canonical: `/blog/${article.slug}` },
    };
}

export default async function BlogArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) notFound();

    const relatedArticles = await getRelatedArticles(article);

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Блог", href: "/blog" },
                        { label: article.title },
                    ]}
                />

                <article className={styles.article}>
                    <header className={styles.hero}>
                        <div className={styles.heroText}>
                            <p className={styles.eyebrow}>{article.category}</p>
                            <h1 className={styles.title}>{article.title}</h1>
                            <p className={styles.lead}>{article.description}</p>
                            <div className={styles.meta}>
                                <time dateTime={article.date}>
                                    {new Intl.DateTimeFormat("ru-RU", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    }).format(new Date(article.date))}
                                </time>
                                <span>{article.readTime}</span>
                            </div>
                        </div>
                        <aside className={styles.heroCard}>
                            <div
                                className={styles.heroSketch}
                                aria-hidden="true"
                            >
                                <span />
                                <span />
                                <span />
                            </div>
                            <span>Главная мысль</span>
                            <p>{article.heroNote}</p>
                        </aside>
                    </header>

                    <div className={styles.layout}>
                        <aside className={styles.aside}>
                            <span>В статье</span>
                            <nav>
                                {article.sections.map((section) => (
                                    <a
                                        key={section.title}
                                        href={`#${section.title}`}
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>
                        </aside>

                        <div className={styles.content}>
                            <section className={styles.summary}>
                                <h2>Коротко</h2>
                                <ul>
                                    {article.highlights.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </section>

                            {article.sections.map((section) => (
                                <section
                                    key={section.title}
                                    id={section.title}
                                    className={styles.textSection}
                                >
                                    <h2>{section.title}</h2>
                                    {section.body.map((paragraph) => (
                                        <p key={paragraph}>{paragraph}</p>
                                    ))}
                                    {section.list && (
                                        <ul>
                                            {section.list.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </section>
                            ))}

                            <section className={styles.checklist}>
                                <h2>Что сделать перед следующим шагом</h2>
                                <ol>
                                    {article.checklist.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ol>
                            </section>
                        </div>
                    </div>
                </article>
            </Container>

            {relatedArticles.length > 0 && (
                <section className={styles.related}>
                    <Container>
                        <SectionHeading
                            eyebrow="Читайте также"
                            title="Похожие материалы"
                            lead="Дополнительные статьи помогут связать проект, участок, технологию и бюджет в единую картину."
                            align="left"
                            className={styles.relatedHead}
                        />
                        <div className={styles.relatedGrid}>
                            {relatedArticles.map((item) => (
                                <Link
                                    key={item.slug}
                                    href={`/blog/${item.slug}`}
                                    className={styles.relatedCard}
                                >
                                    <span>{item.category}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </Link>
                            ))}
                        </div>
                    </Container>
                </section>
            )}
        </section>
    );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState/EmptyState";
import { getFaqItems, groupFaqItems } from "@/data/faq";
import { getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeo();
    return buildPageMetadata({
        seo,
        title: seo.indexes["faq"].title,
        description: seo.indexes["faq"].description,
        path: "/faq",
    });
}

export default async function FaqPage() {
    const groups = groupFaqItems(await getFaqItems());

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Вопрос-ответ" },
                    ]}
                />

                <section className={styles.hero}>
                    <div>
                        <SectionHeading
                            eyebrow="Вопрос-ответ"
                            title="Коротко о важном"
                            titleAccent="до договора"
                            lead="Ответы на вопросы, которые чаще всего возникают перед выбором проекта, технологии строительства, комплектации и формата контроля работ."
                            align="left"
                            tone="h1"
                        />
                        <Link className={styles.cta} href="/contacts">
                            Задать свой вопрос
                        </Link>
                    </div>
                    <aside className={styles.heroPanel}>
                        <span>Темы</span>
                        <strong>{groups.length}</strong>
                        <p>
                            раздела: строительство, проектирование, контроль
                            качества и гарантийные обязательства.
                        </p>
                    </aside>
                </section>

                <div className={styles.layout}>
                    <aside className={styles.navCard}>
                        <span>Разделы</span>
                        <nav>
                            {groups.map((group) => (
                                <a key={group.title} href={`#${group.title}`}>
                                    {group.title}
                                </a>
                            ))}
                        </nav>
                    </aside>

                    {groups.length === 0 && (
                        <EmptyState
                            title="Вопросов пока нет"
                            description="Мы наполняем раздел ответами — задайте свой вопрос, и мы ответим лично."
                        />
                    )}
                    <div className={styles.groups}>
                        {groups.map((group) => (
                            <section
                                key={group.title}
                                id={group.title}
                                className={styles.group}
                            >
                                <h2>{group.title}</h2>
                                <div className={styles.list}>
                                    {group.items.map((item, index) => (
                                        <details
                                            key={item.question}
                                            className={styles.item}
                                            open={index === 0}
                                        >
                                            <summary>{item.question}</summary>
                                            <p>{item.answer}</p>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}

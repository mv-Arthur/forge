import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPage, section } from "@/data/pages";
import { getContacts, getSeo, toContactRecords } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const [page, seo] = await Promise.all([getPage("privacy"), getSeo()]);
    return buildPageMetadata({
        seo,
        title: page?.seoTitle ?? "",
        description: page?.seoDescription ?? "",
        path: "/privacy",
    });
}

export default async function PrivacyPage() {
    const { phones, email, legal } = toContactRecords(await getContacts());
    const page = await getPage("privacy");
    if (!page) notFound();

    const hero = section(page, "legalHero");
    const highlights = section(page, "cardGrid");
    const document = section(page, "bulletSections");
    const sidebar = section(page, "ctaLinks");
    if (!hero || !highlights || !document || !sidebar) notFound();

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Политика конфиденциальности" },
                    ]}
                />

                <section className={styles.hero}>
                    <div>
                        <SectionHeading
                            eyebrow={hero.eyebrow}
                            title={hero.title}
                            titleAccent={hero.titleAccent}
                            lead={hero.lead}
                            tone="h1"
                            align="left"
                        />
                    </div>
                    <aside className={styles.summaryCard}>
                        <span>{hero.noteLabel}</span>
                        <strong>{hero.operatorName}</strong>
                        <p>
                            ОГРН {legal.ogrn} · ИНН {legal.inn}
                        </p>
                    </aside>
                </section>

                <section
                    className={styles.highlights}
                    aria-label="Кратко о политике"
                >
                    {highlights.items.map((item) => (
                        <article
                            key={item.title}
                            className={styles.highlightCard}
                        >
                            <span>{item.title}</span>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </section>

                <div className={styles.layout}>
                    <article className={styles.document}>
                        {document.updated && (
                            <p className={styles.updated}>{document.updated}</p>
                        )}
                        {document.items.map((item, index) => (
                            <section key={item.title} className={styles.block}>
                                <div className={styles.blockHead}>
                                    <span>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <h2>{item.title}</h2>
                                </div>
                                <ul>
                                    {(item.list ?? []).map((point) => (
                                        <li key={point}>{point}</li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </article>

                    <aside className={styles.sidebar}>
                        <h2>{sidebar.title}</h2>
                        {sidebar.description && <p>{sidebar.description}</p>}
                        <a href={`mailto:${email}`}>{email}</a>
                        <a href={`tel:${phones.spb.number}`}>
                            {phones.spb.display}
                        </a>
                        {sidebar.links.map((link) => (
                            <Link key={link.href} href={link.href}>
                                {link.label}
                            </Link>
                        ))}
                    </aside>
                </div>
            </Container>
        </section>
    );
}

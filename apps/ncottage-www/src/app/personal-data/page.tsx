import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EMAIL, LEGAL, PHONES } from "@/content/contacts";
import { getPage, section, sectionsOf } from "@/data/pages";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPage("personal-data");
    return {
        title: page?.seoTitle,
        description: page?.seoDescription,
        alternates: { canonical: "/personal-data" },
    };
}

export default async function PersonalDataPage() {
    const page = await getPage("personal-data");
    if (!page) notFound();

    const hero = section(page, "legalHero");
    const lists = sectionsOf(page, "stringList");
    const steps = lists[0];
    const purposes = lists[1];
    const consent = section(page, "bulletSections");
    const contact = section(page, "ctaLinks");
    if (!hero || !steps || !purposes || !consent || !contact) notFound();

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Обработка персональных данных" },
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
                            ОГРН {LEGAL.ogrn} · ИНН {LEGAL.inn} · КПП{" "}
                            {LEGAL.kpp}
                        </p>
                    </aside>
                </section>

                <section
                    className={styles.steps}
                    aria-label="Как применяется согласие"
                >
                    {steps.items.map((step, index) => (
                        <article key={step} className={styles.stepCard}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <p>{step}</p>
                        </article>
                    ))}
                </section>

                <div className={styles.grid}>
                    <article className={styles.mainCard}>
                        {consent.updated && (
                            <p className={styles.updated}>{consent.updated}</p>
                        )}
                        {consent.items.map((item, index) => (
                            <section
                                key={item.title}
                                className={styles.textBlock}
                            >
                                <div className={styles.textBlockHead}>
                                    <span>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <h2>{item.title}</h2>
                                </div>
                                <p>{item.text}</p>
                            </section>
                        ))}
                    </article>

                    <aside className={styles.sideCard}>
                        <h2>{purposes.title}</h2>
                        <ul>
                            {purposes.items.map((purpose) => (
                                <li key={purpose}>{purpose}</li>
                            ))}
                        </ul>
                    </aside>

                    <section className={styles.contactCard}>
                        <div>
                            <span>{contact.eyebrow}</span>
                            <h2>{contact.title}</h2>
                            {contact.description && <p>{contact.description}</p>}
                        </div>
                        <div className={styles.links}>
                            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                            <a href={`tel:${PHONES.spb.number}`}>
                                {PHONES.spb.display}
                            </a>
                            {contact.links.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            </Container>
        </section>
    );
}

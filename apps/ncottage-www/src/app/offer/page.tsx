import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EMAIL, LEGAL, PHONES } from "@/content/contacts";
import { getPage, section } from "@/data/pages";
import { getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const [page, seo] = await Promise.all([getPage("offer"), getSeo()]);
    return buildPageMetadata({
        seo,
        title: page?.seoTitle ?? "",
        description: page?.seoDescription ?? "",
        path: "/offer",
    });
}

export default async function OfferPage() {
    const page = await getPage("offer");
    if (!page) notFound();

    const hero = section(page, "legalHero");
    const notes = section(page, "cardGrid");
    const contact = section(page, "ctaLinks");
    if (!hero || !notes || !contact) notFound();

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Публичная оферта" },
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
                    <aside className={styles.accentCard}>
                        <span>{hero.noteLabel}</span>
                        <p>{hero.noteText}</p>
                    </aside>
                </section>

                <div className={styles.grid}>
                    {notes.items.map((note, index) => (
                        <article key={note.title} className={styles.card}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <h2>{note.title}</h2>
                            <p>{note.text}</p>
                        </article>
                    ))}
                </div>

                <section className={styles.contactCard}>
                    <div>
                        <span>{contact.eyebrow}</span>
                        <h2>{contact.title}</h2>
                        {contact.description && <p>{contact.description}</p>}
                    </div>
                    <div className={styles.actions}>
                        {contact.links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={styles.primaryButton}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <a
                            href={`tel:${PHONES.spb.number}`}
                            className={styles.secondaryLink}
                        >
                            {PHONES.spb.display}
                        </a>
                        <a
                            href={`mailto:${EMAIL}`}
                            className={styles.secondaryLink}
                        >
                            {EMAIL}
                        </a>
                    </div>
                </section>

                <p className={styles.company}>
                    Оператор сайта: ООО «Новый коттедж», ОГРН {LEGAL.ogrn}, ИНН{" "}
                    {LEGAL.inn}.
                </p>
            </Container>
        </section>
    );
}

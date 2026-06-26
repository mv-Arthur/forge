import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LEGAL } from "@/content/contacts";
import { getPage, section, sectionsOf } from "@/data/pages";
import type { LabelValue } from "@/domain/page";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPage("requisites");
    return {
        title: page?.seoTitle,
        description: page?.seoDescription,
        alternates: { canonical: "/requisites" },
    };
}

function RequisitesTable({ rows }: { rows: LabelValue[] }) {
    return (
        <dl className={styles.table}>
            {rows.map((row, index) => (
                <div key={`${row.label}-${index}`} className={styles.row}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                </div>
            ))}
        </dl>
    );
}

export default async function RequisitesPage() {
    const page = await getPage("requisites");
    if (!page) notFound();

    const hero = section(page, "legalHero");
    const tables = sectionsOf(page, "requisitesTable");
    if (!hero || tables.length < 3) notFound();
    const [company, bank, moscow] = tables;

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "О компании", href: "/about" },
                        { label: "Реквизиты" },
                    ]}
                />

                <section className={styles.hero}>
                    <SectionHeading
                        eyebrow={hero.eyebrow}
                        title={hero.title}
                        titleAccent={hero.titleAccent}
                        lead={hero.lead}
                        tone="h1"
                        align="left"
                    />
                    <aside className={styles.summaryCard}>
                        <span>{hero.summarySubtitle}</span>
                        <strong>{hero.summaryTitle}</strong>
                        <dl>
                            <div>
                                <dt>ИНН</dt>
                                <dd>{LEGAL.inn}</dd>
                            </div>
                            <div>
                                <dt>ОГРН</dt>
                                <dd>{LEGAL.ogrn}</dd>
                            </div>
                        </dl>
                    </aside>
                </section>

                <div className={styles.grid}>
                    <section className={styles.block}>
                        <h2>{company.title}</h2>
                        <RequisitesTable rows={company.rows} />
                    </section>

                    <section className={styles.block}>
                        <h2>{bank.title}</h2>
                        <RequisitesTable rows={bank.rows} />
                    </section>

                    <section className={styles.blockWide}>
                        <h2>{moscow.title}</h2>
                        <RequisitesTable rows={moscow.rows} />
                    </section>
                </div>
            </Container>
        </section>
    );
}

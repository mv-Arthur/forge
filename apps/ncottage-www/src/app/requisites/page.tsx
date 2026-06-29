import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPage, section, sectionsOf } from "@/data/pages";
import { getContacts, getSeo, toContactRecords } from "@/data/settings";
import type { LabelValue } from "@/domain/page";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const [page, seo] = await Promise.all([getPage("requisites"), getSeo()]);
    return buildPageMetadata({
        seo,
        title: page?.seoTitle ?? "",
        description: page?.seoDescription ?? "",
        path: "/requisites",
    });
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

// Делит плоский список реквизитов на блоки по банкам: новый банк начинается со
// строки расчётного счёта. Имя из строки «Банк» выносим в подзаголовок, чтобы
// подписи не повторялись вперемешку.
function groupByBank(rows: LabelValue[]): { bank?: string; rows: LabelValue[] }[] {
    const groups: LabelValue[][] = [];
    for (const row of rows) {
        if (/^расч[её]тный\s+сч[её]т/i.test(row.label) || groups.length === 0) {
            groups.push([]);
        }
        groups[groups.length - 1].push(row);
    }
    return groups.map((g) => ({
        bank: g.find((r) => /^банк$/i.test(r.label))?.value,
        rows: g.filter((r) => !/^банк$/i.test(r.label)),
    }));
}

function BankRequisites({ title, rows }: { title: string; rows: LabelValue[] }) {
    const groups = groupByBank(rows);
    if (groups.length <= 1) {
        return (
            <section className={styles.block}>
                <h2>{title}</h2>
                <RequisitesTable rows={rows} />
            </section>
        );
    }
    return (
        <section className={styles.block}>
            <h2>{title}</h2>
            <div className={styles.bankGroups}>
                {groups.map((group, index) => (
                    <div key={index} className={styles.bankGroup}>
                        {group.bank && (
                            <h3 className={styles.bankName}>{group.bank}</h3>
                        )}
                        <RequisitesTable rows={group.rows} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default async function RequisitesPage() {
    const { legal } = toContactRecords(await getContacts());
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
                                <dd>{legal.inn}</dd>
                            </div>
                            <div>
                                <dt>ОГРН</dt>
                                <dd>{legal.ogrn}</dd>
                            </div>
                        </dl>
                    </aside>
                </section>

                <div className={styles.grid}>
                    <section className={styles.block}>
                        <h2>{company.title}</h2>
                        <RequisitesTable rows={company.rows} />
                    </section>

                    <BankRequisites title={bank.title} rows={bank.rows} />

                    <section className={styles.blockWide}>
                        <h2>{moscow.title}</h2>
                        <RequisitesTable rows={moscow.rows} />
                    </section>
                </div>
            </Container>
        </section>
    );
}

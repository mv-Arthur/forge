import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EMAIL, LEGAL, PHONES } from "@/content/contacts";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Реквизиты — Новый Коттедж",
    description:
        "Юридические и банковские реквизиты ООО Новый коттедж и московского филиала.",
    alternates: { canonical: "/requisites" },
};

const companyRows = [
    [
        "Полное наименование",
        "Общество с ограниченной ответственностью «Новый коттедж»",
    ],
    ["ИНН", LEGAL.inn],
    ["КПП", LEGAL.kpp],
    ["ОГРН", LEGAL.ogrn],
    [
        "Юридический адрес",
        "197227, Санкт-Петербург, Комендантский проспект, д. 4, офис 405",
    ],
    [
        "Фактический адрес",
        "197227, Санкт-Петербург, Комендантский проспект, д. 4, офис 405",
    ],
    ["Телефон", PHONES.spb.display],
    ["Эл. почта", EMAIL],
    ["Генеральный директор", "Бочанов Александр Борисович"],
    ["Главный бухгалтер", "Бочанов Александр Борисович"],
];

const bankRows = [
    ["Расчетный счет", "40702810003000066492"],
    ["Банк", "Ф-Л «Северная столица» АО «Райффайзенбанк»"],
    ["БИК", "044030723"],
    ["Корр. счёт", "30101810100000000723"],
    ["Расчётный счёт", "40702810455000012920"],
    ["Банк", "Северо-Западный банк ПАО Сбербанк"],
    ["БИК", "044030653"],
    ["Корр. счёт", "30101810500000000653"],
];

const moscowRows = [
    [
        "Полное наименование",
        "Общество с ограниченной ответственностью «Новый коттедж Мск»",
    ],
    ["ИНН", "7734445920"],
    ["КПП", "773401001"],
    ["ОГРН", "1217700425018"],
    ["Расчетный счет", "40702810501500103345"],
    ["Банк", "Филиал Точка ПАО Банка «Финансовая Корпорация Открытие»"],
    ["БИК", "044525999"],
    ["Корр. счёт", "30101810845250000999"],
    [
        "Юридический адрес",
        "1-й Нагатинский проезд, д. 2, «Технопарк 19», цокольный этаж, офис 6",
    ],
    [
        "Фактический адрес",
        "1-й Нагатинский проезд, д. 2, «Технопарк 19», цокольный этаж, офис 6",
    ],
    ["Телефон", PHONES.msk.display],
    ["Эл. почта", "msk@ncottage.ru"],
    ["Генеральный директор", "Бочанов Александр Борисович"],
    ["Главный бухгалтер", "Бочанов Александр Борисович"],
];

function RequisitesTable({ rows }: { rows: string[][] }) {
    return (
        <dl className={styles.table}>
            {rows.map(([label, value], index) => (
                <div key={`${label}-${index}`} className={styles.row}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                </div>
            ))}
        </dl>
    );
}

export default function RequisitesPage() {
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
                        eyebrow="Документы"
                        title="Реквизиты"
                        titleAccent="компании"
                        lead="Юридические данные, банковские счета и контакты для договоров, счетов и бухгалтерских документов."
                        tone="h1"
                        align="left"
                    />
                    <aside className={styles.summaryCard}>
                        <span>Для договора и оплаты</span>
                        <strong>ООО «Новый коттедж»</strong>
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
                        <h2>ООО «Новый коттедж»</h2>
                        <RequisitesTable rows={companyRows} />
                    </section>

                    <section className={styles.block}>
                        <h2>Банковские реквизиты</h2>
                        <RequisitesTable rows={bankRows} />
                    </section>

                    <section className={styles.blockWide}>
                        <h2>Реквизиты московского филиала</h2>
                        <RequisitesTable rows={moscowRows} />
                    </section>
                </div>
            </Container>
        </section>
    );
}

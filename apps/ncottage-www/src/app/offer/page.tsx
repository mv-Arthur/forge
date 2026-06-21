import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EMAIL, LEGAL, PHONES } from "@/content/contacts";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Публичная оферта — Новый Коттедж",
    description:
        "Правовой дисклеймер сайта Новый Коттедж: информация на сайте носит справочный характер и не является публичной офертой.",
    alternates: { canonical: "/offer" },
};

const notes = [
    {
        title: "Информационный характер материалов",
        text: "Проекты, изображения, планировки, комплектации, сроки, характеристики, цены и расчёты на сайте приведены для предварительного ознакомления. Они помогают сориентироваться в возможностях строительства, но не заменяют индивидуальное коммерческое предложение.",
    },
    {
        title: "Не является публичной офертой",
        text: "Вся представленная на сайте информация ни при каких условиях не является публичной офертой, определяемой пунктом 2 статьи 437 Гражданского кодекса Российской Федерации.",
    },
    {
        title: "Индивидуальный расчёт",
        text: "Итоговая стоимость строительства зависит от участка, геологии, выбранной технологии, комплектации, инженерных решений, региона работ, сроков и изменений проекта. Точные условия фиксируются в договоре и приложениях к нему.",
    },
    {
        title: "Изменение информации",
        text: "Компания вправе изменять материалы сайта, комплектации, цены, акции и условия без предварительного уведомления. Актуальные параметры необходимо уточнять у менеджера перед заключением договора.",
    },
];

export default function OfferPage() {
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
                            eyebrow="Правовой дисклеймер"
                            title="Публичная"
                            titleAccent="оферта"
                            lead="Уточняем правовой статус информации, размещённой в каталоге проектов, на страницах услуг и в рекламных блоках сайта."
                            tone="h1"
                            align="left"
                        />
                    </div>
                    <aside className={styles.accentCard}>
                        <span>Главное</span>
                        <p>
                            Информация на сайте носит справочный характер и не
                            является публичной офертой.
                        </p>
                    </aside>
                </section>

                <div className={styles.grid}>
                    {notes.map((note, index) => (
                        <article key={note.title} className={styles.card}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <h2>{note.title}</h2>
                            <p>{note.text}</p>
                        </article>
                    ))}
                </div>

                <section className={styles.contactCard}>
                    <div>
                        <span>Уточнить условия</span>
                        <h2>Получите актуальное предложение по проекту</h2>
                        <p>
                            Менеджер проверит комплектацию, регион строительства
                            и подготовит расчёт под ваш участок и задачу.
                        </p>
                    </div>
                    <div className={styles.actions}>
                        <Link href="/projects" className={styles.primaryButton}>
                            Перейти в каталог
                        </Link>
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

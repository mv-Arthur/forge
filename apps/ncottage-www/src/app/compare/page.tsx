import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Сравнение проектов — Новый Коттедж",
    description:
        "Сравнение проектов домов Новый Коттедж. Добавляйте проекты из каталога, чтобы сопоставить площадь, технологию и комплектацию.",
    alternates: { canonical: "/compare" },
};

const compareItems = [
    "площадь, этажность и состав помещений",
    "технология строительства и особенности проекта",
    "ориентир по комплектации и дальнейшим доработкам",
];

export default function ComparePage() {
    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Сравнение" },
                    ]}
                />

                <section className={styles.emptyState}>
                    <div className={styles.emptyContent}>
                        <SectionHeading
                            eyebrow="Выбор проекта"
                            title="Сравните проекты"
                            titleAccent="перед встречей"
                            lead="Добавьте несколько проектов из каталога, чтобы сопоставить планировки, технологии и параметры будущего дома перед консультацией."
                            tone="h1"
                            align="left"
                        />
                        <div className={styles.actions}>
                            <Link href="/projects/all" className={styles.primaryButton}>
                                Выбрать проекты
                            </Link>
                            <Link href="/services/construction" className={styles.secondaryButton}>
                                О строительстве
                            </Link>
                        </div>
                    </div>
                    <div className={styles.visualPanel} aria-hidden="true">
                        <div className={styles.compareCard}>
                            <span />
                            <i />
                            <i />
                            <i />
                        </div>
                        <div className={styles.compareCardAlt}>
                            <span />
                            <i />
                            <i />
                            <i />
                        </div>
                        <div className={styles.compareScale}>
                            <b />
                            <b />
                            <b />
                        </div>
                    </div>
                </section>

                <section className={styles.infoGrid}>
                    {compareItems.map((item, index) => (
                        <article key={item} className={styles.infoCard}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <p>{item}</p>
                        </article>
                    ))}
                </section>
            </Container>
        </section>
    );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getServices } from "@/lib/data";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Услуги — Новый Коттедж",
    description: "Полный спектр услуг по строительству загородных домов.",
};

export default function ServicesPage() {
    const services = getServices();

    return (
        <section className={styles.page}>
            <Container>
                <SectionHeading
                    label="Услуги"
                    title="Что мы предлагаем"
                    description="Полный цикл — от проектирования до благоустройства участка."
                />
                <div className={styles.grid}>
                    {services.map((s) => (
                        <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className={styles.card}
                        >
                            <div
                                className={styles.cardImage}
                                style={{
                                    backgroundImage: `url(${s.image})`,
                                }}
                            />
                            <div className={styles.cardBody}>
                                <h3 className={styles.cardTitle}>
                                    {s.title}
                                </h3>
                                <p className={styles.cardText}>
                                    {s.shortDescription}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}

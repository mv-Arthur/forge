import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.css";

export const metadata: Metadata = {
    title: "Избранное — Новый Коттедж",
    description:
        "Избранные проекты домов Новый Коттедж. Добавляйте понравившиеся проекты и возвращайтесь к ним позже.",
    alternates: { canonical: "/favourites" },
};

const tips = [
    "сохраняйте проекты с подходящей площадью и планировкой",
    "возвращайтесь к подборке перед консультацией с менеджером",
    "сравнивайте технологии, комплектации и внешний вид домов",
];

export default function FavouritesPage() {
    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Избранное" },
                    ]}
                />

                <section className={styles.emptyState}>
                    <div className={styles.emptyContent}>
                        <SectionHeading
                            eyebrow="Личная подборка"
                            title="Избранные проекты"
                            titleAccent="ждут выбора"
                            lead="Добавляйте понравившиеся проекты из каталога, чтобы быстро вернуться к ним и обсудить варианты строительства со специалистом."
                            tone="h1"
                            align="left"
                        />
                        <div className={styles.actions}>
                            <Link href="/projects/all" className={styles.primaryButton}>
                                Перейти в каталог
                            </Link>
                            <Link href="/contacts" className={styles.secondaryButton}>
                                Получить консультацию
                            </Link>
                        </div>
                    </div>
                    <div className={styles.visualPanel} aria-hidden="true">
                        <div className={styles.projectCard}>
                            <div className={styles.projectImage} />
                            <div className={styles.projectLineLong} />
                            <div className={styles.projectLineShort} />
                        </div>
                        <div className={styles.projectCardSecondary}>
                            <div className={styles.projectImage} />
                            <div className={styles.projectLineLong} />
                            <div className={styles.projectLineShort} />
                        </div>
                        <div className={styles.saveMark} />
                    </div>
                </section>

                <section className={styles.tipsCard}>
                    <span>Как использовать избранное</span>
                    <ul>
                        {tips.map((tip) => (
                            <li key={tip}>{tip}</li>
                        ))}
                    </ul>
                </section>
            </Container>
        </section>
    );
}

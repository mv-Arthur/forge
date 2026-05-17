import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ADDITIONAL_SERVICE_LINKS, SERVICES } from "./services";
import styles from "./services.module.css";

export const metadata: Metadata = {
    title: "Услуги — проектирование и строительство домов | Новый Коттедж",
    description:
        "Услуги компании Новый Коттедж: проектирование, строительство домов, фундаменты, бани, коммерческая недвижимость, отделка, благоустройство, инженерные сети и демонтаж.",
    alternates: { canonical: "/services" },
};

export default function ServicesPage() {
    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Услуги" },
                    ]}
                />

                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <p className={styles.eyebrow}>Услуги</p>
                        <h1 className={styles.title}>
                            Всё для загородного дома: от проекта до участка
                        </h1>
                        <p className={styles.lead}>
                            Собрали ключевые направления работ: проектирование, строительство, инженерия, отделка, благоустройство и подготовка участка к работам.
                        </p>
                    </div>
                    <div className={styles.heroPanel}>
                        <span className={styles.panelLabel}>Полный цикл</span>
                        <strong>Проект · стройка · инженерия · отделка</strong>
                        <p>
                            Можно заказать отдельный этап или собрать комплекс
                            работ под конкретный дом, участок и бюджет.
                        </p>
                    </div>
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow="Направления"
                        title="Ключевые услуги"
                        lead="Каждое направление описывает результат, состав работ и следующий шаг для клиента."
                        align="left"
                    />
                    <div className={styles.grid}>
                        {SERVICES.map((service, index) => (
                            <Link
                                key={service.slug}
                                href={`/services/${service.slug}`}
                                className={styles.card}
                            >
                                <span className={styles.cardIndex}>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className={styles.cardBody}>
                                    <span className={styles.cardTitle}>
                                        {service.shortTitle}
                                    </span>
                                    <span className={styles.cardText}>
                                        {service.description}
                                    </span>
                                </span>
                                <span className={styles.cardArrow}>
                                    Перейти
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow="Дополнительные направления"
                        title="Дополнительные направления"
                        lead="Технологии строительства и инженерные подразделы помогают быстро перейти к нужной услуге."
                        align="left"
                    />
                    <div className={styles.tagsGrid}>
                        {ADDITIONAL_SERVICE_LINKS.map((item) => (
                            <Link
                                key={item.title}
                                href={`/services/${item.parentSlug}`}
                                className={styles.tagCard}
                            >
                                <span>{item.title}</span>
                                <small>подробнее в разделе</small>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className={styles.cta}>
                    <div>
                        <p className={styles.eyebrow}>
                            Не уверены, с чего начать?
                        </p>
                        <h2>Подберём нужную услугу под задачу</h2>
                        <p>
                            Опишите участок, дом или объект — специалист
                            подскажет, какие этапы нужны сейчас, а что можно
                            запланировать позже.
                        </p>
                    </div>
                    <a className={styles.ctaButton} href="tel:+78123093818">
                        Позвонить в СПб
                    </a>
                </section>
            </Container>
        </section>
    );
}

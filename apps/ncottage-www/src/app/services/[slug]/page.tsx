import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICE_MAP, SERVICES, type ServiceSlug } from "../services";
import styles from "./detail.module.css";

interface Props {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const service = SERVICE_MAP.get(slug as ServiceSlug);

    if (!service) return { title: "Услуга не найдена" };

    return {
        title: `${service.shortTitle} — услуги | Новый Коттедж`,
        description: service.description,
        alternates: { canonical: `/services/${service.slug}` },
    };
}

export default async function ServiceDetailPage({ params }: Props) {
    const { slug } = await params;
    const service = SERVICE_MAP.get(slug as ServiceSlug);

    if (!service) notFound();

    const related = SERVICES.filter((item) => item.slug !== service.slug).slice(
        0,
        3
    );

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Услуги", href: "/services" },
                        { label: service.shortTitle },
                    ]}
                />

                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <p className={styles.eyebrow}>{service.eyebrow}</p>
                        <h1 className={styles.title}>{service.title}</h1>
                        <p className={styles.lead}>{service.lead}</p>
                        <ul className={styles.heroMeta}>
                            <li>Консультация</li>
                            <li>Смета</li>
                            <li>Договор</li>
                        </ul>
                        <div className={styles.heroActions}>
                            <a
                                className={styles.primaryButton}
                                href="tel:+78123093818"
                            >
                                {service.cta}
                            </a>
                            <Link
                                className={styles.secondaryButton}
                                href="/services"
                            >
                                Все услуги
                            </Link>
                        </div>
                    </div>
                    <aside className={styles.heroAside}>
                        <p>Что входит</p>
                        <ul>
                            {service.highlights.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </aside>
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow="Описание"
                        title="Что делаем"
                        lead={service.summary}
                        align="left"
                    />
                    <div className={styles.scopeGrid}>
                        {service.scopes.map((item) => (
                            <article key={item} className={styles.scopeCard}>
                                <span />
                                <h2>{item}</h2>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow="Процесс"
                        title="Этапы работы"
                        lead="Сохраняем понятную последовательность: сначала вводные и расчёт, затем договор, работы и передача результата."
                        align="left"
                    />
                    <ol className={styles.steps}>
                        {service.stages.map((stage, index) => (
                            <li key={stage} className={styles.step}>
                                <span>
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <p>{stage}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className={styles.splitSection}>
                    <div className={styles.benefits}>
                        <SectionHeading
                            eyebrow="Преимущества"
                            title="Почему Новый Коттедж"
                            align="left"
                        />
                        <ul>
                            {service.advantages.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.ctaCard}>
                        <p className={styles.eyebrow}>Заявка</p>
                        <h2>Расскажите о задаче — подскажем следующий шаг</h2>
                        <p>
                            Можно начать с консультации, расчёта или подбора
                            проекта. Специалист уточнит вводные и предложит
                            оптимальный формат.
                        </p>
                        <a href="tel:+78123093818">Связаться со специалистом</a>
                    </div>
                </section>

                <section className={styles.section}>
                    <SectionHeading
                        eyebrow="Смежные направления"
                        title="Может понадобиться ещё"
                        align="left"
                    />
                    <div className={styles.relatedGrid}>
                        {related.map((item) => (
                            <Link
                                key={item.slug}
                                href={`/services/${item.slug}`}
                                className={styles.relatedCard}
                            >
                                <strong>{item.shortTitle}</strong>
                                <span>{item.description}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            </Container>
        </section>
    );
}

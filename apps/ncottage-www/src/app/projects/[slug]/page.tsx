import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getProjects, getProjectBySlug } from "@/lib/data";
import { formatPrice, formatArea } from "@/lib/utils";
import styles from "./page.module.css";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) return { title: "Проект не найден" };
    return {
        title: `${project.name} — проект дома ${formatArea(project.area)} | Новый Коттедж`,
        description: project.description,
    };
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) notFound();

    return (
        <section className={styles.page}>
            <Container>
                <div className={styles.hero}>
                    <div
                        className={styles.heroImage}
                        style={{
                            backgroundImage: `url(${project.image})`,
                        }}
                    />
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroContent}>
                        <Link href="/projects" className={styles.back}>
                            &larr; Все проекты
                        </Link>
                        <h1 className={styles.title}>
                            {project.name}{" "}
                            <span className={styles.dims}>
                                {project.specs.dimensions} м
                            </span>
                        </h1>
                        <p className={styles.price}>
                            от {formatPrice(project.price)}
                        </p>
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.main}>
                        <h2 className={styles.sectionTitle}>О проекте</h2>
                        <p className={styles.description}>
                            {project.description}
                        </p>

                        <h2 className={styles.sectionTitle}>
                            Характеристики
                        </h2>
                        <div className={styles.specs}>
                            <div className={styles.specRow}>
                                <span className={styles.specLabel}>
                                    Площадь
                                </span>
                                <span>{formatArea(project.area)}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span className={styles.specLabel}>
                                    Этажность
                                </span>
                                <span>
                                    {project.floors}{" "}
                                    {project.floors === 1
                                        ? "этаж"
                                        : "этажа"}
                                </span>
                            </div>
                            <div className={styles.specRow}>
                                <span className={styles.specLabel}>
                                    Спальни
                                </span>
                                <span>{project.bedrooms}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span className={styles.specLabel}>
                                    Санузлы
                                </span>
                                <span>{project.bathrooms}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span className={styles.specLabel}>
                                    Габариты
                                </span>
                                <span>{project.specs.dimensions} м</span>
                            </div>
                            <div className={styles.specRow}>
                                <span className={styles.specLabel}>
                                    Кровля
                                </span>
                                <span>{project.specs.roofType}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span className={styles.specLabel}>
                                    Фундамент
                                </span>
                                <span>{project.specs.foundation}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span className={styles.specLabel}>
                                    Стены
                                </span>
                                <span>{project.specs.wallMaterial}</span>
                            </div>
                            <div className={styles.specRow}>
                                <span className={styles.specLabel}>
                                    Срок строительства
                                </span>
                                <span>{project.specs.buildTime}</span>
                            </div>
                        </div>
                    </div>

                    <aside className={styles.sidebar}>
                        <div className={styles.cta}>
                            <p className={styles.ctaPrice}>
                                от {formatPrice(project.price)}
                            </p>
                            <p className={styles.ctaNote}>
                                Цена фиксируется в договоре
                            </p>
                            <Button size="lg">Заказать расчёт</Button>
                            <Button variant="outline" size="lg">
                                Задать вопрос
                            </Button>
                        </div>
                    </aside>
                </div>
            </Container>
        </section>
    );
}

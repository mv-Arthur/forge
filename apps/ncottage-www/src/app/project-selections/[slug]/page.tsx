import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectsCatalog } from "@/components/features/projects-catalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProjects } from "@/data/projects";
import {
    GROUP_LABELS,
    getSelectionBySlug,
    PROJECT_SELECTIONS,
} from "../selections";
import styles from "./page.module.css";

interface Props {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return PROJECT_SELECTIONS.map((selection) => ({ slug: selection.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const selection = getSelectionBySlug(slug);

    if (!selection) return { title: "Подборка не найдена" };

    return {
        title: `${selection.title} — Новый Коттедж`,
        description: selection.metaDescription,
        alternates: { canonical: `/project-selections/${selection.slug}` },
    };
}

export default async function ProjectSelectionPage({ params }: Props) {
    const { slug } = await params;
    const selection = getSelectionBySlug(slug);

    if (!selection) notFound();

    const projects = getProjects().filter(selection.filter);
    const minArea = projects.length
        ? Math.min(...projects.map((project) => project.area))
        : 0;
    const maxArea = projects.length
        ? Math.max(...projects.map((project) => project.area))
        : 0;
    const minPrice = projects.length
        ? Math.min(...projects.map((project) => project.price))
        : 0;

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Наши проекты", href: "/projects" },
                        { label: "Подборки", href: "/project-selections" },
                        { label: selection.shortTitle },
                    ]}
                />

                <section className={styles.hero}>
                    <SectionHeading
                        eyebrow={GROUP_LABELS[selection.group]}
                        title={selection.title}
                        lead={selection.description}
                        align="left"
                        tone="h1"
                        className={styles.heroHeading}
                    />

                    <aside className={styles.heroPanel}>
                        <span className={styles.panelEyebrow}>
                            Параметры подборки
                        </span>
                        <div className={styles.panelPlan} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                        <dl className={styles.stats}>
                            <div>
                                <dt>Проекты</dt>
                                <dd>{projects.length}</dd>
                            </div>
                            {projects.length > 0 && (
                                <>
                                    <div>
                                        <dt>Площадь</dt>
                                        <dd>
                                            {minArea}–{maxArea} м²
                                        </dd>
                                    </div>
                                    <div>
                                        <dt>Стоимость от</dt>
                                        <dd>
                                            {new Intl.NumberFormat("ru-RU", {
                                                maximumFractionDigits: 1,
                                            }).format(
                                                minPrice / 1_000_000
                                            )}{" "}
                                            млн ₽
                                        </dd>
                                    </div>
                                </>
                            )}
                        </dl>
                    </aside>
                </section>

                <section className={styles.guide}>
                    <div>
                        <span className={styles.eyebrow}>Как выбирать</span>
                        <h2>
                            Смотрите не только на фасад, но и на сценарий жизни
                        </h2>
                    </div>
                    <p>
                        В подборке собраны проекты, близкие по ключевому
                        критерию. Откройте карточку, сравните планировку,
                        технологию, комплектацию и срок строительства — так
                        проще понять, какой дом подходит именно вашему участку.
                    </p>
                </section>

                <div className={styles.catalogHead}>
                    <SectionHeading
                        eyebrow="Каталог"
                        title="Проекты из подборки"
                        lead="Можно дополнительно уточнить площадь, технологию, цену и состав помещений через фильтры каталога."
                        align="left"
                        className={styles.sectionHead}
                    />
                </div>
                <ProjectsCatalog projects={projects} />
            </Container>
        </section>
    );
}

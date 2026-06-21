"use client";

import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/domain/project";
import { PROJECT_TECHNOLOGY_LABELS } from "@/domain/technology";
import { getProjectBySlug } from "@/data/projects";
import { formatPrice } from "@/lib/utils";
import { useSelection } from "@/lib/selection";
import styles from "./page.module.css";

const compareItems = [
    "площадь, этажность и состав помещений",
    "технология строительства и особенности проекта",
    "ориентир по комплектации и дальнейшим доработкам",
];

const ROWS: { label: string; value: (project: Project) => string }[] = [
    {
        label: "Цена от",
        value: (project) =>
            formatPrice(project.packages?.[0]?.price ?? project.price),
    },
    { label: "Площадь", value: (project) => `${project.area} м²` },
    { label: "Этажность", value: (project) => String(project.floors) },
    { label: "Спальни", value: (project) => String(project.bedrooms) },
    { label: "Санузлы", value: (project) => String(project.bathrooms) },
    {
        label: "Технология",
        value: (project) => PROJECT_TECHNOLOGY_LABELS[project.technology],
    },
    {
        label: "Габариты",
        value: (project) => `${project.specs.dimensions} м`,
    },
    {
        label: "Срок строительства",
        value: (project) => project.specs.buildTime,
    },
];

export function CompareView() {
    const { compare, removeCompare, clearCompare } = useSelection();
    const projects = compare
        .map((slug) => getProjectBySlug(slug))
        .filter((project): project is Project => project !== undefined);

    const gridTemplateColumns = `minmax(140px, 200px) repeat(${projects.length}, minmax(200px, 1fr))`;

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Сравнение" },
                    ]}
                />

                {projects.length === 0 ? (
                    <>
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
                                    <Link
                                        href="/projects/all"
                                        className={styles.primaryButton}
                                    >
                                        Выбрать проекты
                                    </Link>
                                    <Link
                                        href="/services/construction"
                                        className={styles.secondaryButton}
                                    >
                                        О строительстве
                                    </Link>
                                </div>
                            </div>
                            <div
                                className={styles.visualPanel}
                                aria-hidden="true"
                            >
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
                                    <span>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <p>{item}</p>
                                </article>
                            ))}
                        </section>
                    </>
                ) : (
                    <section className={styles.results}>
                        <div className={styles.resultsHead}>
                            <SectionHeading
                                eyebrow="Выбор проекта"
                                title="Сравнение проектов"
                                tone="h1"
                                align="left"
                            />
                            <button
                                type="button"
                                className={styles.clear}
                                onClick={clearCompare}
                            >
                                Очистить сравнение
                            </button>
                        </div>

                        <div className={styles.tableScroll}>
                            <div
                                className={styles.table}
                                style={{ gridTemplateColumns }}
                            >
                                <div className={styles.corner} />
                                {projects.map((project) => (
                                    <div
                                        key={project.slug}
                                        className={styles.colHead}
                                    >
                                        <button
                                            type="button"
                                            className={styles.remove}
                                            aria-label={`Убрать ${project.name} из сравнения`}
                                            onClick={() =>
                                                removeCompare(project.slug)
                                            }
                                        >
                                            &times;
                                        </button>
                                        <Link
                                            href={`/project/${project.slug}`}
                                            className={styles.thumbLink}
                                        >
                                            <span className={styles.thumb}>
                                                <Image
                                                    src={project.image}
                                                    alt={project.name}
                                                    fill
                                                    sizes="240px"
                                                    className={styles.thumbImg}
                                                />
                                            </span>
                                            <span className={styles.colName}>
                                                {project.name}
                                            </span>
                                        </Link>
                                    </div>
                                ))}

                                {ROWS.map((row) => (
                                    <div
                                        key={row.label}
                                        className={styles.rowContents}
                                    >
                                        <div className={styles.rowLabel}>
                                            {row.label}
                                        </div>
                                        {projects.map((project) => (
                                            <div
                                                key={project.slug}
                                                className={styles.cell}
                                            >
                                                {row.value(project)}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </Container>
        </section>
    );
}

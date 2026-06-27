import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProjects } from "@/data/projects";
import { getSelections } from "@/data/project-selections";
import { getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import { matchesSelection } from "@/domain/project-selection";
import { GROUP_LABELS } from "./selections";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeo();
    return buildPageMetadata({
        seo,
        title: seo.indexes["project-selections"].title,
        description: seo.indexes["project-selections"].description,
        path: "/project-selections",
    });
}

export const revalidate = 60;

export default async function ProjectSelectionsPage() {
    const [projects, selections] = await Promise.all([
        getProjects(),
        getSelections(),
    ]);
    const countFor = (selection: (typeof selections)[number]) =>
        projects.filter((p) => matchesSelection(p, selection.filter)).length;
    const featuredSelections = selections.slice(0, 3).map((selection) => ({
        ...selection,
        count: countFor(selection),
    }));
    const grouped = Object.entries(GROUP_LABELS).map(([group, label]) => ({
        group,
        label,
        selections: selections.filter((selection) => selection.group === group),
    }));

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Наши проекты", href: "/projects" },
                        { label: "Подборки" },
                    ]}
                />

                <section className={styles.hero}>
                    <SectionHeading
                        eyebrow="Каталог по сценариям"
                        title="Подборки проектов"
                        titleAccent="для разных участков"
                        lead="Выбирайте не по сухому списку параметров, а по жизненному сценарию: постоянное проживание, дом с террасой, компактная дача, современная архитектура или просторный семейный проект."
                        align="left"
                        tone="h1"
                        className={styles.heroHeading}
                    />

                    <aside className={styles.heroPanel}>
                        <span className={styles.panelEyebrow}>
                            Кураторский маршрут
                        </span>
                        <div className={styles.panelLines} aria-hidden="true">
                            <span />
                            <span />
                            <span />
                        </div>
                        <div className={styles.panelStats}>
                            <div>
                                <strong>{selections.length}</strong>
                                <span>подборок</span>
                            </div>
                            <div>
                                <strong>{projects.length}</strong>
                                <span>проектов</span>
                            </div>
                        </div>
                    </aside>
                </section>

                <section className={styles.featured}>
                    {featuredSelections.map((selection) => (
                        <Link
                            key={selection.slug}
                            href={`/project-selections/${selection.slug}`}
                            className={styles.featuredCard}
                        >
                            <span className={styles.cardMeta}>
                                {selection.count} проектов
                            </span>
                            <h2>{selection.shortTitle}</h2>
                            <p>{selection.description}</p>
                        </Link>
                    ))}
                </section>

                <div className={styles.groups}>
                    {grouped.map(({ group, label, selections }) => (
                        <section key={group} className={styles.group}>
                            <div className={styles.groupHeader}>
                                <h2 className={styles.groupTitle}>{label}</h2>
                                <span className={styles.groupCount}>
                                    {selections.length} подборок
                                </span>
                            </div>
                            <div className={styles.grid}>
                                {selections.map((selection) => {
                                    const count = countFor(selection);

                                    return (
                                        <Link
                                            key={selection.slug}
                                            className={styles.card}
                                            href={`/project-selections/${selection.slug}`}
                                        >
                                            <span className={styles.cardMeta}>
                                                {count} проектов
                                            </span>
                                            <span className={styles.cardTitle}>
                                                {selection.shortTitle}
                                            </span>
                                            <span className={styles.cardText}>
                                                {selection.description}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </Container>
        </section>
    );
}

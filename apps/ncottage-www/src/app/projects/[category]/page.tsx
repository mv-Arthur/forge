import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProjectsCatalog } from "@/components/sections/ProjectsCatalog";
import { PROJECT_HUB_CATEGORIES } from "@/lib/constants";
import { getProjectBySlug, getProjects } from "@/lib/data";
import styles from "./category.module.css";

interface Props {
    params: Promise<{ category: string }>;
}

export function generateStaticParams() {
    return PROJECT_HUB_CATEGORIES.map((c) => ({ category: c.slug }));
}

function findCategory(slug: string) {
    return PROJECT_HUB_CATEGORIES.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { category } = await params;
    const meta = findCategory(category);
    if (!meta) return { title: "Категория не найдена" };
    return {
        title: `${meta.title} — Новый Коттедж`,
        description: meta.description,
        alternates: { canonical: `/projects/${meta.slug}` },
    };
}

export default async function CategoryPage({ params }: Props) {
    const { category } = await params;

    if (getProjectBySlug(category)) {
        redirect(`/project/${category}`);
    }

    const meta = findCategory(category);
    if (!meta) notFound();

    const projects = getProjects();

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Наши проекты", href: "/projects" },
                        { label: meta.title },
                    ]}
                />
                <h1 className={styles.title}>{meta.title}</h1>
                <p className={styles.lead}>{meta.description}</p>
                <ProjectsCatalog
                    projects={projects}
                    lockedTechnology={meta.technology}
                />
            </Container>
        </section>
    );
}

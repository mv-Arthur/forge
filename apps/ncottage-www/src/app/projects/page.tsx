import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProjectsHub } from "@/components/sections/ProjectsHub";
import styles from "./hub.module.css";

export const metadata: Metadata = {
    title: "Наши проекты — каталог загородных домов | Новый Коттедж",
    description:
        "Каталог проектов загородных домов: газобетон, кирпич, каркас, СИП-панели, фахверк. Выберите категорию и подберите проект под свой бюджет.",
    alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Наши проекты" },
                    ]}
                />
                <h1 className={styles.title}>Наши проекты</h1>
                <ProjectsHub />
            </Container>
        </section>
    );
}

import type { Metadata } from "next";
import { getSeo } from "@/data/settings";
import { buildPageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProjectsHub } from "@/components/features/projects-hub";
import styles from "./hub.module.css";

export async function generateMetadata(): Promise<Metadata> {
    const seo = await getSeo();
    return buildPageMetadata({
        seo,
        title: seo.indexes["projects"].title,
        description: seo.indexes["projects"].description,
        path: "/projects",
    });
}

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

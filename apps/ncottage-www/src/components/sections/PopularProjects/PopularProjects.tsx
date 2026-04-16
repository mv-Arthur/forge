import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { getFeaturedProjects } from "@/lib/data";
import styles from "./PopularProjects.module.css";

export function PopularProjects() {
    const projects = getFeaturedProjects();

    return (
        <section className={styles.section}>
            <Container>
                <h2 className={styles.title}>Популярные проекты</h2>
                <div className={styles.grid}>
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.slug}
                            project={project}
                        />
                    ))}
                </div>
                <div className={styles.more}>
                    <Link
                        href="/projects"
                        style={{
                            display: "inline-block",
                            padding: "14px 40px",
                            fontSize: 13,
                            fontWeight: 500,
                            textTransform: "uppercase" as const,
                            letterSpacing: 1,
                            color: "var(--color-green)",
                            border: "2px solid var(--color-green)",
                            borderRadius: 4,
                        }}
                    >
                        Все проекты
                    </Link>
                </div>
            </Container>
        </section>
    );
}

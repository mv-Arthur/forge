import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsCatalog } from "@/components/sections/ProjectsCatalog";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
    title: "Проекты домов — Новый Коттедж",
    description:
        "Каталог готовых проектов загородных домов. Фильтр по технологии, площади, цене, спальням и стилю.",
    alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
    const projects = getProjects();

    return (
        <section style={{ padding: "120px 0 80px" }}>
            <Container>
                <SectionHeading
                    label="Каталог"
                    title="Проекты домов"
                    description="Выберите проект и адаптируем его под ваш участок. Все цены фиксированные."
                />
                <ProjectsCatalog projects={projects} />
            </Container>
        </section>
    );
}

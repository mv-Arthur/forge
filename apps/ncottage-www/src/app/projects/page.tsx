import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectFilter } from "@/components/sections/ProjectFilter";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
    title: "Проекты домов — Новый Коттедж",
    description:
        "Каталог готовых проектов загородных домов. Фильтр по технологии, площади и бюджету.",
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
                <ProjectFilter projects={projects} />
            </Container>
        </section>
    );
}

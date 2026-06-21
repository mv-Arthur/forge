import type { Metadata } from "next";
import { getProjects } from "@/data/projects";
import { CompareView } from "./CompareView";

export const metadata: Metadata = {
    title: "Сравнение проектов — Новый Коттедж",
    description:
        "Сравнение проектов домов Новый Коттедж. Добавляйте проекты из каталога, чтобы сопоставить площадь, технологию и комплектацию.",
    alternates: { canonical: "/compare" },
};

export const revalidate = 60;

export default async function ComparePage() {
    const projects = await getProjects();
    return <CompareView projects={projects} />;
}

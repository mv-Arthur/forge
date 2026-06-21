import type { Metadata } from "next";
import { getProjects } from "@/data/projects";
import { FavouritesView } from "./FavouritesView";

export const metadata: Metadata = {
    title: "Избранное — Новый Коттедж",
    description:
        "Избранные проекты домов Новый Коттедж. Добавляйте понравившиеся проекты и возвращайтесь к ним позже.",
    alternates: { canonical: "/favourites" },
};

export const revalidate = 60;

export default async function FavouritesPage() {
    const projects = await getProjects();
    return <FavouritesView projects={projects} />;
}

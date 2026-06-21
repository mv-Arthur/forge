import type { Metadata } from "next";
import { FavouritesView } from "./FavouritesView";

export const metadata: Metadata = {
    title: "Избранное — Новый Коттедж",
    description:
        "Избранные проекты домов Новый Коттедж. Добавляйте понравившиеся проекты и возвращайтесь к ним позже.",
    alternates: { canonical: "/favourites" },
};

export default function FavouritesPage() {
    return <FavouritesView />;
}

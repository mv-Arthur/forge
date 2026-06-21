import type { Metadata } from "next";
import { CompareView } from "./CompareView";

export const metadata: Metadata = {
    title: "Сравнение проектов — Новый Коттедж",
    description:
        "Сравнение проектов домов Новый Коттедж. Добавляйте проекты из каталога, чтобы сопоставить площадь, технологию и комплектацию.",
    alternates: { canonical: "/compare" },
};

export default function ComparePage() {
    return <CompareView />;
}

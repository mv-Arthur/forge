import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
    title: "Наши работы — Новый Коттедж",
    description: "Галерея построенных домов и объектов.",
};

export default function OurWorksPage() {
    return (
        <section style={{ paddingTop: 120 }}>
            <Container>
                <SectionHeading
                    label="Портфолио"
                    title="Наши построенные объекты"
                    description="Более 200 домов в Санкт-Петербурге и Ленинградской области."
                />
            </Container>
        </section>
    );
}

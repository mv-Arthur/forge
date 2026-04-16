import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GallerySection } from "@/components/sections/GallerySection";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = {
    title: "Наши работы — Новый Коттедж",
    description: "Галерея построенных домов и объектов.",
};

export default function OurWorksPage() {
    const gallery = getGallery();

    return (
        <section style={{ paddingTop: 120 }}>
            <Container>
                <SectionHeading
                    label="Портфолио"
                    title="Наши построенные объекты"
                    description="Более 200 домов в Санкт-Петербурге и Ленинградской области."
                />
            </Container>
            <GallerySection items={gallery} />
        </section>
    );
}

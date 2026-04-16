import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getServices, getServiceBySlug } from "@/lib/data";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) return { title: "Услуга не найдена" };
    return {
        title: `${service.title} — Новый Коттедж`,
        description: service.shortDescription,
    };
}

export default async function ServicePage({ params }: Props) {
    const { slug } = await params;
    const service = getServiceBySlug(slug);
    if (!service) notFound();

    return (
        <section style={{ padding: "120px 0 80px" }}>
            <Container>
                <Link
                    href="/services"
                    style={{
                        fontSize: "0.8125rem",
                        color: "var(--color-text-muted)",
                        marginBottom: 16,
                        display: "inline-block",
                    }}
                >
                    &larr; Все услуги
                </Link>
                <h1
                    style={{
                        fontSize: "2.5rem",
                        fontWeight: 700,
                        marginBottom: 16,
                    }}
                >
                    {service.title}
                </h1>
                <p
                    style={{
                        fontSize: "1.0625rem",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.7,
                        maxWidth: 720,
                        marginBottom: 32,
                    }}
                >
                    {service.description}
                </p>
                <Link href="/contacts">
                    <Button size="lg">Получить консультацию</Button>
                </Link>
            </Container>
        </section>
    );
}

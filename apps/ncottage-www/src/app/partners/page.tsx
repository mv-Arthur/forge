import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
    title: "Партнёрам — Новый Коттедж",
    description: "Партнёрская программа для риэлторов и смежных компаний.",
};

export default function PartnersPage() {
    return (
        <section style={{ padding: "120px 0 80px" }}>
            <Container>
                <SectionHeading
                    label="Партнёрам"
                    title="Партнёрская программа"
                    description="Приглашаем к сотрудничеству риэлторов, архитекторов и поставщиков строительных материалов."
                />
                <div
                    style={{
                        maxWidth: 640,
                        margin: "0 auto",
                        textAlign: "center",
                    }}
                >
                    <p
                        style={{
                            color: "var(--color-text-secondary)",
                            lineHeight: 1.7,
                            marginBottom: 32,
                        }}
                    >
                        Мы предлагаем выгодные условия партнёрства:
                        комиссионное вознаграждение за привлечённых клиентов,
                        совместные маркетинговые акции, приоритетные условия
                        по проектам. Свяжитесь с нами для обсуждения деталей.
                    </p>
                    <Link href="/contacts">
                        <Button size="lg">Связаться с нами</Button>
                    </Link>
                </div>
            </Container>
        </section>
    );
}

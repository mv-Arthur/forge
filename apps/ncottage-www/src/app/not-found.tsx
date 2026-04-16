import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <section
            style={{
                padding: "200px 0",
                textAlign: "center",
            }}
        >
            <Container>
                <h1
                    style={{
                        fontSize: "6rem",
                        fontWeight: 800,
                        color: "var(--color-accent)",
                        lineHeight: 1,
                        marginBottom: 16,
                    }}
                >
                    404
                </h1>
                <p
                    style={{
                        fontSize: "1.25rem",
                        color: "var(--color-text-secondary)",
                        marginBottom: 32,
                    }}
                >
                    Страница не найдена
                </p>
                <Link href="/">
                    <Button size="lg">На главную</Button>
                </Link>
            </Container>
        </section>
    );
}

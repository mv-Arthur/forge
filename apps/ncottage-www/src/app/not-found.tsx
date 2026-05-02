import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NotFoundIllustration } from "@/components/layout/NotFoundIllustration";
import styles from "./not-found.module.css";

export const metadata = {
    title: "Страница не найдена — Новый Коттедж",
    robots: { index: false, follow: false },
};

export default function NotFound() {
    return (
        <section className={styles.section}>
            <Container>
                <div className={styles.layout}>
                    <div className={styles.illustration}>
                        <NotFoundIllustration />
                    </div>

                    <div className={styles.content}>
                        <span className={styles.hairline} aria-hidden="true" />
                        <p className={styles.eyebrow}>Ошибка 404</p>
                        <h1 className={styles.title}>
                            Дом по этому адресу не найден.
                        </h1>
                        <p className={styles.lead}>
                            Возможно, страница была перемещена или ссылка
                            устарела. Загляните в каталог — у нас более 200
                            готовых проектов под ключ.
                        </p>
                        <div className={styles.actions}>
                            <Link href="/projects" className={styles.primary}>
                                Каталог проектов
                            </Link>
                            <Link href="/" className={styles.secondary}>
                                На главную
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

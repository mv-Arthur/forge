import Link from "next/link";
import { Container } from "@/components/ui/Container";
import styles from "./HeroSection.module.css";

export function HeroSection() {
    return (
        <section className={styles.banner}>
            <div className={styles.bg}>
                <img
                    src="/images/hero/banner.jpg"
                    alt=""
                    className={styles.bgImage}
                />
            </div>
            <Container className={styles.content}>
                <p className={styles.subtitle}>
                    Строительная компания Новый Коттедж
                </p>
                <h1 className={styles.title}>Строительство домов</h1>
                <p className={styles.text}>
                    стильная эргономика и комфорт загородной жизни
                </p>
                <Link href="/projects" className={styles.button}>
                    Каталог проектов
                </Link>
            </Container>
        </section>
    );
}

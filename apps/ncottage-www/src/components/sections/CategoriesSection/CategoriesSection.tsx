import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getCategories } from "@/lib/data";
import styles from "./CategoriesSection.module.css";

export function CategoriesSection() {
    const categories = getCategories();

    return (
        <section className={styles.section}>
            <Container>
                <h2 className={styles.title}>
                    Строительство домов в СПб и ЛО
                </h2>
                <div className={styles.grid}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/projects?tech=${cat.technology}`}
                            className={styles.card}
                        >
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className={styles.cardImage}
                            />
                            <span className={styles.badge}>
                                {cat.count} проектов
                            </span>
                            <div className={styles.cardBottom}>
                                <h3 className={styles.cardTitle}>
                                    {cat.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                    {/* CTA block */}
                    <div className={styles.ctaBlock}>
                        <h3 className={styles.ctaTitle}>
                            Не знаете, что выбрать?
                        </h3>
                        <p className={styles.ctaText}>
                            Оставьте заявку и наши специалисты свяжутся с
                            вами в самое ближайшее время!
                        </p>
                        <button className={styles.ctaBtn}>
                            Бесплатная консультация
                        </button>
                    </div>
                </div>
            </Container>
        </section>
    );
}

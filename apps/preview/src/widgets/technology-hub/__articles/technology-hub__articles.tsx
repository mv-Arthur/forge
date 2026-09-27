import Image from "next/image";
import type { TechnologyHubArticle } from "../technology-hub.types";
import styles from "../technology-hub.module.css";

export function TechnologyHubArticles({
    heading,
    items,
}: {
    heading: string;
    items: TechnologyHubArticle[];
}) {
    if (items.length === 0) return null;

    return (
        <section data-section="technology-articles" className={styles.block}>
            <h2 className={styles.blockTitle}>{heading}</h2>
            <div className={styles.articles}>
                {items.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        className={styles.article}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className={styles.articleMedia}>
                            <Image
                                src={item.image}
                                alt=""
                                fill
                                unoptimized={item.image.startsWith("/media/")}
                                sizes="(min-width: 768px) 30vw, 100vw"
                                className={styles.articleImage}
                                priority
                            />
                        </span>
                        <span className={styles.articleBody}>
                            <span className={styles.articleTitle}>
                                {item.title}
                            </span>
                            <span className={styles.articleHint}>
                                {item.hint}
                            </span>
                        </span>
                    </a>
                ))}
            </div>
        </section>
    );
}

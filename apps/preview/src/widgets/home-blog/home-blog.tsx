import Image from "next/image";
import { BLOG_EYEBROW, BLOG_HEADING } from "@/lib/copy";
import { BLOG_ITEMS } from "./lib/content";
import styles from "./home-blog.module.css";

export function HomeBlog() {
    return (
        <section data-section="blog" className={`section ${styles.root}`}>
            <div className={`container-page ${styles.inner}`}>
                <p className={styles.eyebrow}>{BLOG_EYEBROW}</p>
                <h2 className={styles.title}>{BLOG_HEADING}</h2>
                <div className={styles.list}>
                    {BLOG_ITEMS.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={styles.item}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span className={styles.thumb}>
                                <Image
                                    src={item.image}
                                    alt=""
                                    fill
                                    unoptimized
                                    sizes="124px"
                                    className={styles.thumbImg}
                                />
                            </span>
                            <span className={styles.itemTitle}>
                                {item.title}
                            </span>
                            <span className={styles.itemHint}>{item.hint}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

import Image from "next/image";
import type { ShowcaseDecorItem } from "@/types/catalog";
import styles from "./project-detail__decor.module.css";

export function ProjectDetailDecor({ items }: { items: ShowcaseDecorItem[] }) {
    if (items.length === 0) return null;
    return (
        <div className={styles.grid}>
            {items.map((item) => (
                <article key={item.id}>
                    <div className={styles.media}>
                        <Image
                            src={item.src}
                            alt=""
                            fill
                            unoptimized
                            className={styles.img}
                            sizes="(min-width:1024px) 30vw, 100vw"
                        />
                    </div>
                    <h3 className={styles.title}>{item.title}</h3>
                    <p className={styles.text}>{item.text}</p>
                </article>
            ))}
        </div>
    );
}

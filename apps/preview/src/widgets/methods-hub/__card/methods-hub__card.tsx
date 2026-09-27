import Image from "next/image";
import Link from "next/link";
import type { MethodsHubCard as Card } from "../methods-hub.types";
import styles from "./card.module.css";

export function MethodsHubCard({
    card,
    moreLabel,
    priority,
}: {
    card: Card;
    moreLabel: string;
    priority: boolean;
}) {
    return (
        <Link href={card.href} className={styles.card}>
            <span className={styles.media}>
                <Image
                    src={card.image}
                    alt=""
                    fill
                    priority={priority}
                    unoptimized={card.image.startsWith("/media/")}
                    sizes="(min-width: 992px) 30vw, (min-width: 640px) 50vw, 100vw"
                    className={styles.image}
                />
            </span>
            <span className={styles.shade} />
            <span className={styles.body}>
                <h2 className={styles.title}>{card.title}</h2>
                <span className={`btn btn-primary ${styles.cta}`}>
                    {moreLabel}
                </span>
            </span>
        </Link>
    );
}

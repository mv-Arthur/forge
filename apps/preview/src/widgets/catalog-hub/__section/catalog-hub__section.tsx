import Image from "next/image";
import Link from "next/link";
import type { CatalogHubTypeCard } from "../catalog-hub.types";
import styles from "../catalog-hub.module.css";

function Arrow() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M5 12h12.5M13.5 6.5L20 12l-6.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function CatalogHubSection({
    card,
    priority,
}: {
    card: CatalogHubTypeCard;
    priority: boolean;
}) {
    return (
        <Link href={card.href} className={styles.section}>
            <h3 className={styles.sectionName}>{card.title}</h3>
            <p className={styles.sectionDescription}>{card.description}</p>
            <span className={styles.sectionLink}>
                {card.ctaLabel}
                <Arrow />
            </span>
            <span className={styles.sectionImageWrap}>
                <Image
                    src={card.image}
                    alt=""
                    fill
                    unoptimized={card.image.startsWith("/media/")}
                    sizes="(min-width: 992px) 222px, 100vw"
                    className={styles.sectionImage}
                    priority={priority}
                />
            </span>
        </Link>
    );
}

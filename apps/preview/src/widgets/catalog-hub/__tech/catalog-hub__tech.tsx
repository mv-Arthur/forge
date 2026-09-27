import Image from "next/image";
import Link from "next/link";
import { projectsWord } from "@/lib/format";
import type { CatalogHubTechCard } from "../catalog-hub.types";
import styles from "../catalog-hub.module.css";

function SquareArrow() {
    return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
                d="M4 12 L12 4 M6.5 4 H12 V9.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function CatalogHubTech({
    card,
    priority,
}: {
    card: CatalogHubTechCard;
    priority: boolean;
}) {
    return (
        <Link href={card.href} className={styles.tech}>
            <span className={styles.techImageWrap}>
                <Image
                    src={card.image}
                    alt=""
                    fill
                    unoptimized={card.image.startsWith("/media/")}
                    sizes="(min-width: 992px) 25vw, 156px"
                    className={styles.techImage}
                    priority={priority}
                />
            </span>
            <span className={styles.techArrow}>
                <SquareArrow />
            </span>
            <h3 className={styles.techName}>{card.title}</h3>
            <p className={styles.techDescription}>{card.description}</p>
            <div className={styles.techCounter}>
                {card.thumbs.map((src) => (
                    <Image
                        key={src}
                        src={src}
                        alt=""
                        width={32}
                        height={32}
                        unoptimized={src.startsWith("/media/")}
                        className={styles.techThumb}
                    />
                ))}
                {card.count} {projectsWord(card.count)}
            </div>
        </Link>
    );
}

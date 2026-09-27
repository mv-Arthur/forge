import Image from "next/image";
import Link from "next/link";
import { CONSTRUCTION_LINES_HEADING } from "@/lib/copy";
import type { TechFamily } from "@/lib/techFamily";
import type { ConstructionLineCard } from "@/types/services";
import styles from "./lines.module.css";

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

export function ConstructionHubLines({
    family,
    lines,
}: {
    family: TechFamily;
    lines: ConstructionLineCard[];
}) {
    if (lines.length === 0) return null;

    return (
        <section data-section="construction-lines" className={styles.root}>
            <h2 className={styles.heading}>
                {CONSTRUCTION_LINES_HEADING[family]}
            </h2>
            <div className={styles.grid}>
                {lines.map((card) => (
                    <Link key={card.id} href={card.href} className={styles.card}>
                        <span className={styles.copy}>
                            <h3 className={styles.title}>{card.title}</h3>
                            <p className={styles.lead}>{card.lead}</p>
                            <span className={styles.link}>
                                Смотреть
                                <Arrow />
                            </span>
                        </span>
                        <span className={styles.imageWrap}>
                            <Image
                                src={card.image}
                                alt=""
                                fill
                                unoptimized={card.image.startsWith("/media/")}
                                sizes="(min-width: 992px) 200px, 40vw"
                                className={styles.image}
                            />
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

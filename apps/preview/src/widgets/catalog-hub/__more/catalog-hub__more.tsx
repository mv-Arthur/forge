import Image from "next/image";
import Link from "next/link";
import { projectsWord } from "@/lib/format";
import type { CatalogHubMore as CatalogHubMoreData } from "../catalog-hub.types";
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

export function CatalogHubMore({ more }: { more: CatalogHubMoreData }) {
    const item = more.items[0];
    if (!item) return null;

    if (more.items.length === 1) {
        return (
            <Link
                href={item.href}
                className={styles.more}
                data-section="catalog-techs-more"
            >
                <div className={styles.moreKicker}>{more.title}</div>
                <h3 className={styles.sectionName}>{item.title}</h3>
                <p className={styles.sectionDescription}>{item.description}</p>
                <span className={styles.sectionLink}>
                    {item.count} {projectsWord(item.count)}
                    <Arrow />
                </span>
                <span className={styles.sectionImageWrap}>
                    <Image
                        src={item.image}
                        alt=""
                        fill
                        unoptimized={item.image.startsWith("/media/")}
                        sizes="(min-width: 992px) 180px, 100vw"
                        className={styles.sectionImage}
                    />
                </span>
            </Link>
        );
    }

    return (
        <div className={styles.more} data-section="catalog-techs-more">
            <div className={styles.moreKicker}>{more.title}</div>
            <div className={styles.moreRow}>
                {more.items.map((row) => (
                    <Link
                        key={row.tech}
                        href={row.href}
                        className={styles.moreChip}
                    >
                        <span className={styles.moreChipImage}>
                            <Image
                                src={row.image}
                                alt=""
                                fill
                                unoptimized={row.image.startsWith("/media/")}
                                sizes="72px"
                                className={styles.sectionImage}
                            />
                        </span>
                        <span className={styles.moreChipBody}>
                            <span className={styles.moreChipName}>
                                {row.title}
                            </span>
                            <span className={styles.moreChipCount}>
                                {row.count} {projectsWord(row.count)}
                            </span>
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

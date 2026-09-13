import Image from "next/image";
import Link from "next/link";
import { HouseIcon } from "@/ui/icons";
import type { CatalogNavPayload } from "@/types/catalog";
import styles from "./site-header__projects-menu.module.css";

function CtaArrow() {
    return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
            <path
                d="M3 8h9.5M8.5 4.5L13 8l-4.5 3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function TileArrow() {
    return (
        <svg viewBox="0 0 16 16" width="15" height="15" fill="none" aria-hidden>
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

export function SiteHeaderProjectsMenu({
    nav,
    open,
}: {
    nav: CatalogNavPayload;
    open: boolean;
}) {
    return (
        <div
            className={styles.root}
            data-section="header-projects-menu"
            data-open={open || undefined}
        >
            <div className={styles.top}>
                <Link
                    href={nav.all.href}
                    className={styles.card}
                    data-variant="all"
                >
                    <span className={styles.copy}>
                        <span className={styles.title}>{nav.all.title}</span>
                        <span className={styles.cta}>
                            {nav.ctaLabel}
                            <CtaArrow />
                        </span>
                    </span>
                    <span className={styles.icon}>
                        <HouseIcon className="h-5 w-5" />
                    </span>
                </Link>
                {nav.types.map((card) => (
                    <Link
                        key={card.id}
                        href={card.href}
                        className={`${styles.card} ${styles.split}`}
                    >
                        <span className={styles.copy}>
                            <span className={styles.title}>{card.title}</span>
                            <span className={styles.cta}>
                                {nav.ctaLabel}
                                <CtaArrow />
                            </span>
                        </span>
                        {card.image ? (
                            <span className={styles.photo}>
                                <Image
                                    src={card.image}
                                    alt=""
                                    fill
                                    unoptimized={card.image.startsWith("/media/")}
                                    sizes="(min-width:900px) 22vw, 50vw"
                                />
                            </span>
                        ) : null}
                    </Link>
                ))}
            </div>
            {nav.tiles.length > 0 ? (
                <div className={styles.tiles}>
                    {nav.tiles.map((tile) => (
                        <Link
                            key={tile.id}
                            href={tile.href}
                            className={styles.tile}
                        >
                            <span className={styles.shot}>
                                <Image
                                    src={tile.image ?? ""}
                                    alt=""
                                    fill
                                    unoptimized={(tile.image ?? "").startsWith(
                                        "/media/",
                                    )}
                                    sizes="(min-width:900px) 24vw, 50vw"
                                />
                                <span className={styles.arrow}>
                                    <TileArrow />
                                </span>
                            </span>
                            <span className={styles.caption}>{tile.title}</span>
                        </Link>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

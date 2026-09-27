import Image from "next/image";
import Link from "next/link";
import type { HomeBuiltViewProps } from "./home-built.types";
import { Container } from "@/ui/container";
import styles from "./home-built.module.css";

function SquareArrow() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M6 19L19 6M19 6V18.5M19 6H6.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function SemiArrow({ back }: { back?: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden
            className={back ? styles.arrowBack : undefined}
        >
            <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.47 5.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06L18.19 12.75H4a.75.75 0 0 1 0-1.5h14.19l-4.72-4.72a.75.75 0 0 1 0-1.06Z"
            />
        </svg>
    );
}

export function HomeBuilt({
    heading,
    seeLabel,
    seeHref,
    stats,
    items,
    trackRef,
    onPrev,
    onNext,
    showPrev,
    showNext,
}: HomeBuiltViewProps) {
    if (items.length === 0) return null;

    return (
        <section data-section="built" className={styles.root}>
            <Container className={styles.grid}>
                <h2 className={styles.heading}>
                    {heading}
                    <Link
                        href={seeHref}
                        className={styles.headLink}
                        aria-label={seeLabel}
                    >
                        <SquareArrow />
                    </Link>
                </h2>
                {stats.length > 0 ? (
                    <div className={styles.stats}>
                        {stats.map((stat) => (
                            <div key={stat.hint} className={styles.stat}>
                                <div className={styles.statValue}>
                                    {stat.value}
                                </div>
                                <div className={styles.statHint}>
                                    {stat.hint}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
                <div className={styles.galleryWrap}>
                    {showPrev ? (
                        <button
                            type="button"
                            className={styles.prev}
                            onClick={onPrev}
                            aria-label="Прокрутить галерею назад"
                        >
                            <SemiArrow back />
                        </button>
                    ) : null}
                    {showNext ? (
                        <button
                            type="button"
                            className={styles.next}
                            onClick={onNext}
                            aria-label="Прокрутить галерею вперёд"
                        >
                            <SemiArrow />
                        </button>
                    ) : null}
                    <div className={styles.track} ref={trackRef}>
                        {items.map((item) => (
                            <Link
                                key={item.slug}
                                href={item.href}
                                className={styles.card}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.alt}
                                    fill
                                    unoptimized
                                    sizes="(min-width:992px) 400px, 50vw"
                                    className={styles.cardImg}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
                <div className={styles.moreWrap}>
                    <Link href={seeHref} className={styles.more}>
                        {seeLabel}
                        <SquareArrow />
                    </Link>
                </div>
            </Container>
        </section>
    );
}

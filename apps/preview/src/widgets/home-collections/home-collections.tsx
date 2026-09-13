import Image from "next/image";
import Link from "next/link";
import { projectsWord } from "@/lib/format";
import type { CollectionId } from "@/lib/collections";
import type { HomeCollectionsViewProps } from "./home-collections.types";
import styles from "./home-collections.module.css";

function Arrow({ back }: { back?: boolean }) {
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

export function HomeCollections({
    heading,
    lead,
    cta,
    items,
    active,
    onSelect,
    onPrev,
    onNext,
}: HomeCollectionsViewProps) {
    const current = items.find((item) => item.id === active) ?? items[0];
    if (!current) return null;

    return (
        <section
            data-section="collections"
            className={`section ${styles.root}`}
        >
            <div className={`container-page ${styles.inner}`}>
                <h2 className={styles.title}>{heading}</h2>
                <p className={styles.text}>{lead}</p>
                <div className={styles.block}>
                    <div className={styles.info}>
                        <div className={styles.imageWrap}>
                            <div className={styles.hero}>
                                <Image
                                    key={current.id}
                                    src={current.image}
                                    alt={current.imageAlt}
                                    fill
                                    unoptimized
                                    sizes="(min-width:769px) 50vw, 100vw"
                                    className={styles.image}
                                    priority={current.id === items[0]?.id}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.controller}>
                        <div className={styles.controllerCopy}>
                            <h3 className={styles.name}>{current.title}</h3>
                            <p className={styles.count}>
                                {current.count} {projectsWord(current.count)}
                            </p>
                            <Link
                                href={current.href}
                                className={`btn btn-primary ${styles.cta}`}
                            >
                                {cta}
                            </Link>
                        </div>
                        <div className={styles.arrows}>
                            <button
                                type="button"
                                className={styles.arrow}
                                onClick={onPrev}
                                aria-label="Предыдущая подборка"
                            >
                                <Arrow back />
                            </button>
                            <button
                                type="button"
                                className={styles.arrow}
                                onClick={onNext}
                                aria-label="Следующая подборка"
                            >
                                <Arrow />
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.cards}>
                    {items.map((item) => (
                        <CollectionCard
                            key={item.id}
                            item={item}
                            cta={cta}
                            selected={item.id === current.id}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function CollectionCard({
    item,
    cta,
    selected,
    onSelect,
}: {
    item: HomeCollectionsViewProps["items"][number];
    cta: string;
    selected: boolean;
    onSelect: (id: CollectionId) => void;
}) {
    return (
        <div
            role="button"
            tabIndex={0}
            className={`${styles.card} ${selected ? styles.cardActive : ""}`}
            onClick={() => onSelect(item.id)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(item.id);
                }
            }}
        >
            <span className={styles.cardMedia}>
                <Image
                    src={item.image}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width:769px) 20vw, 50vw"
                    className={styles.cardImage}
                />
            </span>
            <div className={styles.cardInfo}>
                <div className={styles.cardText}>
                    <h4 className={styles.cardName}>{item.title}</h4>
                    <p className={styles.cardCount}>
                        {item.count} {projectsWord(item.count)}
                    </p>
                </div>
                <Link
                    href={item.href}
                    className={styles.cardCta}
                    onClick={(event) => event.stopPropagation()}
                >
                    {cta}
                </Link>
            </div>
        </div>
    );
}

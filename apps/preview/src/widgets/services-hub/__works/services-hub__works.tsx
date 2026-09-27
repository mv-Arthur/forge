import Image from "next/image";
import Link from "next/link";
import type { ServicesHubWorksCard } from "../services-hub.types";
import styles from "../services-hub.module.css";

function Arrow() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M5 12h12.5M13.5 6.5 20 12l-6.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ServicesHubWorks({ cards }: { cards: ServicesHubWorksCard[] }) {
    if (cards.length === 0) return null;
    return (
        <section data-section="services-works" className={styles.works}>
            {cards.map((card) => (
                <Link
                    key={card.href}
                    href={card.href}
                    className={styles.worksCard}
                >
                    <span className={styles.worksMedia}>
                        <Image
                            src={card.image}
                            alt=""
                            fill
                            unoptimized
                            sizes="(min-width: 992px) 50vw, 100vw"
                            className={styles.worksImage}
                        />
                    </span>
                    <span className={styles.worksCopy}>
                        <span className={styles.worksTitle}>{card.title}</span>
                        <span className={styles.worksLead}>{card.lead}</span>
                        <span className={styles.worksCta}>
                            {card.ctaLabel}
                            <Arrow />
                        </span>
                    </span>
                </Link>
            ))}
        </section>
    );
}

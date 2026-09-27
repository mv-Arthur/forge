import Image from "next/image";
import Link from "next/link";
import { CONSTRUCTION_TECHS_HEADING } from "@/lib/copy";
import { projectsWord } from "@/lib/format";
import type { ConstructionTechCard } from "@/types/services";
import styles from "./techs.module.css";

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

export function ConstructionHubTechs({
    techs,
}: {
    techs: ConstructionTechCard[];
}) {
    if (techs.length === 0) return null;

    return (
        <section data-section="construction-techs" className={styles.root}>
            <h2 className={styles.heading}>{CONSTRUCTION_TECHS_HEADING}</h2>
            <div className={styles.grid}>
                {techs.map((card, i) => (
                    <Link
                        key={card.tech}
                        href={card.href}
                        className={styles.card}
                    >
                        <span className={styles.imageWrap}>
                            <Image
                                src={card.image}
                                alt=""
                                fill
                                unoptimized={card.image.startsWith("/media/")}
                                sizes="(min-width: 992px) 30vw, 100vw"
                                className={styles.image}
                                priority={i < 2}
                            />
                        </span>
                        <span className={styles.arrow}>
                            <SquareArrow />
                        </span>
                        <h3 className={styles.title}>{card.title}</h3>
                        <p className={styles.lead}>{card.description}</p>
                        <span className={styles.count}>
                            {card.count} {projectsWord(card.count)}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

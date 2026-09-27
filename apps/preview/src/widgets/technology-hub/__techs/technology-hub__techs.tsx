import Image from "next/image";
import Link from "next/link";
import { CTA_MORE } from "@/lib/copy";
import type { TechnologyHubTechCard } from "../technology-hub.types";
import pageStyles from "../technology-hub.module.css";
import styles from "./techs.module.css";

export function TechnologyHubTechs({
    heading,
    cards,
}: {
    heading: string;
    cards: TechnologyHubTechCard[];
}) {
    return (
        <section data-section="technology-techs" className={pageStyles.block}>
            <h2 className={pageStyles.blockTitle}>{heading}</h2>
            <div className={pageStyles.techs}>
                {cards.map((card, i) => (
                    <Link key={card.id} href={card.href} className={styles.card}>
                        <span className={styles.media}>
                            <Image
                                src={card.image}
                                alt=""
                                fill
                                unoptimized={card.image.startsWith("/media/")}
                                sizes="(min-width: 992px) 30vw, (min-width: 768px) 50vw, 100vw"
                                className={styles.image}
                                priority={i < 3}
                            />
                        </span>
                        <span className={styles.shade} />
                        <span className={styles.body}>
                            <span className={styles.title}>{card.title}</span>
                            <span className={`btn btn-primary ${styles.cta}`}>
                                {CTA_MORE}
                            </span>
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

import Image from "next/image";
import Link from "next/link";
import type { WorksStagesHubCard } from "../works-stages-hub.types";
import styles from "../works-stages-hub.module.css";

export function WorksStagesHubCardView({
    card,
    priority,
}: {
    card: WorksStagesHubCard;
    priority: boolean;
}) {
    return (
        <article className={styles.card} data-tech={card.id}>
            <div className={styles.copy}>
                <h2 className={styles.cardTitle}>{card.title}</h2>
                <p className={styles.cardLead}>{card.lead}</p>
                <Link href={card.href} className={styles.cta}>
                    {card.ctaLabel}
                </Link>
            </div>
            <div className={styles.photo}>
                <Image
                    src={card.image}
                    alt=""
                    fill
                    unoptimized={card.image.startsWith("/media/")}
                    sizes="(min-width: 900px) 32vw, 100vw"
                    className={styles.photoImg}
                    priority={priority}
                />
            </div>
        </article>
    );
}

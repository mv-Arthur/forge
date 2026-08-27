import Image from "next/image";
import Link from "next/link";
import type { HeroPromoCard } from "../hero.types";
import { HeroArrow } from "../__arrow/hero__arrow";
import styles from "./hero__card.module.css";

export function HeroCard({
    card,
    active,
}: {
    card: HeroPromoCard;
    active: boolean;
}) {
    return (
        <Link
            href={card.href}
            draggable={false}
            className={styles.card}
            data-active={active || undefined}
            aria-hidden={active ? undefined : true}
            tabIndex={active ? undefined : -1}
        >
            <div className={styles.photo}>
                <Image
                    src={card.image}
                    alt=""
                    fill
                    draggable={false}
                    sizes="(min-width: 1601px) 165px, 115px"
                />
            </div>
            <div className={styles.body}>
                <div>
                    <div className={styles.title}>{card.title}</div>
                    {card.subtitle ? (
                        <p className={styles.sub}>{card.subtitle}</p>
                    ) : null}
                </div>
                <span className={styles.cta}>
                    {card.cta}
                    <HeroArrow />
                </span>
            </div>
        </Link>
    );
}

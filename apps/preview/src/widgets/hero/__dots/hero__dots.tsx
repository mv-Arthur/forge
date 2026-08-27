import type { HeroPromoCard } from "../hero.types";
import styles from "./hero__dots.module.css";

export function HeroDots({
    cards,
    index,
    onSelect,
}: {
    cards: HeroPromoCard[];
    index: number;
    onSelect: (i: number) => void;
}) {
    if (cards.length < 2) return null;
    return (
        <div className={styles.root}>
            {cards.map((c, idx) => (
                <button
                    key={c.href + idx}
                    type="button"
                    data-hero-dot
                    className={styles.dot}
                    onClick={() => onSelect(idx)}
                    aria-label={`Карточка ${idx + 1}`}
                    aria-current={idx === index || undefined}
                />
            ))}
        </div>
    );
}

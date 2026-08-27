import type {
    HeroPromoBind,
    HeroPromoCard,
    HeroSliderBind,
} from "../hero.types";
import { HeroCard } from "../__card/hero__card";
import { HeroDots } from "../__dots/hero__dots";
import styles from "./hero__promo.module.css";

export function HeroPromo({
    cards,
    index,
    onSelect,
    promo,
    slider,
}: {
    cards: HeroPromoCard[];
    index: number;
    onSelect: (i: number) => void;
    promo: HeroPromoBind;
    slider: HeroSliderBind;
}) {
    if (cards.length === 0) return null;
    return (
        <div
            className={styles.root}
            aria-label="Проекты в баннере"
            {...promo}
        >
            <div className={styles.slider} {...slider}>
                {cards.map((c, idx) => (
                    <HeroCard
                        key={c.href + idx}
                        card={c}
                        active={idx === index}
                    />
                ))}
            </div>
            <HeroDots cards={cards} index={index} onSelect={onSelect} />
        </div>
    );
}

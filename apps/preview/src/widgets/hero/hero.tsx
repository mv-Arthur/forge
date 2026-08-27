import type { HeroViewProps } from "./hero.types";
import { HeroAttributes } from "./__attributes/hero__attributes";
import { HeroBackground } from "./__background/hero__background";
import { HeroMoreLink } from "./__more-link/hero__more-link";
import { HeroPromo } from "./__promo/hero__promo";
import { HeroText } from "./__text/hero__text";
import styles from "./hero.module.css";

export function Hero({
    heading,
    lead,
    cards,
    attributes,
    index,
    onSelect,
    promo,
    slider,
}: HeroViewProps) {
    return (
        <div className={styles.banner}>
            <div className={styles.main} data-hero-slider>
                <HeroBackground />
                <div className={styles.info}>
                    <HeroText heading={heading} lead={lead} />
                    <HeroMoreLink variant="mobile" />
                    <HeroPromo
                        cards={cards}
                        index={index}
                        onSelect={onSelect}
                        promo={promo}
                        slider={slider}
                    />
                </div>
                <HeroMoreLink variant="desktop" />
            </div>
            <HeroAttributes items={attributes} />
        </div>
    );
}

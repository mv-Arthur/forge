import Image from "next/image";
import { PAINT_CTA, PAINT_LEAD, PAINT_TITLE } from "@/lib/copy";
import { CtaArrow } from "../cta-arrow";
import { HERO_CHIPS, HERO_IMAGE } from "../lib/content";
import styles from "./hero.module.css";

export function FinishingPaintHero() {
    return (
        <section data-section="paint-hero" className={styles.root}>
            <div className={styles.stage}>
                <Image
                    src={HERO_IMAGE}
                    alt=""
                    fill
                    priority
                    unoptimized
                    sizes="(min-width:1280px) 1280px, 100vw"
                    className={styles.image}
                />
                <span className={styles.shade} />
                <div className={styles.copy}>
                    <h1 className={styles.title}>{PAINT_TITLE}</h1>
                    <p className={styles.lead}>{PAINT_LEAD}</p>
                    <a href="#lead" className={styles.cta}>
                        {PAINT_CTA}
                        <span className={styles.ctaIcon}>
                            <CtaArrow />
                        </span>
                    </a>
                </div>
                <ul className={styles.chips}>
                    {HERO_CHIPS.map((chip) => (
                        <li key={chip.id} className={styles.chip}>
                            {chip.label}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

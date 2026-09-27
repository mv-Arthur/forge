import Image from "next/image";
import { EXTERIOR_CTA, EXTERIOR_LEAD, EXTERIOR_TITLE } from "@/lib/copy";
import { CtaArrow } from "../cta-arrow";
import { HERO_CHIPS, HERO_IMAGE } from "../lib/content";
import styles from "./hero.module.css";

export function FinishingExteriorHero() {
    return (
        <section data-section="exterior-hero" className={styles.root}>
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
                    <h1 className={styles.title}>{EXTERIOR_TITLE}</h1>
                    <p className={styles.lead}>{EXTERIOR_LEAD}</p>
                    <a href="#lead" className={styles.cta}>
                        {EXTERIOR_CTA}
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

import Image from "next/image";
import {
    ENGINEERING_CTA,
    ENGINEERING_EXTERNAL_LEAD,
    ENGINEERING_EXTERNAL_TITLE,
} from "@/lib/copy";
import { CtaArrow } from "../cta-arrow";
import { HERO_CHIPS, HERO_IMAGE } from "../lib/content";
import styles from "./hero.module.css";

export function EngineeringExternalHero() {
    return (
        <section data-section="engineering-external-hero" className={styles.root}>
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
                    <h1 className={styles.title}>{ENGINEERING_EXTERNAL_TITLE}</h1>
                    <p className={styles.lead}>{ENGINEERING_EXTERNAL_LEAD}</p>
                    <a href="#lead" className={styles.cta}>
                        {ENGINEERING_CTA}
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

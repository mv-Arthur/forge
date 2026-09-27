import Image from "next/image";
import {
    TECH_SUPERVISION_CTA,
    TECH_SUPERVISION_LEAD,
    TECH_SUPERVISION_TITLE,
} from "@/lib/copy";
import { CtaArrow } from "../cta-arrow";
import { HERO_CHIPS, HERO_IMAGE } from "../lib/content";
import styles from "./hero.module.css";

export function TechSupervisionHero() {
    return (
        <section data-section="tech-supervision-hero" className={styles.root}>
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
                    <h1 className={styles.title}>{TECH_SUPERVISION_TITLE}</h1>
                    <p className={styles.lead}>{TECH_SUPERVISION_LEAD}</p>
                    <a href="#lead" className={styles.cta}>
                        {TECH_SUPERVISION_CTA}
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

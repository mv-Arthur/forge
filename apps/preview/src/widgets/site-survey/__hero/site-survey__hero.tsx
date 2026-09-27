import Image from "next/image";
import { SITE_SURVEY_CTA, SITE_SURVEY_LEAD, SITE_SURVEY_TITLE } from "@/lib/copy";
import { CtaArrow } from "../cta-arrow";
import { HERO_CHIPS, HERO_IMAGE } from "../lib/content";
import styles from "./hero.module.css";

export function SiteSurveyHero() {
    return (
        <section data-section="site-survey-hero" className={styles.root}>
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
                    <h1 className={styles.title}>{SITE_SURVEY_TITLE}</h1>
                    <p className={styles.lead}>{SITE_SURVEY_LEAD}</p>
                    <a href="#lead" className={styles.cta}>
                        {SITE_SURVEY_CTA}
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

import {
    SITE_SURVEY_OFFER_CTA,
    SITE_SURVEY_OFFER_LEAD,
    SITE_SURVEY_OFFER_TITLE,
} from "@/lib/copy";
import { CtaArrow } from "../cta-arrow";
import styles from "./offer.module.css";

export function SiteSurveyOffer() {
    return (
        <section data-section="site-survey-offer" className={styles.root}>
            <div className={styles.copy}>
                <h2 className={styles.title}>{SITE_SURVEY_OFFER_TITLE}</h2>
                <p className={styles.lead}>{SITE_SURVEY_OFFER_LEAD}</p>
            </div>
            <a href="#lead" className={styles.cta}>
                {SITE_SURVEY_OFFER_CTA}
                <span className={styles.ctaIcon}>
                    <CtaArrow />
                </span>
            </a>
        </section>
    );
}

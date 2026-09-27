import Image from "next/image";
import {
    SITE_SURVEY_WHO_HEADING,
    SITE_SURVEY_WHO_STAT_WARRANTY,
    SITE_SURVEY_WHO_STAT_YEARS,
    SITE_SURVEY_WHO_TEXT,
} from "@/lib/copy";
import { settings } from "@/lib/settings";
import { WHO_IMAGE } from "../lib/content";
import styles from "./who.module.css";

export function SiteSurveyWho() {
    const years = new Date().getFullYear() - settings.foundedYear;
    const stats = [
        { value: String(years), hint: SITE_SURVEY_WHO_STAT_YEARS },
        {
            value: String(settings.warrantyYears),
            hint: SITE_SURVEY_WHO_STAT_WARRANTY,
        },
    ];

    return (
        <section data-section="site-survey-who" className={styles.root}>
            <div className={styles.copy}>
                <h2 className={styles.heading}>{SITE_SURVEY_WHO_HEADING}</h2>
                <p className={styles.text}>{SITE_SURVEY_WHO_TEXT}</p>
                <div className={styles.stats}>
                    {stats.map((stat) => (
                        <div key={stat.hint} className={styles.stat}>
                            <div className={styles.value}>{stat.value}</div>
                            <div className={styles.hint}>{stat.hint}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.photo}>
                <Image
                    src={WHO_IMAGE}
                    alt=""
                    fill
                    unoptimized
                    sizes="(min-width:992px) 48vw, 100vw"
                    className={styles.image}
                />
            </div>
        </section>
    );
}

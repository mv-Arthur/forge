import Image from "next/image";
import Link from "next/link";
import {
    SERVICES_OFFICE_CTA,
    SERVICES_OFFICE_TITLE,
    SERVICES_SITE_CTA,
    SERVICES_SITE_LEAD,
    SERVICES_SITE_TITLE,
    SERVICES_VISIT_CTA,
    SERVICES_VISIT_EYEBROW,
    SERVICES_VISIT_LEAD,
    SERVICES_VISIT_TITLE,
} from "@/lib/copy";
import styles from "./home-services.module.css";

const KISKELOVO_HREF =
    "/works/dvuhetazhnyi-dom-iz-gazobetonnyh-blokov-v-derevne-kiskelovo";

function Arrow() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden>
            <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.47 5.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06L18.19 12.75H4a.75.75 0 0 1 0-1.5h14.19l-4.72-4.72a.75.75 0 0 1 0-1.06Z"
            />
        </svg>
    );
}

function SiteIcon() {
    return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
            <path
                d="M4 26.5h24M7 26.5V14.5L16 8l9 6.5V26.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 26.5v-7h8v7M16 11.5v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function OfficeIcon() {
    return (
        <svg viewBox="0 0 32 32" fill="none" aria-hidden>
            <path
                d="M6 26V8.5A1.5 1.5 0 0 1 7.5 7h17A1.5 1.5 0 0 1 26 8.5V26"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M4 26h24M12 12h2M18 12h2M12 17h2M18 17h2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function HomeServices({
    officeHoursLabel,
}: {
    officeHoursLabel: string;
}) {
    return (
        <section data-section="services" className={`section ${styles.root}`}>
            <div className={`container-page ${styles.grid}`}>
                <Link href="/#lead" className={styles.photo}>
                    <Image
                        src="/media/services/visit-house.jpg"
                        unoptimized
                        alt=""
                        fill
                        sizes="(min-width:992px) 50vw, 100vw"
                        className={styles.photoImg}
                    />
                    <span className={styles.photoShade} />
                    <span className={styles.photoCopy}>
                        <span className={styles.hint}>
                            {SERVICES_VISIT_EYEBROW}
                        </span>
                        <span className={styles.photoTitle}>
                            {SERVICES_VISIT_TITLE}
                        </span>
                        <span className={styles.photoLead}>
                            {SERVICES_VISIT_LEAD}
                        </span>
                        <span className={styles.photoCta}>
                            {SERVICES_VISIT_CTA}
                        </span>
                    </span>
                </Link>
                <Link href={KISKELOVO_HREF} className={styles.card}>
                    <span className={styles.iconWrap}>
                        <SiteIcon />
                    </span>
                    <h3 className={styles.cardTitle}>{SERVICES_SITE_TITLE}</h3>
                    <p className={styles.cardLead}>{SERVICES_SITE_LEAD}</p>
                    <span className={styles.cardCta}>
                        {SERVICES_SITE_CTA}
                        <Arrow />
                    </span>
                </Link>
                <Link href="/#lead" className={styles.card}>
                    <span className={styles.iconWrap}>
                        <OfficeIcon />
                    </span>
                    <h3 className={styles.cardTitle}>
                        {SERVICES_OFFICE_TITLE}
                    </h3>
                    <p className={styles.cardLead}>
                        {officeHoursLabel}. Разберём смету, сроки и чертёж, если
                        он уже есть.
                    </p>
                    <span className={styles.cardCta}>
                        {SERVICES_OFFICE_CTA}
                        <Arrow />
                    </span>
                </Link>
            </div>
        </section>
    );
}

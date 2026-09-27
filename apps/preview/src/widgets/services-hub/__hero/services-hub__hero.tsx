import Image from "next/image";
import Link from "next/link";
import type { ServicesHubPayload } from "../services-hub.types";
import styles from "../services-hub.module.css";

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

export function ServicesHubHero({
    eyebrow,
    heading,
    lead,
    chooseLabel,
    chooseHref,
    meetLabel,
    meetHref,
    heroImage,
}: Pick<
    ServicesHubPayload,
    | "eyebrow"
    | "heading"
    | "lead"
    | "chooseLabel"
    | "chooseHref"
    | "meetLabel"
    | "meetHref"
    | "heroImage"
>) {
    return (
        <section data-section="services-hero" className={styles.hero}>
            <div className={styles.heroCopy}>
                <p className={styles.heroEyebrow}>{eyebrow}</p>
                <h1 className={styles.heroHeading}>{heading}</h1>
                <p className={styles.heroLead}>{lead}</p>
                <div className={styles.heroActions}>
                    <Link href={chooseHref} className={styles.heroPrimary}>
                        {chooseLabel}
                    </Link>
                    <Link href={meetHref} className={styles.heroGhost}>
                        {meetLabel}
                        <Arrow />
                    </Link>
                </div>
            </div>
            <div className={styles.heroPhoto}>
                <Image
                    src={heroImage}
                    alt=""
                    fill
                    unoptimized
                    priority
                    sizes="(min-width: 992px) 50vw, 100vw"
                    className={styles.heroImage}
                />
            </div>
        </section>
    );
}

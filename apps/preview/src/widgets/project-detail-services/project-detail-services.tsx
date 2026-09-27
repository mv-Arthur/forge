import Image from "next/image";
import {
    DETAIL_SERVICES_ARCHITECT_LEAD,
    DETAIL_SERVICES_ARCHITECT_TITLE,
    DETAIL_SERVICES_SITE_LEAD,
    DETAIL_SERVICES_SITE_TITLE,
    DETAIL_SERVICES_VISIT_CTA,
    DETAIL_SERVICES_VISIT_EYEBROW,
    DETAIL_SERVICES_VISIT_LEAD,
    DETAIL_SERVICES_VISIT_TITLE,
} from "@/lib/copy";
import type { ProjectDetailServicesProps } from "./project-detail-services.types";
import styles from "./project-detail-services.module.css";

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

export function ProjectDetailServices({ onOpen }: ProjectDetailServicesProps) {
    return (
        <div className={styles.grid}>
            <button
                type="button"
                className={styles.photo}
                onClick={() => onOpen("visit")}
            >
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
                        {DETAIL_SERVICES_VISIT_EYEBROW}
                    </span>
                    <span className={styles.photoTitle}>
                        {DETAIL_SERVICES_VISIT_TITLE}
                    </span>
                    <span className={styles.photoLead}>
                        {DETAIL_SERVICES_VISIT_LEAD}
                    </span>
                    <span className={styles.photoCta}>
                        {DETAIL_SERVICES_VISIT_CTA}
                    </span>
                </span>
            </button>
            <button
                type="button"
                className={styles.card}
                onClick={() => onOpen("site")}
            >
                <span className={styles.circle} aria-hidden>
                    <Arrow />
                </span>
                <span className={styles.cardTitle}>
                    {DETAIL_SERVICES_SITE_TITLE}
                </span>
                <span className={styles.cardLead}>
                    {DETAIL_SERVICES_SITE_LEAD}
                </span>
                <span className={styles.cutout}>
                    <Image
                        src="/media/services/site-cutout.png"
                        unoptimized
                        alt=""
                        fill
                        sizes="(min-width:992px) 25vw, 100vw"
                        className={styles.cutoutImg}
                    />
                </span>
            </button>
            <button
                type="button"
                className={styles.card}
                onClick={() => onOpen("architect")}
            >
                <span className={styles.circle} aria-hidden>
                    <Arrow />
                </span>
                <span className={styles.cardTitle}>
                    {DETAIL_SERVICES_ARCHITECT_TITLE}
                </span>
                <span className={styles.cardLead}>
                    {DETAIL_SERVICES_ARCHITECT_LEAD}
                </span>
                <span className={styles.cutout}>
                    <Image
                        src="/media/services/architect-cutout.png"
                        unoptimized
                        alt=""
                        fill
                        sizes="(min-width:992px) 25vw, 100vw"
                        className={styles.cutoutImg}
                    />
                </span>
            </button>
        </div>
    );
}

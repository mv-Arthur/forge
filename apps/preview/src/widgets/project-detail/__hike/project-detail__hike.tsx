import {
    DETAIL_HIKE_CTA,
    DETAIL_HIKE_LEAD,
    DETAIL_HIKE_RISE,
    DETAIL_HIKE_TITLE,
} from "@/lib/copy";
import type { ShowcasePriceHike } from "@/types/catalog";
import { PercentIcon } from "@/ui/icons";
import styles from "./project-detail__hike.module.css";

const SEAL_POINTS = Array.from({ length: 24 }, (_, i) => {
    const radius = i % 2 === 0 ? 23 : 19.1;
    const angle = (Math.PI * i) / 12 - Math.PI / 2;
    return `${(24 + radius * Math.cos(angle)).toFixed(2)},${(24 + radius * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

function parseDay(iso: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }
    return date;
}

function formatDayMonth(date: Date): string {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
    }).format(date);
}

export function ProjectDetailHike({
    priceHike,
}: {
    priceHike: ShowcasePriceHike | null;
}) {
    if (!priceHike) return null;
    const from = parseDay(priceHike.from);
    if (!from) return null;
    const today = new Date();
    const startToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );
    if (startToday >= from) return null;

    return (
        <section data-section="detail-hike" className={styles.section}>
            <div className="container-page pb-6 md:pb-8">
                <div className={styles.banner}>
                    <span className={styles.icon} aria-hidden>
                        <svg
                            className={styles.seal}
                            viewBox="0 0 48 48"
                        >
                            <polygon points={SEAL_POINTS} />
                        </svg>
                        <PercentIcon />
                    </span>
                    <div className={styles.copy}>
                        <p className={styles.title}>
                            {DETAIL_HIKE_TITLE}
                            <span>
                                {DETAIL_HIKE_RISE} {formatDayMonth(from)}
                            </span>
                        </p>
                        <p className={styles.lead}>{DETAIL_HIKE_LEAD}</p>
                    </div>
                    <a href="#detail-lead" className={styles.cta}>
                        {DETAIL_HIKE_CTA}
                    </a>
                </div>
            </div>
        </section>
    );
}

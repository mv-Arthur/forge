import type { ReactNode } from "react";
import Link from "next/link";
import {
    CONSTRUCTION_SERIAL_HEADING,
    CONSTRUCTION_SERIAL_LEAD,
    POPULAR_ALL,
} from "@/lib/copy";
import type { TechFamily } from "@/lib/techFamily";
import styles from "./serial.module.css";

function AllArrow() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
                d="M5 12h12.5M13.5 6.5L20 12l-6.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ConstructionHubSerial({
    family,
    allHref,
    carousel,
}: {
    family: TechFamily;
    allHref: string;
    carousel: ReactNode;
}) {
    if (!carousel) return null;

    return (
        <section data-section="construction-serial" className={styles.root}>
            <div className={styles.head}>
                <div className={styles.copy}>
                    <h2 className={styles.title}>
                        {CONSTRUCTION_SERIAL_HEADING[family]}
                    </h2>
                    <p className={styles.lead}>{CONSTRUCTION_SERIAL_LEAD}</p>
                </div>
                <Link href={allHref} className={styles.all}>
                    {POPULAR_ALL}
                    <AllArrow />
                </Link>
            </div>
            <div className={styles.carousel}>{carousel}</div>
        </section>
    );
}

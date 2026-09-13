import type { ReactNode } from "react";
import {
    DETAIL_START_HEADING,
    DETAIL_START_QUOTE_LEAD,
    DETAIL_START_QUOTE_TITLE,
    DETAIL_START_VISIT_LEAD,
    DETAIL_START_VISIT_TITLE,
} from "@/lib/copy";
import styles from "./project-detail__start.module.css";

export function ProjectDetailStart({
    visit,
    quote,
}: {
    visit: ReactNode;
    quote: ReactNode;
}) {
    return (
        <div className={styles.grid}>
            <article className={styles.card}>
                <div className="eyebrow">{DETAIL_START_HEADING}</div>
                <h3 className={styles.title}>{DETAIL_START_VISIT_TITLE}</h3>
                <p className={styles.text}>{DETAIL_START_VISIT_LEAD}</p>
                <div className={styles.action}>{visit}</div>
            </article>
            <article className={styles.card}>
                <div className="eyebrow">{DETAIL_START_HEADING}</div>
                <h3 className={styles.title}>{DETAIL_START_QUOTE_TITLE}</h3>
                <p className={styles.text}>{DETAIL_START_QUOTE_LEAD}</p>
                <div className={styles.action}>{quote}</div>
            </article>
        </div>
    );
}

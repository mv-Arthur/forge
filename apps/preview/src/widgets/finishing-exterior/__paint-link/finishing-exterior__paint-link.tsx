import Link from "next/link";
import {
    EXTERIOR_PAINT_CTA,
    EXTERIOR_PAINT_LEAD,
    EXTERIOR_PAINT_TITLE,
} from "@/lib/copy";
import { routes } from "@/lib/routes";
import { CtaArrow } from "../cta-arrow";
import styles from "./paint-link.module.css";

export function FinishingExteriorPaintLink() {
    return (
        <section data-section="exterior-paint-link" className={styles.root}>
            <div className={styles.copy}>
                <h2 className={styles.title}>{EXTERIOR_PAINT_TITLE}</h2>
                <p className={styles.lead}>{EXTERIOR_PAINT_LEAD}</p>
            </div>
            <Link href={routes.service("finishing/paint")} className={styles.cta}>
                {EXTERIOR_PAINT_CTA}
                <span className={styles.ctaIcon}>
                    <CtaArrow />
                </span>
            </Link>
        </section>
    );
}

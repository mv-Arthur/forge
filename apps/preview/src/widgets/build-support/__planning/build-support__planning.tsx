import Image from "next/image";
import Link from "next/link";
import {
    BUILD_SUPPORT_PLANNING_CTA,
    BUILD_SUPPORT_PLANNING_LEAD,
    BUILD_SUPPORT_PLANNING_TITLE,
} from "@/lib/copy";
import { routes } from "@/lib/routes";
import { CtaArrow } from "../cta-arrow";
import { PLANNING_IMAGE } from "../lib/content";
import styles from "./planning.module.css";

export function BuildSupportPlanning() {
    return (
        <section data-section="build-support-planning" className={styles.root}>
            <div className={styles.copy}>
                <h2 className={styles.heading}>
                    {BUILD_SUPPORT_PLANNING_TITLE}
                </h2>
                <p className={styles.lead}>{BUILD_SUPPORT_PLANNING_LEAD}</p>
                <Link
                    href={routes.service("individual-planning")}
                    className={styles.cta}
                >
                    {BUILD_SUPPORT_PLANNING_CTA}
                    <span className={styles.ctaIcon}>
                        <CtaArrow />
                    </span>
                </Link>
            </div>
            <div className={styles.photo}>
                <Image
                    src={PLANNING_IMAGE}
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

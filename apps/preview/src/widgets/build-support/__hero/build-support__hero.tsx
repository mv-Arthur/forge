import Image from "next/image";
import {
    BUILD_SUPPORT_CTA,
    BUILD_SUPPORT_LEAD,
    BUILD_SUPPORT_TITLE,
} from "@/lib/copy";
import { HERO_IMAGE } from "../lib/content";
import styles from "./hero.module.css";

export function BuildSupportHero() {
    return (
        <section data-section="build-support-hero" className={styles.root}>
            <div className={styles.copy}>
                <h1 className={styles.title}>{BUILD_SUPPORT_TITLE}</h1>
                <p className={styles.lead}>{BUILD_SUPPORT_LEAD}</p>
                <a href="#lead" className={`btn btn-primary ${styles.cta}`}>
                    {BUILD_SUPPORT_CTA}
                </a>
            </div>
            <div className={styles.visual}>
                <Image
                    src={HERO_IMAGE}
                    alt=""
                    fill
                    priority
                    unoptimized
                    sizes="(min-width: 992px) 42vw, 100vw"
                    className={styles.image}
                />
            </div>
        </section>
    );
}

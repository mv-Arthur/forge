import Image from "next/image";
import {
    BUILD_SUPPORT_CABINET_CTA,
    BUILD_SUPPORT_CABINET_HEADING,
    BUILD_SUPPORT_CABINET_LEAD,
    BUILD_SUPPORT_CABINET_TEXT,
} from "@/lib/copy";
import { CABINET_IMAGE } from "../lib/content";
import styles from "./cabinet.module.css";

export function BuildSupportCabinet() {
    return (
        <section data-section="build-support-cabinet" className={styles.root}>
            <div className={styles.copy}>
                <h2 className={styles.heading}>
                    {BUILD_SUPPORT_CABINET_HEADING}
                </h2>
                <p className={styles.lead}>{BUILD_SUPPORT_CABINET_LEAD}</p>
                <p className={styles.text}>{BUILD_SUPPORT_CABINET_TEXT}</p>
                <a href="#lead" className={`btn btn-primary ${styles.cta}`}>
                    {BUILD_SUPPORT_CABINET_CTA}
                </a>
            </div>
            <div className={styles.photo}>
                <Image
                    src={CABINET_IMAGE}
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

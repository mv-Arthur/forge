import Image from "next/image";
import {
    BUILD_SUPPORT_AFTERCARE_HEADING,
    BUILD_SUPPORT_AFTERCARE_TEXT,
} from "@/lib/copy";
import { AFTERCARE_IMAGE } from "../lib/content";
import styles from "./aftercare.module.css";

export function BuildSupportAftercare() {
    return (
        <section data-section="build-support-aftercare" className={styles.root}>
            <div className={styles.copy}>
                <h2 className={styles.heading}>
                    {BUILD_SUPPORT_AFTERCARE_HEADING}
                </h2>
                <p className={styles.text}>{BUILD_SUPPORT_AFTERCARE_TEXT}</p>
            </div>
            <div className={styles.photo}>
                <Image
                    src={AFTERCARE_IMAGE}
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

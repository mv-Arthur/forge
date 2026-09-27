import Image from "next/image";
import {
    BUILD_SUPPORT_MANAGER_HEADING,
    BUILD_SUPPORT_MANAGER_NOTE,
    BUILD_SUPPORT_MANAGER_TEXT,
} from "@/lib/copy";
import { MANAGER_IMAGE } from "../lib/content";
import styles from "./manager.module.css";

export function BuildSupportManager() {
    return (
        <section data-section="build-support-manager" className={styles.root}>
            <div className={styles.copy}>
                <h2 className={styles.heading}>
                    {BUILD_SUPPORT_MANAGER_HEADING}
                </h2>
                <p className={styles.text}>{BUILD_SUPPORT_MANAGER_TEXT}</p>
                <p className={styles.note}>{BUILD_SUPPORT_MANAGER_NOTE}</p>
            </div>
            <div className={styles.photo}>
                <Image
                    src={MANAGER_IMAGE}
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

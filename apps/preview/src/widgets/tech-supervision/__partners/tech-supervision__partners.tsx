import Image from "next/image";
import {
    TECH_SUPERVISION_PARTNERS_HEADING,
    TECH_SUPERVISION_PARTNERS_TEXT,
} from "@/lib/copy";
import { PARTNERS_IMAGE } from "../lib/content";
import styles from "./partners.module.css";

export function TechSupervisionPartners() {
    return (
        <section
            data-section="tech-supervision-partners"
            className={styles.root}
        >
            <div className={styles.copy}>
                <h2 className={styles.heading}>
                    {TECH_SUPERVISION_PARTNERS_HEADING}
                </h2>
                <p className={styles.text}>{TECH_SUPERVISION_PARTNERS_TEXT}</p>
            </div>
            <div className={styles.photo}>
                <Image
                    src={PARTNERS_IMAGE}
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

import type { ReactNode } from "react";
import Image from "next/image";
import type { WorksStagesHubVisit } from "../works-stages-hub.types";
import styles from "../works-stages-hub.module.css";

export function WorksStagesHubVisit({
    visit,
    cta,
}: {
    visit: WorksStagesHubVisit;
    cta: ReactNode;
}) {
    return (
        <section className={styles.visit} data-section="works-stages-visit">
            <Image
                src={visit.image}
                alt=""
                fill
                unoptimized={visit.image.startsWith("/media/")}
                sizes="(min-width: 1280px) 1280px, 100vw"
                className={styles.visitImage}
            />
            <div className={styles.visitShade} />
            <div className={styles.visitCopy}>
                <h2 className={styles.visitTitle}>{visit.heading}</h2>
                <p className={styles.visitLead}>{visit.lead}</p>
                <div className={styles.visitCta}>{cta}</div>
            </div>
        </section>
    );
}

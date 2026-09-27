import Image from "next/image";
import Link from "next/link";
import type { ConstructionHubPayload } from "../construction-hub.types";
import styles from "./hero.module.css";

export function ConstructionHubHero({
    payload,
}: {
    payload: ConstructionHubPayload;
}) {
    return (
        <section data-section="construction-hero" className={styles.root}>
            <div className={styles.copy}>
                <h1 className={styles.title}>{payload.title}</h1>
                <p className={styles.lead}>{payload.lead}</p>
                <Link
                    href={payload.catalogHref}
                    className={`btn btn-primary ${styles.cta}`}
                >
                    {payload.ctaLabel}
                </Link>
            </div>
            <div className={styles.visual}>
                <Image
                    src={payload.heroImage}
                    alt=""
                    fill
                    priority
                    unoptimized={payload.heroImage.startsWith("/media/")}
                    sizes="(min-width: 992px) 42vw, 100vw"
                    className={styles.image}
                />
            </div>
        </section>
    );
}

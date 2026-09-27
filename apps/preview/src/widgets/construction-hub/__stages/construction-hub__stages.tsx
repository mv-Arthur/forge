import Image from "next/image";
import Link from "next/link";
import {
    CONSTRUCTION_STAGES_CTA,
    CONSTRUCTION_STAGES_HEADING,
    CONSTRUCTION_STAGES_LEAD,
} from "@/lib/copy";
import type { TechFamily } from "@/lib/techFamily";
import { CONSTRUCTION_STAGES } from "../lib/content";
import styles from "./stages.module.css";

export function ConstructionHubStages({
    family,
    href,
}: {
    family: TechFamily;
    href: string;
}) {
    return (
        <section data-section="construction-stages" className={styles.root}>
            <div className={styles.head}>
                <h2 className={styles.title}>
                    {CONSTRUCTION_STAGES_HEADING[family]}
                </h2>
                <p className={styles.lead}>{CONSTRUCTION_STAGES_LEAD}</p>
            </div>
            <div className={styles.grid}>
                {CONSTRUCTION_STAGES.map((stage, i) => (
                    <article key={stage.id} className={styles.card}>
                        <span className={styles.imageWrap}>
                            <Image
                                src={stage.image}
                                alt=""
                                fill
                                unoptimized
                                sizes="(min-width: 992px) 25vw, 50vw"
                                className={styles.image}
                                priority={i === 0}
                            />
                        </span>
                        <h3 className={styles.name}>{stage.title}</h3>
                        <p className={styles.text}>{stage.text}</p>
                    </article>
                ))}
            </div>
            <div className={styles.ctaWrap}>
                <Link href={href} className={styles.cta}>
                    {CONSTRUCTION_STAGES_CTA}
                </Link>
            </div>
        </section>
    );
}

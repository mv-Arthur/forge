import Image from "next/image";
import Link from "next/link";
import type { WorksHubStageCard } from "../works-hub.types";
import styles from "../works-hub.module.css";

export function WorksHubStages({
    heading,
    stages,
    seeLabel,
    seeHref,
}: {
    heading: string;
    stages: WorksHubStageCard[];
    seeLabel: string;
    seeHref: string;
}) {
    return (
        <section id="stages" data-section="works-stages" className={styles.stages}>
            <h2 className={styles.blockTitle}>{heading}</h2>
            <div className={styles.stageGrid}>
                {stages.map((stage, i) => (
                    <Link
                        key={stage.id}
                        href={stage.href}
                        className={styles.stage}
                    >
                        <Image
                            src={stage.image}
                            alt=""
                            fill
                            unoptimized={stage.image.startsWith("/media/")}
                            sizes="(min-width: 768px) 280px, 100vw"
                            className={styles.stageImage}
                            priority={i === 0}
                        />
                        <span className={styles.stageName}>{stage.title}</span>
                    </Link>
                ))}
            </div>
            <div className={styles.stageSeeWrap}>
                <Link href={seeHref} className={styles.stageSee}>
                    {seeLabel}
                </Link>
            </div>
        </section>
    );
}

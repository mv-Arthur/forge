import Image from "next/image";
import Link from "next/link";
import {
    TECH_SUPERVISION_ACCEPTANCE_CTA,
    TECH_SUPERVISION_ACCEPTANCE_HEADING,
    TECH_SUPERVISION_ACCEPTANCE_LEAD,
} from "@/lib/copy";
import { routes } from "@/lib/routes";
import { ACCEPTANCE } from "../lib/content";
import styles from "./acceptance.module.css";

export function TechSupervisionAcceptance() {
    return (
        <section
            data-section="tech-supervision-acceptance"
            className={styles.root}
        >
            <div className={styles.head}>
                <h2 className={styles.title}>
                    {TECH_SUPERVISION_ACCEPTANCE_HEADING}
                </h2>
                <p className={styles.lead}>{TECH_SUPERVISION_ACCEPTANCE_LEAD}</p>
            </div>
            <div className={styles.grid}>
                {ACCEPTANCE.map((item) => (
                    <article key={item.id} className={styles.card}>
                        <span className={styles.imageWrap}>
                            <Image
                                src={item.image}
                                alt=""
                                fill
                                unoptimized
                                sizes="(min-width: 992px) 33vw, 50vw"
                                className={styles.image}
                            />
                        </span>
                        <h3 className={styles.name}>{item.title}</h3>
                    </article>
                ))}
            </div>
            <div className={styles.ctaWrap}>
                <Link href={routes.worksStagesHub} className={styles.cta}>
                    {TECH_SUPERVISION_ACCEPTANCE_CTA}
                </Link>
            </div>
        </section>
    );
}

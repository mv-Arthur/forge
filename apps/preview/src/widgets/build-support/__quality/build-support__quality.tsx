import Image from "next/image";
import Link from "next/link";
import {
    BUILD_SUPPORT_QUALITY_HEADING,
    BUILD_SUPPORT_QUALITY_LINK,
} from "@/lib/copy";
import { routes } from "@/lib/routes";
import { QUALITY } from "../lib/content";
import styles from "./quality.module.css";

export function BuildSupportQuality() {
    return (
        <section data-section="build-support-quality" className={styles.root}>
            <h2 className={styles.heading}>{BUILD_SUPPORT_QUALITY_HEADING}</h2>
            <div className={styles.grid}>
                {QUALITY.map((item) => (
                    <article key={item.id} className={styles.card}>
                        <div className={styles.photo}>
                            <Image
                                src={item.image}
                                alt=""
                                fill
                                unoptimized
                                sizes="(min-width:768px) 33vw, 100vw"
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.body}>
                            <h3 className={styles.title}>{item.title}</h3>
                            <p className={styles.text}>{item.text}</p>
                        </div>
                    </article>
                ))}
            </div>
            <Link
                href={routes.technologyPage("how-we-build/supervision")}
                className={styles.link}
            >
                {BUILD_SUPPORT_QUALITY_LINK}
            </Link>
        </section>
    );
}

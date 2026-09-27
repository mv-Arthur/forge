import Image from "next/image";
import { SITE_SURVEY_AUDIENCES_HEADING } from "@/lib/copy";
import { AUDIENCES } from "../lib/content";
import styles from "./audiences.module.css";

export function SiteSurveyAudiences() {
    return (
        <section
            data-section="site-survey-audiences"
            className={styles.root}
        >
            <h2 className={styles.heading}>{SITE_SURVEY_AUDIENCES_HEADING}</h2>
            <div className={styles.grid}>
                {AUDIENCES.map((item) => (
                    <article key={item.id} className={styles.card}>
                        <div className={styles.photo}>
                            <Image
                                src={item.image}
                                alt=""
                                fill
                                unoptimized
                                sizes="(min-width:768px) 50vw, 100vw"
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.body}>
                            <h3 className={styles.title}>
                                <span className={styles.n}>{item.n}</span>
                                {item.title}
                            </h3>
                            <p className={styles.text}>{item.text}</p>
                            <p className={styles.hint}>{item.hint}</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

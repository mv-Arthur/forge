import { BUILD_SUPPORT_MEDIA_HEADING } from "@/lib/copy";
import { MEDIA } from "../lib/content";
import { MediaIcon } from "./icons";
import styles from "./media.module.css";

export function BuildSupportMedia() {
    return (
        <section data-section="build-support-media" className={styles.root}>
            <h2 className={styles.heading}>{BUILD_SUPPORT_MEDIA_HEADING}</h2>
            <div className={styles.grid}>
                {MEDIA.map((item) => (
                    <article key={item.id} className={styles.card}>
                        <span className={styles.icon} aria-hidden>
                            <MediaIcon id={item.id} />
                        </span>
                        <h3 className={styles.title}>{item.title}</h3>
                        <p className={styles.text}>{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

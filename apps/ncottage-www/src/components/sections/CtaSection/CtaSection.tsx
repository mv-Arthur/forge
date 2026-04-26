import type { CtaSectionContent } from "@/lib/constants";
import styles from "./CtaSection.module.css";

interface CtaSectionProps {
    title: CtaSectionContent["title"];
    text: CtaSectionContent["text"];
    buttonLabel: CtaSectionContent["buttonLabel"];
    image: CtaSectionContent["image"];
}

export function CtaSection({
    title,
    text,
    buttonLabel,
    image,
}: CtaSectionProps) {
    return (
        <section className={styles.section}>
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    <h2 className={styles.title}>{title}</h2>
                    <div className={styles.text}>{text}</div>
                    <div className={styles.buttonRow}>
                        <button type="button" className={styles.button}>
                            {buttonLabel}
                        </button>
                    </div>
                </div>
                <div className={styles.image}>
                    <img
                        className={styles.imageImg}
                        src={image.src}
                        alt={image.alt}
                        decoding="async"
                    />
                </div>
            </div>
        </section>
    );
}

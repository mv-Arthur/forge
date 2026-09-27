import type { TechnologyHubFaqItem } from "../technology-hub.types";
import styles from "../technology-hub.module.css";

export function TechnologyHubFaq({
    heading,
    items,
}: {
    heading: string;
    items: TechnologyHubFaqItem[];
}) {
    return (
        <section data-section="technology-faq" className={styles.block}>
            <h2 className={styles.blockTitle}>{heading}</h2>
            <div className={styles.faq}>
                {items.map((item, index) => (
                    <details
                        key={item.question}
                        className={styles.faqItem}
                        open={index === 0}
                    >
                        <summary>{item.question}</summary>
                        <p className={styles.faqAnswer}>{item.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}

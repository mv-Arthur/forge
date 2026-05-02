import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { AdvantagesSectionContent } from "@/content/home";
import styles from "./AdvantagesSection.module.css";

interface AdvantagesSectionProps {
    eyebrow: AdvantagesSectionContent["eyebrow"];
    title: AdvantagesSectionContent["title"];
    titleAccent?: AdvantagesSectionContent["titleAccent"];
    lead: AdvantagesSectionContent["lead"];
    items: AdvantagesSectionContent["items"];
}

export function AdvantagesSection({
    eyebrow,
    title,
    titleAccent,
    lead,
    items,
}: AdvantagesSectionProps) {
    return (
        <section className={styles.section}>
            <Container>
                <SectionHeading
                    eyebrow={eyebrow}
                    title={title}
                    titleAccent={titleAccent}
                    lead={lead}
                    align="center"
                    className={styles.head}
                />
                <RevealOnScroll
                    as="ul"
                    className={styles.grid}
                    revealedClassName={styles.gridVisible}
                    threshold={0.15}
                >
                    {items.map((item, index) => (
                        <li
                            key={item.title}
                            className={styles.item}
                            style={{ "--i": index } as React.CSSProperties}
                        >
                            <span className={styles.itemIndex}>
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <h3 className={styles.itemTitle}>{item.title}</h3>
                            <p className={styles.itemText}>{item.text}</p>
                        </li>
                    ))}
                </RevealOnScroll>
            </Container>
        </section>
    );
}

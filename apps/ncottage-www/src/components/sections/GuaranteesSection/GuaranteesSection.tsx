import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { GuaranteesSectionContent } from "@/content/home";
import { GuaranteeIconSvg } from "./icons";
import styles from "./GuaranteesSection.module.css";

interface GuaranteesSectionProps {
    eyebrow: GuaranteesSectionContent["eyebrow"];
    title: GuaranteesSectionContent["title"];
    titleAccent?: GuaranteesSectionContent["titleAccent"];
    lead?: GuaranteesSectionContent["lead"];
    items: GuaranteesSectionContent["items"];
}

export function GuaranteesSection({
    eyebrow,
    title,
    titleAccent,
    lead,
    items,
}: GuaranteesSectionProps) {
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
                <ul className={styles.grid}>
                    {items.map((item) => (
                        <li key={item.title} className={styles.item}>
                            <span className={styles.icon}>
                                <GuaranteeIconSvg name={item.icon} />
                            </span>
                            <h3 className={styles.itemTitle}>{item.title}</h3>
                            <p className={styles.itemText}>{item.text}</p>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}

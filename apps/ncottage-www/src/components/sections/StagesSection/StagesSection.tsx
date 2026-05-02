import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StagesSectionContent } from "@/content/home";
import styles from "./StagesSection.module.css";

interface StagesSectionProps {
    eyebrow: StagesSectionContent["eyebrow"];
    title: StagesSectionContent["title"];
    titleAccent?: StagesSectionContent["titleAccent"];
    lead?: StagesSectionContent["lead"];
    stages: StagesSectionContent["stages"];
}

export function StagesSection({
    eyebrow,
    title,
    titleAccent,
    lead,
    stages,
}: StagesSectionProps) {
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
                <ol className={styles.list}>
                    {stages.map((stage) => (
                        <li key={stage.num} className={styles.row}>
                            <div className={styles.numCol}>
                                <div className={styles.numWrap}>
                                    <span className={styles.itemNum}>
                                        {stage.num}
                                    </span>
                                    <h3 className={styles.itemTitle}>
                                        {stage.title}
                                    </h3>
                                </div>
                            </div>
                            <div className={styles.bodyCol}>
                                <p className={styles.itemText}>{stage.text}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </Container>
        </section>
    );
}

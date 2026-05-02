import styles from "./SectionHeading.module.css";

type Tone = "h1" | "h2";

interface SectionHeadingProps {
    eyebrow?: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    align?: "left" | "center";
    tone?: Tone;
    actions?: React.ReactNode;
    className?: string;
}

export function SectionHeading({
    eyebrow,
    title,
    titleAccent,
    lead,
    align = "center",
    tone = "h2",
    actions,
    className,
}: SectionHeadingProps) {
    const TitleTag = tone;
    const root = [styles.heading, styles[align], className]
        .filter(Boolean)
        .join(" ");

    return (
        <header className={root}>
            <div className={styles.text}>
                {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
                <TitleTag className={styles.title}>
                    {title}
                    {titleAccent && (
                        <>
                            {" "}
                            <span className={styles.titleAccent}>
                                {titleAccent}
                            </span>
                        </>
                    )}
                </TitleTag>
                {lead && <p className={styles.lead}>{lead}</p>}
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </header>
    );
}

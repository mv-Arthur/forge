import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
    label?: string;
    title: React.ReactNode;
    description?: string;
    align?: "left" | "center";
}

export function SectionHeading({
    label,
    title,
    description,
    align = "center",
}: SectionHeadingProps) {
    return (
        <div className={`${styles.heading} ${styles[align]}`}>
            {label && <span className={styles.label}>{label}</span>}
            <h2 className={styles.title}>{title}</h2>
            {description && (
                <p className={styles.description}>{description}</p>
            )}
        </div>
    );
}

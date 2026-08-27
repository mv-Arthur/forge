import styles from "./hero__text.module.css";

export function HeroText({
    heading,
    lead,
}: {
    heading: string;
    lead: string;
}) {
    return (
        <div className={styles.root}>
            <h1 className={styles.heading}>{heading}</h1>
            <p className={styles.lead}>{lead}</p>
        </div>
    );
}

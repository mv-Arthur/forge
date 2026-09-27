import styles from "./hero.module.css";

export function TechnologyHubHero({
    heading,
    lead,
}: {
    heading: string;
    lead: string;
}) {
    return (
        <section data-section="technology-hero" className={styles.root}>
            <h1 className={styles.title}>{heading}</h1>
            <p className={styles.lead}>{lead}</p>
        </section>
    );
}

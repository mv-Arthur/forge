import styles from "./hero.module.css";

export function MethodsHubHero({
    heading,
    lead,
}: {
    heading: string;
    lead: string;
}) {
    return (
        <section data-section="methods-hero" className={styles.root}>
            <h1 className={styles.title}>{heading}</h1>
            <p className={styles.lead}>{lead}</p>
        </section>
    );
}

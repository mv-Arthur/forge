import { Container } from "@/ui/container";
import type { ServicesHubStat } from "../services-hub.types";
import styles from "../services-hub.module.css";

export function ServicesHubStats({ stats }: { stats: ServicesHubStat[] }) {
    if (stats.length === 0) return null;
    return (
        <section data-section="services-stats" className={styles.statsBleed}>
            <Container className={styles.stats}>
                {stats.map((stat) => (
                    <div key={stat.hint} className={styles.stat}>
                        <div className={styles.statValue}>{stat.value}</div>
                        <div className={styles.statHint}>{stat.hint}</div>
                    </div>
                ))}
            </Container>
        </section>
    );
}

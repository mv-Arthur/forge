import { ENGINEERING_SERVICES_HEADING } from "@/lib/copy";
import { SERVICE_GROUPS } from "../lib/content";
import styles from "./services.module.css";

export function EngineeringExternalServices() {
    return (
        <section
            data-section="engineering-external-services"
            className={styles.root}
        >
            <h2 className={styles.heading}>{ENGINEERING_SERVICES_HEADING}</h2>
            {SERVICE_GROUPS.map((group) => (
                <div key={group.id} className={styles.group}>
                    <h3 className={styles.groupTitle}>{group.title}</h3>
                    <div className={styles.grid}>
                        {group.items.map((item) => (
                            <article key={item.id} className={styles.card}>
                                <h4 className={styles.title}>{item.title}</h4>
                                <p className={styles.text}>{item.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}

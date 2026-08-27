import type { HeroAttributePayload } from "../hero.types";
import { AttributeIcon } from "./hero__attributes-icons";
import styles from "./hero__attributes.module.css";

export function HeroAttributes({ items }: { items: HeroAttributePayload[] }) {
    const visible = items.filter((item) => item.title);
    if (visible.length === 0) return null;
    return (
        <div className={styles.root}>
            {visible.map((item) => (
                <div key={item.icon + item.title} className={styles.block}>
                    <div className={styles.iconBlock}>
                        <AttributeIcon id={item.icon} className={styles.icon} />
                    </div>
                    <div className={styles.text}>
                        <p className={styles.title}>{item.title}</p>
                        {item.subtitle ? (
                            <p className={styles.subtitle}>{item.subtitle}</p>
                        ) : null}
                    </div>
                </div>
            ))}
        </div>
    );
}

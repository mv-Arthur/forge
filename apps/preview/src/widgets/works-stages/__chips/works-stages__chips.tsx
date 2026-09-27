import Link from "next/link";
import { isServiceSubsectionTitle } from "@/lib/worksStages";
import type { WorksStagesChipsProps } from "../works-stages.types";
import styles from "./chips.module.css";

export function WorksStagesChips({ items }: WorksStagesChipsProps) {
    const show =
        items.length > 1 ||
        (items.length === 1 && !isServiceSubsectionTitle(items[0].title));
    if (!show) return null;

    return (
        <div className={styles.track}>
            {items.map((item) => {
                const className = `${styles.chip} ${
                    item.current ? styles.chipOn : ""
                }`;
                if (item.href) {
                    return (
                        <Link key={item.id} href={item.href} className={className}>
                            {item.title}
                        </Link>
                    );
                }
                return (
                    <span key={item.id} className={className}>
                        {item.title}
                    </span>
                );
            })}
        </div>
    );
}

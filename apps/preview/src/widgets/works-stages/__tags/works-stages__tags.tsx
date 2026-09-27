import type { WorksStagesTagsProps } from "../works-stages.types";
import styles from "./tags.module.css";

export function WorksStagesTags({
    items,
    activeId,
    onSelect,
}: WorksStagesTagsProps) {
    return (
        <ul className={styles.list}>
            {items.map((item) => {
                const on = item.id === activeId;
                return (
                    <li key={item.id}>
                        <button
                            type="button"
                            className={`${styles.tag} ${on ? styles.tagOn : ""}`}
                            aria-pressed={on}
                            onClick={() => onSelect(item.id)}
                        >
                            {item.title}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}

import type { ProjectOption } from "@/domain/project";
import { formatPrice } from "@/lib/utils";
import { PlusIcon } from "./icons";
import styles from "./ProjectOptions.module.css";

interface ProjectOptionsProps {
    options: ProjectOption[];
}

export function ProjectOptions({ options }: ProjectOptionsProps) {
    return (
        <div className={styles.root}>
            <ul className={styles.list}>
                {options.map((opt) => (
                    <li key={opt.label} className={styles.item}>
                        <span className={styles.icon}>
                            <PlusIcon />
                        </span>
                        <div className={styles.text}>
                            <span className={styles.label}>{opt.label}</span>
                            {opt.note && (
                                <span className={styles.note}>{opt.note}</span>
                            )}
                        </div>
                        <span className={styles.price}>
                            +{formatPrice(opt.price)}
                        </span>
                    </li>
                ))}
            </ul>
            <p className={styles.hint}>
                Точную смету с выбранными опциями менеджер пришлёт после
                расчёта.
            </p>
        </div>
    );
}

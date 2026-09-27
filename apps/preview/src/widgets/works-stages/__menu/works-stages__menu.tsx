import Link from "next/link";
import type { WorksStagesMenuProps } from "../works-stages.types";
import styles from "./menu.module.css";

function Chevron() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className={styles.arrow}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.47 5.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06L13.94 12 8.47 6.53a.75.75 0 0 1 0-1.06Z"
                fill="currentColor"
            />
        </svg>
    );
}

export function WorksStagesMenu({ title, items }: WorksStagesMenuProps) {
    return (
        <nav className={styles.root} aria-label={title}>
            <div className={styles.title}>{title}</div>
            <ol className={styles.list}>
                {items.map((item) => {
                    const className = [
                        styles.item,
                        item.current ? styles.itemCurrent : "",
                        item.href ? "" : styles.itemIdle,
                    ]
                        .filter(Boolean)
                        .join(" ");
                    const inner = (
                        <>
                            <span className={styles.dot} />
                            <span className={styles.text}>{item.title}</span>
                            {item.href ? <Chevron /> : null}
                        </>
                    );
                    return (
                        <li key={item.id}>
                            {item.href ? (
                                <Link href={item.href} className={className}>
                                    {inner}
                                </Link>
                            ) : (
                                <span className={className}>{inner}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

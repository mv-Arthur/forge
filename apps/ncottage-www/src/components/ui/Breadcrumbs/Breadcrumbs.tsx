import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav aria-label="Хлебные крошки" className={styles.nav}>
            <ol className={styles.list}>
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1;
                    return (
                        <li key={idx} className={styles.item}>
                            {item.href && !isLast ? (
                                <Link href={item.href} className={styles.link}>
                                    {item.label}
                                </Link>
                            ) : (
                                <span aria-current="page">{item.label}</span>
                            )}
                            {!isLast && (
                                <span className={styles.sep} aria-hidden="true">
                                    /
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

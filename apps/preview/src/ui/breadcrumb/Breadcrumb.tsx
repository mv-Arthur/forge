import Link from "next/link";
import styles from "./Breadcrumb.module.css";

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

function Divider() {
    return (
        <span className={styles.divider} aria-hidden>
            <svg viewBox="0 0 12 12" fill="none">
                <path
                    d="M4 2.5 L8 6 L4 9.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav className={styles.nav} aria-label="Навигация">
            {items.map((item, i) => {
                const current = i === items.length - 1;
                return (
                    <span key={`${item.label}-${i}`} className={styles.item}>
                        {i > 0 ? <Divider /> : null}
                        {current || !item.href ? (
                            <span
                                className={styles.current}
                                aria-current={current ? "page" : undefined}
                            >
                                {item.label}
                            </span>
                        ) : (
                            <Link href={item.href} className={styles.link}>
                                {item.label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}

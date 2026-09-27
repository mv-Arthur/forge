import Link from "next/link";
import { ENGINEERING_HUB_TITLE } from "@/lib/copy";
import {
    ENGINEERING_NAV,
    type EngineeringArticleSlug,
} from "@/lib/engineering";
import styles from "./nav.module.css";

export function EngineeringArticleNav({
    current,
}: {
    current: EngineeringArticleSlug;
}) {
    return (
        <nav className={styles.root} aria-label={ENGINEERING_HUB_TITLE}>
            <div className={styles.title}>{ENGINEERING_HUB_TITLE}</div>
            <ul className={styles.list}>
                {ENGINEERING_NAV.map((item) => {
                    const active = item.slug === current;
                    return (
                        <li key={item.slug}>
                            {active ? (
                                <span className={styles.current} aria-current="page">
                                    {item.label}
                                </span>
                            ) : (
                                <Link href={item.href} className={styles.link}>
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

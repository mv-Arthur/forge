import Link from "next/link";
import { HeroArrow } from "../__arrow/hero__arrow";
import styles from "./hero__more-link.module.css";

export function HeroMoreLink({
    variant,
}: {
    variant: "mobile" | "desktop";
}) {
    return (
        <Link
            href="/projects"
            className={`${styles.root} ${styles[variant]}`}
        >
            <span>Подробнее</span>
            <span className={styles.icon}>
                <HeroArrow />
            </span>
        </Link>
    );
}

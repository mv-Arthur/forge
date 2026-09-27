import Link from "next/link";
import { routes } from "@/lib/routes";
import { HeroArrow } from "../__arrow/hero__arrow";
import styles from "./hero__more-link.module.css";

export function HeroMoreLink({
    variant,
}: {
    variant: "mobile" | "desktop";
}) {
    return (
        <Link
            href={routes.projects()}
            className={`${styles.root} ${styles[variant]}`}
        >
            <span>Подробнее</span>
            <span className={styles.icon}>
                <HeroArrow />
            </span>
        </Link>
    );
}

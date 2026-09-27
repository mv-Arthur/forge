import Image from "next/image";
import Link from "next/link";
import styles from "../works-hub.module.css";

export function WorksHubHero({
    image,
    href,
    label,
}: {
    image: string;
    href: string;
    label: string;
}) {
    return (
        <Link
            href={href}
            className={styles.hero}
            data-section="works-hero"
        >
            <Image
                src={image}
                alt=""
                fill
                priority
                unoptimized={image.startsWith("/media/")}
                sizes="(min-width: 1280px) 1280px, 100vw"
                className={styles.heroImage}
            />
            <span className={styles.heroLabel}>{label}</span>
        </Link>
    );
}

import type { ProjectPackage } from "@/domain/project";
import { formatPrice } from "@/lib/utils";
import { CheckIcon } from "./icons";
import styles from "./ProjectPackages.module.css";

interface ProjectPackagesProps {
    packages: ProjectPackage[];
}

export function ProjectPackages({ packages }: ProjectPackagesProps) {
    return (
        <div className={styles.grid}>
            {packages.map((pkg) => {
                const isActive = pkg.highlighted;
                return (
                    <article
                        key={pkg.name}
                        className={`${styles.card} ${isActive ? styles.cardHighlighted : ""}`}
                    >
                        {isActive && (
                            <span className={styles.badge}>
                                Самая популярная
                            </span>
                        )}
                        <header className={styles.head}>
                            <h3 className={styles.title}>{pkg.name}</h3>
                            {pkg.tagline && (
                                <p className={styles.tagline}>{pkg.tagline}</p>
                            )}
                            <p className={styles.price}>
                                от{" "}
                                <span className={styles.priceValue}>
                                    {formatPrice(pkg.price)}
                                </span>
                            </p>
                        </header>

                        <ul className={styles.includes}>
                            {pkg.includes.map((inc) => {
                                const isOmitted = inc.value
                                    .toLowerCase()
                                    .startsWith("не входит");
                                return (
                                    <li
                                        key={inc.label}
                                        className={`${styles.incRow} ${isOmitted ? styles.incRowOff : ""}`}
                                    >
                                        <span className={styles.incIcon}>
                                            {isOmitted ? (
                                                <span className={styles.dash} />
                                            ) : (
                                                <CheckIcon />
                                            )}
                                        </span>
                                        <span className={styles.incLabel}>
                                            {inc.label}
                                        </span>
                                        <span className={styles.incValue}>
                                            {inc.value}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        <a
                            href="#lead"
                            className={`${styles.cta} ${isActive ? styles.ctaPrimary : styles.ctaSecondary}`}
                        >
                            Выбрать комплектацию
                        </a>
                    </article>
                );
            })}
        </div>
    );
}

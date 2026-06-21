import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { FeaturedProjectContent } from "@/content/home";
import type { BuiltObject } from "@/domain/project";
import styles from "./FeaturedProject.module.css";

interface FeaturedProjectProps {
    eyebrow: FeaturedProjectContent["eyebrow"];
    overline: FeaturedProjectContent["overline"];
    ctaLabel: FeaturedProjectContent["ctaLabel"];
    technology: FeaturedProjectContent["technology"];
    project: BuiltObject;
}

export function FeaturedProject({
    eyebrow,
    overline,
    ctaLabel,
    technology,
    project,
}: FeaturedProjectProps) {
    return (
        <section className={styles.section}>
            <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="100vw"
                className={styles.image}
            />
            <div className={styles.scrim} aria-hidden="true" />
            <Container className={styles.inner}>
                <div className={styles.content}>
                    <div className={styles.body}>
                        <div className={styles.eyebrowRow}>
                            <span className={styles.eyebrow}>{eyebrow}</span>
                            <span className={styles.dot} aria-hidden="true" />
                            <span className={styles.overline}>{overline}</span>
                        </div>
                        <h2 className={styles.title}>
                            {project.title}{" "}
                            <span className={styles.titleAccent}>
                                — {technology.toLowerCase()}
                            </span>
                        </h2>
                        <div className={styles.meta}>
                            {project.location && (
                                <span>{project.location}</span>
                            )}
                            {project.area && (
                                <span className={styles.metaArea}>
                                    {project.area} м²
                                </span>
                            )}
                        </div>
                    </div>
                    <Link href={project.href} className={styles.cta}>
                        {ctaLabel} →
                    </Link>
                </div>
            </Container>
        </section>
    );
}

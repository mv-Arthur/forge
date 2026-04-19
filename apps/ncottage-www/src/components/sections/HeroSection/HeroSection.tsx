import Link from "next/link";
import type { HeroContent } from "@/lib/constants";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
    subtitle: HeroContent["subtitle"];
    title: HeroContent["title"];
    text: HeroContent["text"];
    cta: HeroContent["cta"];
    image: HeroContent["image"];
}

export function HeroSection({
    subtitle,
    title,
    text,
    cta,
    image,
}: HeroSectionProps) {
    return (
        <section className={styles.banner}>
            <div className={styles.bg}>
                <img
                    src={image.src}
                    alt={image.alt}
                    className={styles.bgImage}
                />
            </div>
            <div className={styles.content}>
                <p className={styles.subtitle}>{subtitle}</p>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.text}>{text}</p>
                <div className={styles.buttonWrap}>
                    <Link href={cta.href} className={styles.button}>
                        {cta.label}
                    </Link>
                </div>
            </div>
        </section>
    );
}

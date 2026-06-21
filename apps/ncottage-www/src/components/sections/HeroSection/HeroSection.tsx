import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CallbackButton } from "@/components/shared/CallbackButton";
import type { HeroContent } from "@/content/home";
import styles from "./HeroSection.module.css";

interface HeroSectionProps {
    eyebrow: HeroContent["eyebrow"];
    title: HeroContent["title"];
    titleAccent?: HeroContent["titleAccent"];
    text: HeroContent["text"];
    primaryCta: HeroContent["primaryCta"];
    secondaryCta?: HeroContent["secondaryCta"];
    trust: HeroContent["trust"];
    image: HeroContent["image"];
}

export function HeroSection({
    eyebrow,
    title,
    titleAccent,
    text,
    primaryCta,
    secondaryCta,
    trust,
    image,
}: HeroSectionProps) {
    return (
        <section className={styles.hero}>
            <div className={styles.media}>
                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority
                    sizes="100vw"
                    className={styles.image}
                />
                <div className={styles.scrim} aria-hidden="true" />
            </div>

            <Container className={styles.inner}>
                <div className={styles.content}>
                    <span className={styles.eyebrow}>{eyebrow}</span>
                    <h1 className={styles.title}>
                        {title}
                        {titleAccent && (
                            <>
                                {" "}
                                <span className={styles.titleAccent}>
                                    {titleAccent}
                                </span>
                            </>
                        )}
                    </h1>
                    <p className={styles.text}>{text}</p>
                    <div className={styles.actions}>
                        <CallbackButton
                            className={styles.primary}
                            title={primaryCta.label}
                            subtitle="Оставьте телефон — перезвоним в течение 15 минут и посчитаем стоимость по вашему проекту."
                        >
                            {primaryCta.label}
                        </CallbackButton>
                        {secondaryCta && (
                            <Link
                                href={secondaryCta.href}
                                className={styles.secondary}
                            >
                                {secondaryCta.label}
                            </Link>
                        )}
                    </div>
                </div>

                <ul className={styles.trust}>
                    {trust.map((item) => (
                        <li key={item.label} className={styles.trustItem}>
                            <span className={styles.trustValue}>
                                {item.value}
                            </span>
                            <span className={styles.trustLabel}>
                                {item.label}
                            </span>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}

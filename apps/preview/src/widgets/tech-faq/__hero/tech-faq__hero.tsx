import { TECH_FAQ_LEAD, TECH_FAQ_TITLE } from "@/lib/copy";
import styles from "./hero.module.css";

function HeroArt() {
    return (
        <svg
            className={styles.art}
            viewBox="0 0 320 280"
            fill="none"
            aria-hidden
        >
            <ellipse
                cx="200"
                cy="252"
                rx="92"
                ry="14"
                fill="rgb(var(--ink-200-rgb))"
                opacity="0.55"
            />
            <path
                d="M236 238c22-46 6-98-24-124 26 40 20 90 4 124Z"
                fill="var(--color-accent-soft)"
            />
            <path
                d="M258 232c14-38 0-78-20-100 18 32 14 70 4 100Z"
                fill="var(--color-accent)"
                opacity="0.28"
            />
            <path
                d="M176 236c-4-52 18-100 52-124-32 38-42 88-32 124Z"
                fill="var(--color-accent-soft)"
            />
            <path
                d="M204 38c44 0 80 36 80 82 0 38-24 70-58 80l-8 28c-2 6-10 6-12 0l-10-28c-38-8-66-42-66-80 0-46 34-82 74-82Z"
                fill="var(--color-accent)"
            />
            <path
                d="M204 78c-16 0-28 12-28 28 0 12 8 20 18 26 8 4 12 8 12 16v2"
                stroke="var(--color-ink-on-accent)"
                strokeWidth="12"
                strokeLinecap="round"
            />
            <circle cx="206" cy="166" r="7" fill="var(--color-ink-on-accent)" />
            <path
                d="M108 96c36-8 70 14 78 48 8 36-16 70-50 78l-10 24c-2 6-10 6-12 0l-8-24c-32-12-52-44-48-78 6-36 26-44 50-48Z"
                fill="var(--color-surface)"
            />
            <path
                d="M92 154 110 172l36-48"
                stroke="var(--color-accent)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function TechFaqHero() {
    return (
        <section data-section="tech-faq-hero" className={styles.root}>
            <div className={styles.copy}>
                <h1 className={styles.title}>{TECH_FAQ_TITLE}</h1>
                <p className={styles.lead}>{TECH_FAQ_LEAD}</p>
            </div>
            <div className={styles.visual}>
                <HeroArt />
            </div>
        </section>
    );
}

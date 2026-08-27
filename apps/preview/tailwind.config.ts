import type { Config } from "tailwindcss";

/**
 * Единственный источник токенов — styles/www-tokens.css.
 * Здесь только ссылки на CSS-переменные, hex не дублируем: ручное зеркало
 * расходилось (radius 999 против 9999, eyebrow 11px вне шкалы).
 * Нейтральная шкала идёт через rgb-триплеты, чтобы работали модификаторы
 * прозрачности вида bg-ink-900/40.
 */
const ink = (step: number | string) =>
    `rgb(var(--ink-${step}-rgb) / <alpha-value>)`;

const config: Config = {
    content: [
        "./src/app/**/*.{ts,tsx}",
        "./src/widgets/**/*.{ts,tsx}",
        "./src/ui/**/*.{ts,tsx}",
        "./src/lib/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                ink: {
                    950: ink(950),
                    900: ink(900),
                    800: ink(800),
                    700: ink(700),
                    600: ink(600),
                    500: ink(500),
                    400: ink(400),
                    300: ink(300),
                    200: ink(200),
                    150: ink(150),
                    100: ink(100),
                    50: ink(50),
                },
                paper: ink(50),
                surface: "rgb(var(--color-surface-rgb) / <alpha-value>)",
                sand: "var(--color-sand)",
                accent: {
                    DEFAULT: "rgb(var(--color-accent-rgb) / <alpha-value>)",
                    hover: "var(--color-accent-hover)",
                    soft: "var(--color-accent-soft)",
                    ink: "var(--color-ink-on-accent)",
                    onDark: "var(--color-accent-on-dark)",
                },
                brand: {
                    DEFAULT: "rgb(var(--color-brand-green-rgb) / <alpha-value>)",
                    hover: "var(--color-brand-green-hover)",
                },
                line: {
                    DEFAULT: "rgb(var(--color-line-rgb) / <alpha-value>)",
                    strong: "rgb(var(--color-line-strong-rgb) / <alpha-value>)",
                },
                tg: "#0088cc",
                wa: "#25d366",
                success: "#2f6b3a",
                danger: "rgb(var(--color-danger-rgb) / <alpha-value>)",
                warn: "rgb(var(--color-accent-rgb) / <alpha-value>)",
            },
            fontFamily: {
                sans: [
                    "var(--font-sans)",
                    "Manrope",
                    "system-ui",
                    "sans-serif",
                ],
                display: [
                    "var(--font-display)",
                    "Manrope",
                    "system-ui",
                    "sans-serif",
                ],
                mono: ["ui-monospace", "SFMono-Regular", "monospace"],
            },
            fontSize: {
                /* Floor ≥2.25rem (36px) so hero titles never shrink below prior mobile size */
                "display-1": [
                    "clamp(2.25rem, 4.5vw, 3.5rem)",
                    {
                        lineHeight: "1.12",
                        letterSpacing: "-0.025em",
                        fontWeight: "700",
                    },
                ],
                "display-2": [
                    "clamp(1.625rem, 3.5vw, 2.75rem)",
                    {
                        lineHeight: "1.15",
                        letterSpacing: "-0.02em",
                        fontWeight: "700",
                    },
                ],
                h1: [
                    "clamp(1.375rem, 2.5vw, 2rem)",
                    {
                        lineHeight: "1.25",
                        letterSpacing: "-0.015em",
                        fontWeight: "700",
                    },
                ],
                h2: [
                    "clamp(1.2rem, 2vw, 1.5rem)",
                    {
                        lineHeight: "1.3",
                        letterSpacing: "-0.01em",
                        fontWeight: "700",
                    },
                ],
                h3: [
                    "1.125rem",
                    {
                        lineHeight: "1.35",
                        letterSpacing: "-0.01em",
                        fontWeight: "600",
                    },
                ],
                /* Было 0.6875rem (11px) — вне шкалы токенов и ниже AA
                   на приглушённом цвете. Минимальная ступень — 12px. */
                eyebrow: [
                    "var(--text-xs)",
                    {
                        lineHeight: "1.2",
                        letterSpacing: "0.08em",
                        fontWeight: "600",
                    },
                ],
                /* GWD-like catalog price digits → utility text-price; min 1.625rem (26px) */
                price: [
                    "clamp(1.625rem, 2.5vw, 2rem)",
                    {
                        lineHeight: "1",
                        letterSpacing: "-0.02em",
                        fontWeight: "800",
                    },
                ],
                /* GWD-like secondary price digits → utility text-price-sm; min 1.375rem (22px) */
                "price-sm": [
                    "clamp(1.375rem, 2vw, 1.625rem)",
                    {
                        lineHeight: "1",
                        letterSpacing: "-0.015em",
                        fontWeight: "800",
                    },
                ],
            },
            boxShadow: {
                card: "var(--shadow-soft)",
                lift: "var(--shadow-pop)",
                sticky: "0 -8px 24px -12px rgb(var(--color-ink-rgb) / 0.12)",
                inset: "inset 0 0 0 1px rgb(var(--color-ink-rgb) / 0.06)",
                cta: "0 8px 20px -8px rgb(var(--color-accent-rgb) / 0.45)",
            },
            spacing: {
                section: "var(--section-padding-y)",
            },
            /* Схлопнуто к четырём ступеням токенов. Раньше на одной странице
               соседствовали 6/8/10/14/16 и 9999px против --radius-pill: 999px. */
            borderRadius: {
                sm: "var(--radius-sm)",
                DEFAULT: "var(--radius-sm)",
                md: "var(--radius-sm)",
                lg: "var(--radius-md)",
                xl: "var(--radius-md)",
                "2xl": "var(--radius-lg)",
                "3xl": "var(--radius-lg)",
                full: "var(--radius-pill)",
            },
            maxWidth: {
                page: "var(--container-width)",
            },
            transitionTimingFunction: {
                expo: "var(--ease)",
            },
            transitionDuration: {
                fast: "var(--duration-fast)",
                base: "var(--duration-base)",
            },
        },
    },
    plugins: [],
};

export default config;

import type { ReactNode } from "react";
import type { EngineeringFigureKind } from "../engineering-article.types";
import styles from "./figure.module.css";

function Collector() {
    return (
        <svg viewBox="0 0 320 140" fill="none" aria-hidden>
            <rect x="24" y="28" width="36" height="84" rx="8" fill="currentColor" />
            {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                    <path
                        d={`M60 ${44 + i * 20} H210`}
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <circle cx="228" cy={44 + i * 20} r="10" fill="currentColor" />
                </g>
            ))}
        </svg>
    );
}

function Floor() {
    return (
        <svg viewBox="0 0 320 140" fill="none" aria-hidden>
            <path
                d="M40 28h240v84H40z"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.35"
            />
            <path
                d="M64 44h192v20H80v20h176v20H80"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function Windows() {
    return (
        <svg viewBox="0 0 320 140" fill="none" aria-hidden>
            <rect x="48" y="24" width="88" height="92" rx="6" stroke="currentColor" strokeWidth="3" />
            <path d="M92 24v92M48 70h88" stroke="currentColor" strokeWidth="2" />
            <path
                d="M150 52c28 8 48 8 76 0"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <path
                d="M214 52l12-10M214 52l12 10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}

function Valves() {
    return (
        <svg viewBox="0 0 320 140" fill="none" aria-hidden>
            {[0, 1, 2].map((i) => (
                <g key={i} transform={`translate(${40 + i * 92} 36)`}>
                    <rect width="56" height="68" rx="8" stroke="currentColor" strokeWidth="3" />
                    <circle cx="28" cy="28" r="10" fill="currentColor" />
                    <path d="M28 38v18" stroke="currentColor" strokeWidth="3" />
                </g>
            ))}
        </svg>
    );
}

function Recuperator() {
    return (
        <svg viewBox="0 0 320 140" fill="none" aria-hidden>
            <rect x="110" y="28" width="100" height="84" rx="10" stroke="currentColor" strokeWidth="3" />
            <path
                d="M36 52h74M210 52h74M36 88h74M210 88h74"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M128 48h64M128 68h64M128 88h64"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.45"
            />
        </svg>
    );
}

function Smart() {
    return (
        <svg viewBox="0 0 320 140" fill="none" aria-hidden>
            <rect x="96" y="24" width="128" height="92" rx="12" stroke="currentColor" strokeWidth="3" />
            <circle cx="160" cy="62" r="16" stroke="currentColor" strokeWidth="3" />
            <path d="M160 54v16M152 70h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <path d="M128 100h64" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

function Stack() {
    return (
        <svg viewBox="0 0 320 140" fill="none" aria-hidden>
            <path
                d="M80 20v100M80 48h72l40 24h64"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M80 88h56"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
            />
            <circle cx="80" cy="48" r="5" fill="currentColor" />
            <circle cx="80" cy="88" r="5" fill="currentColor" />
        </svg>
    );
}

function Supply() {
    return (
        <svg viewBox="0 0 320 140" fill="none" aria-hidden>
            <rect x="28" y="36" width="44" height="68" rx="8" fill="currentColor" />
            {[0, 1, 2].map((i) => (
                <path
                    key={i}
                    d={`M72 ${52 + i * 18} h70 l36 22 h70`}
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            ))}
        </svg>
    );
}

const FIGURES: Record<EngineeringFigureKind, () => ReactNode> = {
    collector: Collector,
    floor: Floor,
    windows: Windows,
    valves: Valves,
    recuperator: Recuperator,
    smart: Smart,
    stack: Stack,
    supply: Supply,
};

export function EngineeringArticleFigure({
    kind,
    caption,
}: {
    kind: EngineeringFigureKind;
    caption: string;
}) {
    const Graphic = FIGURES[kind];
    return (
        <figure className={styles.root}>
            <div className={styles.stage}>
                <Graphic />
            </div>
            <figcaption className={styles.caption}>{caption}</figcaption>
        </figure>
    );
}

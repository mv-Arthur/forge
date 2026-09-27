import type { SeeAlsoIcon } from "@/lib/uniqueSeeAlso";

function PlanIcon() {
    return (
        <svg viewBox="0 0 88 80" aria-hidden>
            <g fill="none" stroke="#2c4a3a" strokeWidth="1.8" strokeLinecap="round">
                <path d="M8 12 V44" />
                <path d="M4 12 H12 M4 44 H12" />
                <path d="M8 16 L11 19 M8 16 L5 19 M8 40 L11 37 M8 40 L5 37" />
            </g>
            <rect
                x="22"
                y="6"
                width="42"
                height="42"
                fill="#c9a36a"
                stroke="#2a2622"
                strokeWidth="1.8"
            />
            <path
                d="M22 27 H64 M43 6 V48 M22 16 H43"
                fill="none"
                stroke="#2a2622"
                strokeWidth="1.8"
            />
            <path
                d="M20 58c10 14 28 16 42 4 4-3 6-8 4-12"
                fill="#d7b17c"
                stroke="#2a2622"
                strokeWidth="1.7"
            />
            <path
                d="M24 54 L30 64 M30 53 L36 63 M36 52 L41 61"
                fill="none"
                stroke="#2a2622"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M58 44 L76 62"
                fill="none"
                stroke="#2a2622"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
            <path
                d="M76 62 L68 61 M76 62 L75 54"
                fill="none"
                stroke="#2a2622"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CottageIcon() {
    return (
        <svg viewBox="0 0 88 80" aria-hidden>
            <path
                d="M14 40 L44 14 L74 40 V68 H14 Z"
                fill="#f4efe4"
                stroke="#2a2622"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M44 14 L44 8 H52 L54 14"
                fill="none"
                stroke="#2a2622"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
            <path
                d="M20 40 H68"
                fill="none"
                stroke="#2a2622"
                strokeWidth="1.8"
            />
            <path
                d="M24 22 L44 14 L64 22"
                fill="none"
                stroke="#2a2622"
                strokeWidth="1.4"
            />
            <rect
                x="24"
                y="46"
                width="12"
                height="12"
                fill="#dbe7e0"
                stroke="#2a2622"
                strokeWidth="1.6"
            />
            <rect
                x="52"
                y="46"
                width="12"
                height="12"
                fill="#dbe7e0"
                stroke="#2a2622"
                strokeWidth="1.6"
            />
            <path
                d="M40 68 V52 H48 V68"
                fill="#f4efe4"
                stroke="#2a2622"
                strokeWidth="1.6"
            />
        </svg>
    );
}

export function SeeAlsoGlyph({ name }: { name: SeeAlsoIcon }) {
    return name === "house" ? <CottageIcon /> : <PlanIcon />;
}

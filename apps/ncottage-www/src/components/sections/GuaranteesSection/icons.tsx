import type { GuaranteeIcon } from "@/content/home";

const STROKE = 1.5;

function Frame({ children }: { children: React.ReactNode }) {
    return (
        <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

const ICONS: Record<GuaranteeIcon, React.ReactElement> = {
    price: (
        <Frame>
            <path
                d="M16 4 4 16l12 12 12-12V8a4 4 0 0 0-4-4h-8Z"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinejoin="round"
            />
            <circle cx="22" cy="10" r="1.6" fill="currentColor" />
        </Frame>
    ),
    contract: (
        <Frame>
            <path
                d="M8 4h12l4 4v20H8z"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinejoin="round"
            />
            <path
                d="M20 4v4h4"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinejoin="round"
            />
            <path
                d="M12 14h8M12 19h8M12 24h5"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="round"
            />
        </Frame>
    ),
    steps: (
        <Frame>
            <path
                d="M5 26h6v-6h6v-6h6V8h5"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="11"
                cy="20"
                r="1.6"
                fill="currentColor"
            />
            <circle
                cx="17"
                cy="14"
                r="1.6"
                fill="currentColor"
            />
            <circle
                cx="23"
                cy="8"
                r="1.6"
                fill="currentColor"
            />
        </Frame>
    ),
    eye: (
        <Frame>
            <path
                d="M3 16s4.5-8 13-8 13 8 13 8-4.5 8-13 8S3 16 3 16Z"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinejoin="round"
            />
            <circle
                cx="16"
                cy="16"
                r="3.5"
                stroke="currentColor"
                strokeWidth={STROKE}
            />
        </Frame>
    ),
    shield: (
        <Frame>
            <path
                d="M16 4 5 8v8c0 7 5.5 11.5 11 12 5.5-.5 11-5 11-12V8L16 4Z"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinejoin="round"
            />
            <path
                d="m11 16 3.5 3.5L21 13"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Frame>
    ),
    umbrella: (
        <Frame>
            <path
                d="M3 15a13 13 0 0 1 26 0"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="round"
            />
            <path
                d="M16 3v2M3 15c2-2 4-2 6 0M9 15c2-2 4-2 6 0M15 15c2-2 4-2 6 0M21 15c2-2 4-2 6 0"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16 15v10a3 3 0 0 1-3 3"
                stroke="currentColor"
                strokeWidth={STROKE}
                strokeLinecap="round"
            />
        </Frame>
    ),
};

export function GuaranteeIconSvg({ name }: { name: GuaranteeIcon }) {
    return ICONS[name];
}

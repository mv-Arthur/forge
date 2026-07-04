interface IconProps {
    className?: string;
}

export function AreaIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
        >
            <rect x="3" y="3" width="18" height="18" rx="1" />
            <path d="M3 9h18M9 3v18" />
        </svg>
    );
}

export function FloorsIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
        >
            <path d="M3 20h18M5 20V8l7-4 7 4v12M9 20v-6h6v6" />
        </svg>
    );
}

export function BedIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
        >
            <path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 14h18M3 18v2M21 18v2M7 10V7h6v3" />
        </svg>
    );
}

export function BathIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
        >
            <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3zM6 12V6a2 2 0 0 1 2-2h1M8 19l-1 2M16 19l1 2" />
        </svg>
    );
}

export function DimsIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
        >
            <path d="M3 12h18M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3M12 3v18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3" />
        </svg>
    );
}

export function CheckIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 12l5 5L20 7" />
        </svg>
    );
}

export function ChevronIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

export function DownloadIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M12 4v12M6 12l6 6 6-6M4 20h16" />
        </svg>
    );
}

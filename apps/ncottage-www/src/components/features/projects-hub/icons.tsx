type IconProps = { className?: string };

export function ArrowSplitIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M3 9H15M15 9L9 3M15 9L9 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

type IconProps = { className?: string };

export function FavouriteIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M12 20.5s-7.5-4.5-7.5-10.25C4.5 7.4 6.65 5.5 9 5.5c1.4 0 2.7.7 3 1.7.3-1 1.6-1.7 3-1.7 2.35 0 4.5 1.9 4.5 4.75 0 5.75-7.5 10.25-7.5 10.25Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function CompareIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M5 19V11M11 19V5M17 19V14"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

export function PhoneIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                d="M5.5 4.5C5.5 3.95 5.95 3.5 6.5 3.5h2.1c.4 0 .76.25.9.62l1.18 3.05c.13.34.04.72-.23.96l-1.5 1.34a11.25 11.25 0 0 0 5.58 5.58l1.34-1.5c.24-.27.62-.36.96-.23l3.05 1.18c.37.14.62.5.62.9v2.1c0 .55-.45 1-1 1A14.5 14.5 0 0 1 5.5 4.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function BurgerIcon({
    className,
    open,
}: IconProps & { open?: boolean }) {
    return (
        <span className={className} aria-hidden="true" data-open={open}>
            <span />
            <span />
        </span>
    );
}

type IconProps = { className?: string };

export function GridIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
        >
            <rect
                x="2"
                y="2"
                width="7"
                height="7"
                rx="1.5"
                fill="currentColor"
            />
            <rect
                x="11"
                y="2"
                width="7"
                height="7"
                rx="1.5"
                fill="currentColor"
            />
            <rect
                x="2"
                y="11"
                width="7"
                height="7"
                rx="1.5"
                fill="currentColor"
            />
            <rect
                x="11"
                y="11"
                width="7"
                height="7"
                rx="1.5"
                fill="currentColor"
            />
        </svg>
    );
}

export function ListIcon({ className }: IconProps) {
    return (
        <svg
            className={className}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
        >
            <rect
                x="2"
                y="3"
                width="16"
                height="6"
                rx="1.5"
                fill="currentColor"
            />
            <rect
                x="2"
                y="11"
                width="16"
                height="6"
                rx="1.5"
                fill="currentColor"
            />
        </svg>
    );
}

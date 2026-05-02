import type { IconProps } from "./types";

export function ChevronDownIcon({
    className,
    width = 10,
    height = 6,
}: IconProps) {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 10 6"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="m1 1 4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

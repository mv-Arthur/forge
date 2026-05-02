import type { IconProps } from "./types";

export function CheckIcon({ className, width = 14, height = 14 }: IconProps) {
    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="m3 7.5 2.8 2.8L11 4.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

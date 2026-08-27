import type { ReactElement, SVGProps } from "react";
import type { HeroAttributeIconId } from "../hero.types";

type IconProps = SVGProps<SVGSVGElement>;

const glyph: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
};

function ToolsIcon(props: IconProps) {
    return (
        <svg {...glyph} {...props}>
            <path
                d="M10.0508 10.6067L2.97971 17.6778C2.19867 18.4588 2.19867 19.7251 2.97971 20.5062C3.76076 21.2872 5.02709 21.2872 5.80814 20.5062L12.8792 13.4351"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M17.1925 13.7994L21.0708 17.6777C21.8518 18.4587 21.8518 19.7251 21.0708 20.5061C20.2897 21.2872 19.0234 21.2872 18.2423 20.5061L12.0339 14.2977"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M6.73242 5.90375L4.6111 6.61086L2.48978 3.07533L3.904 1.66111L7.43953 3.78243L6.73242 5.90375ZM6.73242 5.90375L9.56265 8.73398"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M10.0503 10.6067C9.2065 8.45365 9.37147 5.62867 11.111 3.88916C12.8505 2.14964 16.0607 1.76784 17.8285 2.8285L14.7878 5.86917L14.5052 8.98021L17.6162 8.6976L20.6569 5.65692C21.7176 7.42469 21.3358 10.6349 19.5963 12.3744C17.8567 14.114 15.0318 14.2789 12.8788 13.4351"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function HomeIcon(props: IconProps) {
    return (
        <svg {...glyph} {...props}>
            <path
                d="M14 12H14.4C14.7314 12 15 12.2686 15 12.6V15.4C15 15.7314 14.7314 16 14.4 16H9.6C9.26863 16 9 15.7314 9 15.4V12.6C9 12.2686 9.26863 12 9.6 12H10M14 12V10C14 9.33333 13.6 8 12 8C10.4 8 10 9.33333 10 10V12M14 12H10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2 8L11.7317 3.13416C11.9006 3.04971 12.0994 3.0497 12.2683 3.13416L22 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CornerIcon(props: IconProps) {
    return (
        <svg {...glyph} {...props}>
            <path
                d="M3 21L3 3L9 3V15L21 15V21H3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M13 19V21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M9 19V21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M3 7H5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M3 11H5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M3 15H5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M17 19V21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function UserIcon(props: IconProps) {
    return (
        <svg {...glyph} {...props}>
            <path
                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M22 17.2798C22 17.8812 21.7625 18.4588 21.3383 18.8861C20.3619 19.8701 19.415 20.8961 18.4021 21.8443C18.17 22.0585 17.8017 22.0507 17.5795 21.8268L14.6615 18.8861C13.7795 17.9972 13.7795 16.5623 14.6615 15.6734C15.5522 14.7758 17.0032 14.7758 17.8938 15.6734L17.9999 15.7803L18.1059 15.6734C18.533 15.2429 19.1146 15 19.7221 15C20.3297 15 20.9113 15.2428 21.3383 15.6734C21.7625 16.1007 22 16.6784 22 17.2798Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            <path
                d="M5 20V19C5 15.134 8.13401 12 12 12C13.0736 12 14.0907 12.2417 15 12.6736"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

const ICONS: Record<
    HeroAttributeIconId,
    (props: IconProps) => ReactElement
> = {
    tools: ToolsIcon,
    home: HomeIcon,
    corner: CornerIcon,
    user: UserIcon,
};

export function AttributeIcon({
    id,
    className,
}: {
    id: HeroAttributeIconId;
    className?: string;
}) {
    const Icon = ICONS[id];
    return <Icon className={className} />;
}

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke: SVGProps<SVGSVGElement> = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
};

export function TelegramIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M9.04 15.86l-.35 4.14c.5 0 .72-.22 1-.48l2.4-2.29 4.98 3.64c.91.5 1.55.24 1.8-.85l3.26-15.28c.32-1.37-.5-1.9-1.38-1.58L1.4 9.6C.06 10.14.08 10.9 1.16 11.24l4.99 1.56 11.6-7.3c.55-.34 1.05-.16.64.22L9.04 15.86z" />
        </svg>
    );
}

export function WhatsappIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M20.52 3.48A11.9 11.9 0 0012 0C5.37 0 .01 5.36.01 11.99c0 2.11.55 4.17 1.6 5.99L0 24l6.19-1.62a11.99 11.99 0 005.82 1.49h.01c6.63 0 11.99-5.36 11.99-11.99a11.9 11.9 0 00-3.49-8.4zm-3.1 10.42c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01a1.1 1.1 0 00-.8.37c-.27.3-1.05 1.02-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.11 3.22 5.11 4.5.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.11.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41z" />
        </svg>
    );
}

export function PhoneIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.79a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.29-1.3a2 2 0 012.11-.45c.89.35 1.83.6 2.79.72A2 2 0 0122 16.92z" />
        </svg>
    );
}

export function CheckIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

export function ChevronLeftIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

export function ChevronRightIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

export function CloseIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

export function MenuIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
        </svg>
    );
}

export function MessageIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z" />
        </svg>
    );
}

export function MapPinIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

export function FilterIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="14" y2="12" />
            <line x1="4" y1="18" x2="8" y2="18" />
        </svg>
    );
}

export function SearchIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" />
        </svg>
    );
}

export function ShieldIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M12 2l9 4v6c0 5-3.5 9.5-9 10-5.5-.5-9-5-9-10V6l9-4z" />
        </svg>
    );
}

export function HouseIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M3 10.5L12 3l9 7.5V21a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1z" />
        </svg>
    );
}

export function RulerIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M21 3l-6 6-3-3L3 15l6 6 12-12z" />
            <path d="M9 9l1.5 1.5M12 6l1.5 1.5M15 12l1.5 1.5M12 15l1.5 1.5" />
        </svg>
    );
}

export function BedIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M3 18v-8h10a4 4 0 014 4v4M3 22v-4M21 22v-4M21 14h-4" />
            <circle cx="7" cy="12" r="2" />
        </svg>
    );
}

export function BathIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M3 12h18v3a4 4 0 01-4 4H7a4 4 0 01-4-4z" />
            <path d="M6 12V6a2 2 0 012-2 2 2 0 012 2" />
            <path d="M3 19l-1 3M21 19l1 3" />
        </svg>
    );
}

export function StairsIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M3 20h4v-4h4v-4h4V8h4V4" />
        </svg>
    );
}

export function SortIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M3 6h18M6 12h12M10 18h4" />
        </svg>
    );
}

export function ListViewIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
    );
}

export function GridViewIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}

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

export function HeartIcon({
    filled = false,
    ...props
}: IconProps & { filled?: boolean }) {
    if (filled) {
        return (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
        );
    }
    return (
        <svg {...stroke} {...props}>
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
    );
}

/** Две колонки — «добавить к сравнению» (заглушка UI). */
export function CompareIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="3" y="4" width="7" height="16" rx="1.5" />
            <rect x="14" y="4" width="7" height="16" rx="1.5" />
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

export function WalletIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="2" y="6" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
            <circle cx="16" cy="14" r="1.2" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function SparklesIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M12 3l1.2 3.6L17 8l-3.8 1.4L12 13l-1.2-3.6L7 8l3.8-1.4L12 3z" />
            <path d="M19 13l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" />
            <path d="M6 14l.6 1.6L8 16l-1.4.5L6 18l-.5-1.5L4 16l1.5-.4L6 14z" />
        </svg>
    );
}

export function ArrowRightIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    );
}

export function ExpandIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
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

export function CameraIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
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

export function ClockIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

export function TargetIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    );
}

export function LightningIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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

export function LayersIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
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

/** Список / широкие карточки (GWD). */
export function ListViewIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
    );
}

/** Сетка / компактные карточки. */
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

export function StarIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );
}

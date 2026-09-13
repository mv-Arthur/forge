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

export function MaxIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 21 21" fill="currentColor" aria-hidden {...props}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.2592 19.9429C8.28796 19.9429 7.37188 19.6551 5.77953 18.504C4.7723 19.799 1.58279 20.8111 1.44368 19.0796C1.44368 17.7798 1.1559 16.6815 0.829751 15.4824C0.441262 14.0051 0 12.36 0 9.97627C0 4.28307 4.67159 0 10.2065 0C15.7462 0 20.0868 4.49411 20.0868 10.029C20.1054 15.4783 15.7085 19.9139 10.2592 19.9429ZM10.3408 4.92097C7.64528 4.78189 5.5445 6.64765 5.07927 9.57338C4.69556 11.9955 5.37664 14.9452 5.95698 15.0987C6.23517 15.1658 6.93543 14.5999 7.37188 14.1634C8.0936 14.662 8.93403 14.9614 9.80841 15.0315C12.6014 15.1659 14.9879 13.0396 15.1754 10.2497C15.2846 7.45383 13.1342 5.08578 10.3408 4.92578V4.92097Z"
            />
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

export function ChevronDownIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

export function ArrowUpIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M18.922 11.328a1.05 1.05 0 01-1.344 1.344L13.2 8.294V18.5a.95.95 0 11-1.9 0V8.294L6.922 12.672a1.05 1.05 0 11-1.344-1.344l6-6a.95.95 0 011.344 0z" />
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

export function SizeIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="5" y="7" width="14" height="10" rx="1" />
            <path d="M5 4h14M5 20h14" />
        </svg>
    );
}

export function AreaIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="4" y="5" width="16" height="14" rx="1.5" />
            <path d="M4 14h16" />
        </svg>
    );
}

export function DashedAreaIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect
                x="5"
                y="5"
                width="14"
                height="14"
                rx="2"
                strokeDasharray="2.4 2.2"
            />
        </svg>
    );
}

export function WardrobeIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="5" y="3" width="14" height="18" rx="1.2" />
            <path d="M12 3v18" />
            <circle cx="10" cy="12" r="0.7" fill="currentColor" stroke="none" />
            <circle cx="14" cy="12" r="0.7" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function TerraceIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M12 3c5 0 8.5 2.4 8.5 3.6-3.2 1.2-13.8 1.2-17 0C3.5 5.4 7 3 12 3z" />
            <path d="M12 6.6V20" />
            <path d="M7 20h10" />
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

export function InfoIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <circle cx="12" cy="8" r="0.8" fill="currentColor" stroke="none" />
        </svg>
    );
}

export function LayoutPlanIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="4" y="4" width="16" height="16" rx="1.5" />
            <path d="M4 14h16M12 14v6M12 4v6M8 4v4" />
        </svg>
    );
}

export function PercentIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <circle cx="7.5" cy="8" r="2.15" />
            <circle cx="16.5" cy="16" r="2.15" />
            <path d="M16.5 6.5L7.5 17.5" />
        </svg>
    );
}

export function SparklesIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M12 3l1.2 4.2L17 8.5l-3.8 1.3L12 14l-1.2-4.2L7 8.5l3.8-1.3z" />
            <path d="M18.5 14l.6 2 2 .6-2 .6-.6 2-.6-2-2-.6 2-.6z" />
        </svg>
    );
}

export function BuiltHousesIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M3 12.5L9 7l6 5.5V20H3z" />
            <path d="M12 11.5L18 6l4 5V20h-6" />
        </svg>
    );
}

export function ArrowUpRightIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M7 17L17 7" />
            <path d="M9 7h8v8" />
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

export function HeartIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M12 20s-8-5.8-8-10.4A4.6 4.6 0 0112 6a4.6 4.6 0 018 3.6C20 14.2 12 20 12 20z" />
        </svg>
    );
}

export function HeartSolidIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M12 21S3 14.2 3 8.8A5 5 0 0112 5.5 5 5 0 0121 8.8C21 14.2 12 21 12 21z" />
        </svg>
    );
}

export function ThumbUpIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M7 22H4a2 2 0 01-2-2v-9a2 2 0 012-2h3m5-6l3 6h5.2a2 2 0 011.95 2.45l-1.5 6A2 2 0 0018.7 21H9a2 2 0 01-2-2V9.6z" />
        </svg>
    );
}

export function ThumbUpSolidIcon(props: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M14.6 8.4V4.8A2.8 2.8 0 0011.8 2l-4 8.2V21h10.7a2.4 2.4 0 002.35-1.9l1.5-7.4A2.4 2.4 0 0020 8.4h-5.4zM2 10h4v11H2z" />
        </svg>
    );
}

export function TrashIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
    );
}

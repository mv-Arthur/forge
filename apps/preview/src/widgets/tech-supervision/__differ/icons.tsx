import type { ReactElement, SVGProps } from "react";
import type { TechSupervisionDifferId } from "../tech-supervision.types";

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

function ClientIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <circle cx="12" cy="8" r="3.2" />
            <path d="M5.5 19.2c.6-3.4 3.2-5.2 6.5-5.2s5.9 1.8 6.5 5.2" />
        </svg>
    );
}

function HiddenIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M4 12s3.2-6.2 8-6.2S20 12 20 12s-3.2 6.2-8 6.2S4 12 4 12Z" />
            <circle cx="12" cy="12" r="2.2" />
        </svg>
    );
}

function AcceptanceIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="m6.2 12.4 3.4 3.4 8.2-8.2" />
            <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="2" />
        </svg>
    );
}

function NormsIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="5" y="3.8" width="14" height="16.4" rx="1.6" />
            <path d="M8.2 9.2h7.6M8.2 12.4h7.6M8.2 15.6h4.6" />
        </svg>
    );
}

const ICONS: Record<
    TechSupervisionDifferId,
    (props: IconProps) => ReactElement
> = {
    client: ClientIcon,
    hidden: HiddenIcon,
    acceptance: AcceptanceIcon,
    norms: NormsIcon,
};

export function DifferIcon({
    id,
    className,
}: {
    id: TechSupervisionDifferId;
    className?: string;
}) {
    const Icon = ICONS[id];
    return <Icon className={className} />;
}

import type { ReactElement, SVGProps } from "react";
import type { PaintBenefitId } from "../finishing-paint.types";

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

function MaterialsIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M7 20.2c3.4-6.8 3.4-10.2 0-16.4" />
            <path d="M12 20.2c3.4-6.8 3.4-10.2 0-16.4" />
            <path d="M17 20.2c3.4-6.8 3.4-10.2 0-16.4" />
        </svg>
    );
}

function SpecIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="5" y="3.8" width="14" height="16.4" rx="1.6" />
            <path d="M8.2 9.2h7.6M8.2 12.4h7.6M8.2 15.6h4.6" />
            <path d="m8 5.6 1.2 1.2 2.2-2.4" />
        </svg>
    );
}

function EstimateIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="4.2" y="6" width="15.6" height="12" rx="2" />
            <path d="M4.2 10h15.6" />
            <path d="M8.2 14.2h3.4" />
        </svg>
    );
}

function PrepIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M4 16.5 14.2 6.3l3.5 3.5L7.5 20H4v-3.5Z" />
            <path d="M12.8 7.7 16.3 11.2" />
            <path d="M17.4 5.2a1.6 1.6 0 0 1 2.3 2.3" />
        </svg>
    );
}

const ICONS: Record<PaintBenefitId, (props: IconProps) => ReactElement> = {
    materials: MaterialsIcon,
    spec: SpecIcon,
    estimate: EstimateIcon,
    prep: PrepIcon,
};

export function PaintBenefitIcon({
    id,
    className,
}: {
    id: PaintBenefitId;
    className?: string;
}) {
    const Icon = ICONS[id];
    return <Icon className={className} />;
}

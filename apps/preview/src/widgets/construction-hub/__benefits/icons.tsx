import type { ReactElement, SVGProps } from "react";
import type { ConstructionBenefitId } from "../construction-hub.types";

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

function TermIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4l2.5 1.5" />
        </svg>
    );
}

function NoshrinkIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M5 19V9.2L12 4l7 5.2V19" />
            <path d="M9 19v-6h6v6" />
        </svg>
    );
}

function FactoryIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M4 20V10l5 3V10l5 3V8l6 4v8" />
            <path d="M4 20h16" />
        </svg>
    );
}

function WinterIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M12 3v18M5.6 6.5l12.8 11M5.6 17.5 18.4 6.5" />
        </svg>
    );
}

function LightIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M4 17.5h16M7 17.5V11l5-4 5 4v6.5" />
        </svg>
    );
}

function RangeIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="4" y="5" width="6.5" height="14" rx="1.2" />
            <rect x="13.5" y="5" width="6.5" height="14" rx="1.2" />
        </svg>
    );
}

function WarmIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M12 20a5 5 0 0 0 5-5c0-3-5-7.5-5-7.5S7 12 7 15a5 5 0 0 0 5 5Z" />
        </svg>
    );
}

function LocalIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z" />
            <circle cx="12" cy="11" r="1.8" />
        </svg>
    );
}

function SupplyIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="3.5" y="7" width="17" height="11" rx="2" />
            <path d="M3.5 11h17M8 7V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8V7" />
        </svg>
    );
}

function FinishIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M5 19h14M7 16 16.5 6.5a2.1 2.1 0 0 1 3 3L10 19H7v-3Z" />
        </svg>
    );
}

function BrickIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="3.5" y="5" width="17" height="14" rx="1" />
            <path d="M3.5 12h17M12 5v14M8 5v7M16 12v7" />
        </svg>
    );
}

function LineupIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M4 18h16M6 18V10l6-5 6 5v8" />
            <path d="M10 18v-5h4v5" />
        </svg>
    );
}

const ICONS: Record<
    ConstructionBenefitId,
    (props: IconProps) => ReactElement
> = {
    term: TermIcon,
    noshrink: NoshrinkIcon,
    factory: FactoryIcon,
    winter: WinterIcon,
    light: LightIcon,
    range: RangeIcon,
    warm: WarmIcon,
    local: LocalIcon,
    supply: SupplyIcon,
    finish: FinishIcon,
    brick: BrickIcon,
    lineup: LineupIcon,
};

export function BenefitIcon({ id }: { id: ConstructionBenefitId }) {
    const Icon = ICONS[id];
    return <Icon />;
}

import type { ReactElement, SVGProps } from "react";
import type { IndividualPlanningBenefitId } from "../individual-planning.types";

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

function ComplexIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M4 19V9.2L12 4l8 5.2V19" />
            <path d="M9 19v-6h6v6" />
            <path d="M4 19h16" />
        </svg>
    );
}

function EngineersIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <circle cx="12" cy="12" r="3.2" />
            <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2" />
            <path d="m6.1 6.1 1.6 1.6M16.3 16.3l1.6 1.6M16.3 7.7l1.6-1.6M6.1 17.9l1.6-1.6" />
        </svg>
    );
}

function SiteIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M4 17.5c1.8-1.2 3.4-1.8 5.2-.6 2.2 1.5 3.6 1.6 5.8.2 1.6-1 3.1-1.2 4.9-.3" />
            <path d="M4 13.2c1.8-1.2 3.4-1.8 5.2-.6 2.2 1.5 3.6 1.6 5.8.2 1.6-1 3.1-1.2 4.9-.3" />
            <path d="M12 4.5 8.2 8.4h7.6L12 4.5Z" />
        </svg>
    );
}

function BudgetIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="4.2" y="6" width="15.6" height="12" rx="2" />
            <path d="M4.2 10h15.6" />
            <path d="M8.2 14.2h3.4" />
        </svg>
    );
}

function VizIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M3.8 12s3.2-6.2 8.2-6.2S20.2 12 20.2 12s-3.2 6.2-8.2 6.2S3.8 12 3.8 12Z" />
            <circle cx="12" cy="12" r="2.4" />
        </svg>
    );
}

function SketchIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M5 19.2 14.8 9.4l3.8 3.8L8.8 23" />
            <path d="M13.6 8.2 16.4 5.4a2 2 0 0 1 2.8 0l1.4 1.4a2 2 0 0 1 0 2.8l-2.8 2.8" />
            <path d="M5 19.2 3.6 22.4 6.8 21" />
        </svg>
    );
}

function ArchiveIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="4" y="4.5" width="16" height="4.2" rx="1" />
            <path d="M5.2 8.7h13.6V18a1.6 1.6 0 0 1-1.6 1.6H6.8A1.6 1.6 0 0 1 5.2 18V8.7Z" />
            <path d="M10 13.2h4" />
        </svg>
    );
}

const ICONS: Record<
    IndividualPlanningBenefitId,
    (props: IconProps) => ReactElement
> = {
    complex: ComplexIcon,
    engineers: EngineersIcon,
    site: SiteIcon,
    budget: BudgetIcon,
    viz: VizIcon,
    sketch: SketchIcon,
    archive: ArchiveIcon,
};

export function BenefitIcon({
    id,
    className,
}: {
    id: IndividualPlanningBenefitId;
    className?: string;
}) {
    const Icon = ICONS[id];
    return <Icon className={className} />;
}

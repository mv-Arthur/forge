import type { ReactElement, SVGProps } from "react";
import type { BuildSupportMediaId } from "../build-support.types";

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

function CamerasIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M4.6 8.2h10.2a1.6 1.6 0 0 1 1.6 1.6v7.2a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 17V9.8a1.6 1.6 0 0 1 1.6-1.6Z" />
            <path d="m16.4 11.4 4.2-2.2v8.2l-4.2-2.2" />
            <circle cx="9.7" cy="13.4" r="2.1" />
        </svg>
    );
}

function ReportsIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <circle cx="12" cy="12" r="8.2" />
            <circle cx="12" cy="12" r="3.1" />
        </svg>
    );
}

function DailyIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <circle cx="12" cy="12" r="8.2" />
            <path d="M12 7.4V12l3.2 2.2" />
        </svg>
    );
}

const ICONS: Record<BuildSupportMediaId, (props: IconProps) => ReactElement> = {
    cameras: CamerasIcon,
    reports: ReportsIcon,
    daily: DailyIcon,
};

export function MediaIcon({
    id,
    className,
}: {
    id: BuildSupportMediaId;
    className?: string;
}) {
    const Icon = ICONS[id];
    return <Icon className={className} />;
}

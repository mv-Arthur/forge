import type { ReactElement, SVGProps } from "react";
import type { SiteSurveyDeliverableId } from "../site-survey.types";

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

function ReportIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M5.5 7.5h13v11.2a1.6 1.6 0 0 1-1.6 1.6H7.1a1.6 1.6 0 0 1-1.6-1.6V7.5Z" />
            <path d="M8.2 7.5V5.8A1.8 1.8 0 0 1 10 4h4a1.8 1.8 0 0 1 1.8 1.8V7.5" />
            <circle cx="12" cy="13.2" r="2.2" />
            <path d="M12 15.4v2.2" />
        </svg>
    );
}

function ChecklistIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="5" y="3.8" width="14" height="16.4" rx="1.6" />
            <path d="M8.2 9.2h7.6M8.2 12.4h7.6M8.2 15.6h4.6" />
            <path d="m8 5.6 1.2 1.2 2.2-2.4" />
        </svg>
    );
}

function AdviceIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <path d="M12 20.4s-6.4-4.2-6.4-9.2A6.4 6.4 0 0 1 12 4.8a6.4 6.4 0 0 1 6.4 6.4c0 5-6.4 9.2-6.4 9.2Z" />
            <circle cx="12" cy="11.2" r="2.1" />
        </svg>
    );
}

function EstimateIcon(props: IconProps) {
    return (
        <svg {...stroke} {...props}>
            <rect x="4.4" y="3.8" width="15.2" height="16.4" rx="1.8" />
            <path d="M8 8.2h8M8 12h8M8 15.8h4.8" />
        </svg>
    );
}

const ICONS: Record<
    SiteSurveyDeliverableId,
    (props: IconProps) => ReactElement
> = {
    report: ReportIcon,
    checklist: ChecklistIcon,
    advice: AdviceIcon,
    estimate: EstimateIcon,
};

export function DeliverableIcon({
    id,
    className,
}: {
    id: SiteSurveyDeliverableId;
    className?: string;
}) {
    const Icon = ICONS[id];
    return <Icon className={className} />;
}

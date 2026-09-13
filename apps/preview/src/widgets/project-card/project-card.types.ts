import type { EnrichedBuiltObject, MergedProject } from "@/types/catalog";

export type ProjectCardLayout = "wide" | "grid" | "similar";

export type ProjectCardMetricIcon =
    | "pin"
    | "size"
    | "area"
    | "bed"
    | "bath";

export type ProjectCardMetric = {
    icon: ProjectCardMetricIcon;
    label: string;
};

type ProjectCardBase = {
    priority?: boolean;
    layout?: ProjectCardLayout;
};

export type ProjectCardProps = ProjectCardBase &
    (
        | { project: MergedProject; object?: undefined }
        | { object: EnrichedBuiltObject; project?: undefined }
    );

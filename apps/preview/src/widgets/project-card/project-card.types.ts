import type { MergedProject } from "@/types/catalog";

export type ProjectCardLayout = "wide" | "grid";

export type ProjectCardProps = {
    project: MergedProject;
    priority?: boolean;
    layout?: ProjectCardLayout;
};

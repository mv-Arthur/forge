import type { ReactNode } from "react";
import type { MergedProject, ShowcasePayload } from "@/types/catalog";

export type ProjectDetailIndividualProps = {
    project: MergedProject;
    showcase: ShowcasePayload;
    architectWorks: MergedProject[];
    architectMore: number;
    leadForm: ReactNode;
};

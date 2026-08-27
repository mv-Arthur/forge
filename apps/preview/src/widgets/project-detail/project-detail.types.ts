import type { ReactNode } from "react";
import type { EnrichedBuiltObject, MergedProject } from "@/types/catalog";

export type ProjectDetailProps = {
    project: MergedProject;
    similar: MergedProject[];
    relatedBuilt: EnrichedBuiltObject[];
    leadForm: ReactNode;
    similarCarousel: ReactNode;
};

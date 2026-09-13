import type { ReactNode } from "react";
import type {
    EnrichedBuiltObject,
    MergedProject,
    ShowcasePayload,
} from "@/types/catalog";

export type ProjectDetailIndividualProps = {
    project: MergedProject;
    showcase: ShowcasePayload;
    similar: MergedProject[];
    relatedBuilt: EnrichedBuiltObject[];
    leadForm: ReactNode;
    similarCarousel: ReactNode;
};

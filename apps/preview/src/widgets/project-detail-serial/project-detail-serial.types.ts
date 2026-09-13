import type { ReactNode } from "react";
import type {
    EnrichedBuiltObject,
    MergedProject,
    ShowcasePayload,
} from "@/types/catalog";

export type ProjectDetailSerialProps = {
    project: MergedProject;
    showcase: ShowcasePayload;
    similar: MergedProject[];
    relatedBuilt: EnrichedBuiltObject[];
    leadForm: ReactNode;
    similarCarousel: ReactNode;
    startVisit?: ReactNode;
    startQuote?: ReactNode;
};

import type {
    EnrichedBuiltObject,
    MergedProject,
    ShowcasePayload,
} from "@/types/catalog";

export type ProjectDetailSerialProps = {
    project: MergedProject;
    showcase: ShowcasePayload;
    relatedBuilt: EnrichedBuiltObject[];
    similar: MergedProject[];
};

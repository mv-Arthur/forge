import type { EnrichedBuiltObject, MergedProject } from "@/types/catalog";

export type ProjectDetailProps = {
    project: MergedProject;
    relatedBuilt: EnrichedBuiltObject[];
};

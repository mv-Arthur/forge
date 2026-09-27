"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type {
    EnrichedBuiltObject,
    MergedProject,
    ShowcasePayload,
} from "./catalog.types";
import {
    getArchitectWorks,
    getProject,
    getRelatedBuiltObjects,
    getShowcase,
    getSimilarProjects,
} from "@/server/catalog/data";

export async function getProjectPage(slug: string): Promise<
    ActionResult<{
        project: MergedProject | null;
        similar: MergedProject[];
        relatedBuilt: EnrichedBuiltObject[];
        showcase: ShowcasePayload | null;
        architectWorks: MergedProject[];
        architectMore: number;
    }>
> {
    const project = getProject(slug) ?? null;
    if (!project) {
        return {
            success: true,
            project: null,
            similar: [],
            relatedBuilt: [],
            showcase: null,
            architectWorks: [],
            architectMore: 0,
        };
    }
    const architect = getArchitectWorks(slug, 3);
    return {
        success: true,
        project,
        similar: getSimilarProjects(slug, 6),
        relatedBuilt: getRelatedBuiltObjects(slug, 6),
        showcase: getShowcase(slug),
        architectWorks: architect.items,
        architectMore: architect.moreCount,
    };
}

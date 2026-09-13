"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type {
    EnrichedBuiltObject,
    MergedProject,
    ShowcasePayload,
} from "./catalog.types";
import {
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
        };
    }
    return {
        success: true,
        project,
        similar: getSimilarProjects(slug, 6),
        relatedBuilt: getRelatedBuiltObjects(slug, 6),
        showcase: getShowcase(slug),
    };
}

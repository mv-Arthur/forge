"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { EnrichedBuiltObject, MergedProject } from "./catalog.types";
import {
    getProject,
    getRelatedBuiltObjects,
    getSimilarProjects,
} from "@/server/catalog/data";

export async function getProjectPage(slug: string): Promise<
    ActionResult<{
        project: MergedProject | null;
        similar: MergedProject[];
        relatedBuilt: EnrichedBuiltObject[];
    }>
> {
    const project = getProject(slug) ?? null;
    if (!project) {
        return { success: true, project: null, similar: [], relatedBuilt: [] };
    }
    return {
        success: true,
        project,
        similar: getSimilarProjects(slug, 6),
        relatedBuilt: getRelatedBuiltObjects(slug, 6),
    };
}

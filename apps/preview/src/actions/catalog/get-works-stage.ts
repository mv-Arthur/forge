"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { WorksStagePayload } from "./catalog.types";
import {
    getWorksStage as readWorksStage,
    getWorksStageFirstHref,
    listWorksStageParams,
} from "@/server/catalog/stages";

export async function getWorksStage(
    tech: string,
    section: string,
    subsection: string,
): Promise<ActionResult<{ stage: WorksStagePayload | undefined }>> {
    return { success: true, stage: readWorksStage(tech, section, subsection) };
}

export async function getWorksStageIndex(
    tech: string,
): Promise<ActionResult<{ href: string | undefined }>> {
    return { success: true, href: getWorksStageFirstHref(tech) };
}

export async function listWorksStagePaths(): Promise<
    ActionResult<{
        paths: { tech: string; section: string; subsection: string }[];
    }>
> {
    return { success: true, paths: listWorksStageParams() };
}

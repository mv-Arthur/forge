"use server";

import "server-only";
import type { ActionResult } from "@/types/action";
import type { CatalogStats, MergedProject, Technology } from "./catalog.types";
import {
    getCatalogProjects,
    getCatalogStats,
    getTechnologiesInCatalog,
} from "@/server/catalog/data";

export async function listCatalogProjects(): Promise<
    ActionResult<{
        projects: MergedProject[];
        stats: CatalogStats;
        techs: Technology[];
    }>
> {
    return {
        success: true,
        projects: getCatalogProjects(),
        stats: getCatalogStats(),
        techs: getTechnologiesInCatalog(),
    };
}

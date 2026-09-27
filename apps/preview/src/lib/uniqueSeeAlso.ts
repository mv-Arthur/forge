import { COLLECTION_ORDER, projectInCollection } from "./collections";
import {
    CATALOG_BATH_TILE,
    COLLECTION_TITLE,
    HUB_INDIVIDUAL_TITLE,
} from "./copy";
import { routes } from "./routes";
import type { ProjectClass } from "@/types/catalog";

export type SeeAlsoIcon = "plan" | "house";

export type SeeAlsoLink = {
    href: string;
    label: string;
    icon: SeeAlsoIcon;
};

export function uniqueSeeAlso(project: {
    projectClass: ProjectClass;
    features?: string[];
    categories?: string[];
}): SeeAlsoLink[] {
    const links: SeeAlsoLink[] = [];
    if (project.projectClass === "bath") {
        links.push({
            href: routes.projects({ kind: "bath" }),
            label: CATALOG_BATH_TILE,
            icon: "plan",
        });
    } else {
        links.push({
            href: routes.projects({ kind: "individual" }),
            label: HUB_INDIVIDUAL_TITLE,
            icon: "plan",
        });
    }
    for (const id of COLLECTION_ORDER) {
        if (projectInCollection(project, id)) {
            links.push({
                href: routes.projects({ collection: id }),
                label: COLLECTION_TITLE[id],
                icon: "house",
            });
        }
        if (links.length >= 2) break;
    }
    return links;
}

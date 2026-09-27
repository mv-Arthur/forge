import "server-only";
import {
    CTA_MORE,
    HUB_TECH_LEAD,
    HUB_TECH_TITLE,
    METHODS_HUB_LEAD,
    TECH_SECTION_HEADING,
} from "@/lib/copy";
import { hasUsablePhoto } from "@/lib/names";
import { routes } from "@/lib/routes";
import { TECH_DISPLAY_ORDER } from "@/lib/technology";
import { getCatalogProjects } from "@/server/catalog/data";
import type { MethodsHubPayload } from "@/types/catalog";

export function getMethodsHub(): MethodsHubPayload {
    const listed = getCatalogProjects();
    const usedHeroes = new Set<string>();
    const cards = TECH_DISPLAY_ORDER.flatMap((tech) => {
        const ofTech = listed.filter((p) => p.technologies.includes(tech));
        if (ofTech.length === 0) return [];
        const photos = ofTech
            .map((p) => p.heroImage || p.renders[0])
            .filter(hasUsablePhoto);
        const image =
            photos.find((url) => !usedHeroes.has(url)) ??
            photos[0] ??
            `/media/tech/${tech}/house.png`;
        usedHeroes.add(image);
        return [
            {
                tech,
                title: HUB_TECH_TITLE[tech],
                description: HUB_TECH_LEAD[tech],
                href: routes.projects({ tech }),
                image,
                count: ofTech.length,
            },
        ];
    });

    return {
        heading: TECH_SECTION_HEADING,
        lead: METHODS_HUB_LEAD,
        moreLabel: CTA_MORE,
        cards,
    };
}

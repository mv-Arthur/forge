import "server-only";
import {
    CONSTRUCTION_CRUMB,
    CONSTRUCTION_CTA,
    CONSTRUCTION_LEAD,
    CONSTRUCTION_TITLE,
    HUB_TECH_LEAD,
    HUB_TECH_TITLE,
    LINE_LEAD,
    LINE_TITLE,
} from "@/lib/copy";
import { projectClass } from "@/lib/catalogFilter";
import { groupByLine } from "@/lib/lines";
import { hasUsablePhoto } from "@/lib/names";
import { routes } from "@/lib/routes";
import {
    projectInFamily,
    techsForFamily,
    worksGroupForFamily,
    type TechFamily,
} from "@/lib/techFamily";
import type { ConstructionHubPayload } from "@/types/services";
import { getCatalogProjects } from "@/server/catalog/data";

const SERIAL_LIMIT = 8;
const INDIVIDUAL_LIMIT = 4;

const HERO_FALLBACK: Record<TechFamily, string> = {
    wood: "/media/tech/frame/house.png",
    stone: "/media/tech/gas_concrete/house.png",
};

function filledFirst<T extends { detailFilled: boolean }>(items: T[]): T[] {
    return [...items].sort(
        (a, b) => Number(b.detailFilled) - Number(a.detailFilled)
    );
}

export function getConstructionHub(
    family: TechFamily
): ConstructionHubPayload {
    const listed = getCatalogProjects().filter((project) =>
        projectInFamily(project, family)
    );
    const serial = filledFirst(
        listed.filter((project) => projectClass(project) === "serial")
    );
    const individual = filledFirst(
        listed.filter((project) => projectClass(project) === "individual")
    );

    const techs = techsForFamily(family).flatMap((tech) => {
        const ofTech = listed.filter((p) => p.technologies.includes(tech));
        const image =
            ofTech.find((p) => hasUsablePhoto(p.heroImage))?.heroImage ??
            `/media/tech/${tech}/house.png`;
        if (ofTech.length === 0) return [];
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

    const lines = groupByLine(serial).flatMap(({ id, projects }) => {
        const image = projects.find((p) => hasUsablePhoto(p.heroImage))
            ?.heroImage;
        if (!image) return [];
        return [
            {
                id,
                title: LINE_TITLE[id],
                lead: LINE_LEAD[id],
                href: routes.projects({ tech: family, line: id }),
                image,
            },
        ];
    });

    const heroImage =
        serial.find((p) => hasUsablePhoto(p.heroImage))?.heroImage ??
        individual.find((p) => hasUsablePhoto(p.heroImage))?.heroImage ??
        HERO_FALLBACK[family];

    return {
        family,
        crumb: CONSTRUCTION_CRUMB[family],
        title: CONSTRUCTION_TITLE[family],
        lead: CONSTRUCTION_LEAD[family],
        ctaLabel: CONSTRUCTION_CTA[family],
        catalogHref: routes.projects({ tech: family }),
        heroImage,
        techs,
        stagesHref: routes.worksStages(worksGroupForFamily(family)),
        serial: serial.slice(0, SERIAL_LIMIT),
        serialAllHref: routes.projects({ tech: family, kind: "serial" }),
        lines,
        individual: individual.slice(0, INDIVIDUAL_LIMIT),
        individualAllHref: routes.projects({
            tech: family,
            kind: "individual",
        }),
    };
}

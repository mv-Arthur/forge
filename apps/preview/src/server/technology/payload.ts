import "server-only";
import {
    CTA_MORE,
    ENGINEERING_EXTERNAL_NAV,
    ENGINEERING_HEATING_NAV,
    ENGINEERING_PLUMBING_NAV,
    ENGINEERING_VENTILATION_NAV,
    NAV_BUILD,
    TECH_HUB_ARTICLES_HEADING,
    TECH_HUB_CALC_HEADING,
    TECH_HUB_CALC_LEAD,
    TECH_HUB_CALC_PROJECT,
    TECH_HUB_CHECKLIST_CTA,
    TECH_HUB_CHECKLIST_LEAD,
    TECH_HUB_CHECKLIST_TITLE,
    TECH_HUB_FAQ,
    TECH_HUB_FAQ_HEADING,
    TECH_HUB_HEADING,
    TECH_HUB_HEAT_CARD_TITLE,
    TECH_HUB_LEAD,
    TECH_HUB_LEAD_HEADING,
    TECH_HUB_LEAD_TEXT,
    TECH_HUB_STAGES_ENG_TITLE,
    TECH_HUB_STAGES_HEADING,
    TECH_HUB_STAGES_MAIN_TITLE,
    TECH_HUB_TECHS_HEADING,
    TECH_HUB_TECH_TITLE,
} from "@/lib/copy";
import { heatEnvelope } from "@/lib/serialShowcase";
import { hasUsablePhoto } from "@/lib/names";
import { routes } from "@/lib/routes";
import { TECH_DISPLAY_ORDER } from "@/lib/technology";
import { getCatalogProjects } from "@/server/catalog/data";
import { listWorksStageNav } from "@/server/catalog/stages";
import type { Technology } from "@/types/catalog";
import type { TechnologyHubPayload } from "@/types/technology";

const MAIN_STAGE_IDS = [
    "podgotovka",
    "fundament",
    "steny",
    "krovlya",
    "okna",
    "poly",
    "otdelka-sten",
    "fasadnaya-otdelka",
    "naruzhnye-seti",
];

function techImage(id: Technology): string {
    return `/media/tech/${id}/house.png`;
}

function techCards(listed: ReturnType<typeof getCatalogProjects>) {
    const used = new Set<string>();
    return TECH_DISPLAY_ORDER.map((tech) => {
        const ofTech = listed.filter((p) => p.technologies.includes(tech));
        const unique = ofTech.find(
            (p) => hasUsablePhoto(p.heroImage) && !used.has(p.heroImage),
        )?.heroImage;
        const fallback = ofTech.find((p) =>
            hasUsablePhoto(p.heroImage),
        )?.heroImage;
        const image = unique ?? fallback ?? techImage(tech);
        used.add(image);
        return {
            id: tech,
            title: TECH_HUB_TECH_TITLE[tech],
            href: routes.projects({ tech }),
            image,
        };
    });
}

export function getTechnologyHub(): TechnologyHubPayload {
    const listed = getCatalogProjects();
    const nav = listWorksStageNav("stone");
    const orderedMain = MAIN_STAGE_IDS.map((id) =>
        nav.find((item) => item.id === id),
    ).filter((item): item is NonNullable<typeof item> => item != null);

    return {
        crumb: NAV_BUILD,
        heading: TECH_HUB_HEADING,
        lead: TECH_HUB_LEAD,
        techsHeading: TECH_HUB_TECHS_HEADING,
        techs: [
            ...techCards(listed),
            {
                id: "heat",
                title: TECH_HUB_HEAT_CARD_TITLE,
                href: "#heat-calc",
                image: "/media/stages/interior.jpg",
            },
        ],
        stagesHeading: TECH_HUB_STAGES_HEADING,
        stages: [
            {
                id: "main",
                title: TECH_HUB_STAGES_MAIN_TITLE,
                image: "/media/stages/plot.jpg",
                moreLabel: CTA_MORE,
                moreHref: routes.worksStagesHub,
                links: orderedMain.map((item) => ({
                    title: item.title,
                    href: item.href,
                })),
            },
            {
                id: "engineering",
                title: TECH_HUB_STAGES_ENG_TITLE,
                image: "/media/stages/site.jpg",
                moreLabel: CTA_MORE,
                moreHref: routes.service("engineering"),
                links: [
                    {
                        title: ENGINEERING_HEATING_NAV,
                        href: routes.service("engineering/heating"),
                    },
                    {
                        title: ENGINEERING_EXTERNAL_NAV,
                        href: routes.service("engineering/external"),
                    },
                    {
                        title: ENGINEERING_VENTILATION_NAV,
                        href: routes.service("engineering/ventilation"),
                    },
                    {
                        title: ENGINEERING_PLUMBING_NAV,
                        href: routes.service("engineering/plumbing"),
                    },
                ],
            },
            {
                id: "checklist",
                title: TECH_HUB_CHECKLIST_TITLE,
                image: "/media/stages/facade.jpg",
                moreLabel: CTA_MORE,
                moreHref: "#lead",
                links: [],
                lead: TECH_HUB_CHECKLIST_LEAD,
                ctaLabel: TECH_HUB_CHECKLIST_CTA,
                ctaHref: "#lead",
            },
        ],
        articlesHeading: TECH_HUB_ARTICLES_HEADING,
        calcHeading: TECH_HUB_CALC_HEADING,
        calcLead: TECH_HUB_CALC_LEAD,
        calcCta: CTA_MORE,
        calcEnvelope: heatEnvelope({
            area: 150,
            floors: "2",
            dimensions: "10x12",
        }),
        calcProjectName: TECH_HUB_CALC_PROJECT,
        faqHeading: TECH_HUB_FAQ_HEADING,
        faq: TECH_HUB_FAQ,
        leadHeading: TECH_HUB_LEAD_HEADING,
        leadText: TECH_HUB_LEAD_TEXT,
    };
}

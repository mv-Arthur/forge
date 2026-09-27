import {
    isAllCatalogKinds,
    projectClass,
    type CatalogKind,
} from "@/lib/catalogFilter";
import {
    HIT_SALES,
    HIT_SALES_LEAD,
    LINE_LEAD,
    LINE_TITLE,
    POPULAR_BATH_LEAD,
    POPULAR_BATH_TAB,
    POPULAR_INDIVIDUAL_LEAD,
    POPULAR_INDIVIDUAL_TAB,
} from "@/lib/copy";
import { groupByLine } from "@/lib/lines";

export type CatalogSectionProject = {
    slug: string;
    projectClass: CatalogKind;
    detailFilled: boolean;
};

export type CatalogListSection<
    T extends CatalogSectionProject = CatalogSectionProject,
> = {
    key: string;
    title: string;
    lead: string;
    projects: T[];
};

const HIT_CLASS_ORDER: Record<CatalogKind, number> = {
    serial: 0,
    individual: 1,
    bath: 2,
};

export function pinFilled<T extends { detailFilled: boolean }>(
    projects: T[]
): T[] {
    const hits = projects.filter((p) => p.detailFilled);
    const rest = projects.filter((p) => !p.detailFilled);
    return hits.length ? [...hits, ...rest] : projects;
}

function floatHitSections<
    T extends { projects: Array<{ detailFilled: boolean }> },
>(sections: T[]): T[] {
    const hits: T[] = [];
    const rest: T[] = [];
    for (const section of sections) {
        if (section.projects.some((p) => p.detailFilled)) hits.push(section);
        else rest.push(section);
    }
    return [...hits, ...rest];
}

function typeSections<T extends CatalogSectionProject>(
    listed: T[]
): CatalogListSection<T>[] {
    const serial = listed.filter((p) => projectClass(p) === "serial");
    const individual = listed.filter((p) => projectClass(p) === "individual");
    const bath = listed.filter((p) => projectClass(p) === "bath");
    const sections: CatalogListSection<T>[] = groupByLine(serial).map(
        (group) => ({
            key: `line:${group.id}`,
            title: LINE_TITLE[group.id],
            lead: LINE_LEAD[group.id],
            projects: pinFilled(group.projects),
        })
    );
    if (individual.length) {
        sections.push({
            key: "individual",
            title: POPULAR_INDIVIDUAL_TAB,
            lead: POPULAR_INDIVIDUAL_LEAD,
            projects: pinFilled(individual),
        });
    }
    if (bath.length) {
        sections.push({
            key: "bath",
            title: POPULAR_BATH_TAB,
            lead: POPULAR_BATH_LEAD,
            projects: pinFilled(bath),
        });
    }
    return sections;
}

export function buildCatalogSections<T extends CatalogSectionProject>(
    sorted: T[],
    kind: CatalogKind[]
): CatalogListSection<T>[] {
    if (isAllCatalogKinds(kind)) {
        const hits = sorted
            .filter((p) => p.detailFilled)
            .sort(
                (a, b) =>
                    HIT_CLASS_ORDER[a.projectClass] -
                    HIT_CLASS_ORDER[b.projectClass]
            );
        const listed = sorted.filter((p) => !p.detailFilled);
        const rest = typeSections(listed);
        if (!hits.length) return rest;
        return [
            {
                key: "hits",
                title: HIT_SALES,
                lead: HIT_SALES_LEAD,
                projects: hits,
            },
            ...rest,
        ];
    }
    return floatHitSections(typeSections(sorted));
}

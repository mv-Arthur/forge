import "server-only";
import stagesJson from "@data/fixtures/works-stages.json";
import { routes } from "@/lib/routes";
import type {
    WorksStageNavItem,
    WorksStagePayload,
    WorksStageTag,
} from "@/types/catalog";

type FixtureTag = {
    id: string;
    title: string;
    photos: string[];
};

type FixtureSubsection = {
    id: string;
    title: string;
    tags: FixtureTag[];
};

type FixtureSection = {
    id: string;
    title: string;
    secretVideo?: string;
    subsections: FixtureSubsection[];
};

type FixtureTech = {
    id: string;
    title: string;
    sections: FixtureSection[];
};

type FixtureFile = {
    techs: FixtureTech[];
};

const file = stagesJson as FixtureFile;

function hrefFor(
    tech: string,
    section: string,
    subsection: string,
    tags: FixtureTag[],
): string | null {
    if (tags.length === 0) return null;
    return routes.worksStages(tech, section, subsection);
}

export function listWorksStageNav(
    tech: string,
): { id: string; title: string; href: string }[] {
    const row = file.techs.find((item) => item.id === tech);
    if (!row) return [];
    const out: { id: string; title: string; href: string }[] = [];
    for (const section of row.sections) {
        for (const subsection of section.subsections) {
            const href = hrefFor(
                row.id,
                section.id,
                subsection.id,
                subsection.tags,
            );
            if (href) {
                out.push({
                    id: section.id,
                    title: section.title,
                    href,
                });
                break;
            }
        }
    }
    return out;
}

export function getWorksStageFirstHref(tech: string): string | undefined {
    const row = file.techs.find((item) => item.id === tech);
    if (!row) return undefined;
    for (const section of row.sections) {
        for (const subsection of section.subsections) {
            const href = hrefFor(
                row.id,
                section.id,
                subsection.id,
                subsection.tags,
            );
            if (href) return href;
        }
    }
    return undefined;
}

export function listWorksStageParams(): {
    tech: string;
    section: string;
    subsection: string;
}[] {
    const out: { tech: string; section: string; subsection: string }[] = [];
    for (const tech of file.techs) {
        for (const section of tech.sections) {
            for (const subsection of section.subsections) {
                if (subsection.tags.length === 0) continue;
                out.push({
                    tech: tech.id,
                    section: section.id,
                    subsection: subsection.id,
                });
            }
        }
    }
    return out;
}

export function getWorksStage(
    tech: string,
    section: string,
    subsection: string,
): WorksStagePayload | undefined {
    const row = file.techs.find((item) => item.id === tech);
    if (!row) return undefined;
    const currentSection = row.sections.find((item) => item.id === section);
    if (!currentSection) return undefined;
    const currentSub = currentSection.subsections.find(
        (item) => item.id === subsection,
    );
    if (!currentSub || currentSub.tags.length === 0) return undefined;

    const menu: WorksStageNavItem[] = row.sections.map((item) => {
        const first = item.subsections.find((sub) => sub.tags.length > 0);
        return {
            id: item.id,
            title: item.title,
            href: first
                ? hrefFor(row.id, item.id, first.id, first.tags)
                : null,
            current: item.id === section,
        };
    });

    const chips: WorksStageNavItem[] = currentSection.subsections.map(
        (item) => ({
            id: item.id,
            title: item.title,
            href: hrefFor(row.id, currentSection.id, item.id, item.tags),
            current: item.id === subsection,
        }),
    );

    const tags: WorksStageTag[] = currentSub.tags.map((tag) => ({
        id: tag.id,
        title: tag.title,
        photos: tag.photos,
    }));

    return {
        techId: row.id,
        techTitle: row.title,
        sectionId: currentSection.id,
        sectionTitle: currentSection.title,
        subsectionId: currentSub.id,
        subsectionTitle: currentSub.title,
        secretVideo: currentSection.secretVideo || null,
        menu,
        chips,
        tags,
    };
}

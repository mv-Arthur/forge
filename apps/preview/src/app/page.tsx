import { listCatalogProjects } from "@/actions/catalog/list-projects";
import { listListedObjects } from "@/actions/catalog/list-objects";
import { getHero } from "@/actions/hero/get-hero";
import { unwrapAction } from "@/types/action";
import { projectIsIndividual } from "@/lib/catalogFilter";
import { settings } from "@/lib/settings";
import type { Technology } from "@/types/catalog";
import { HeroContainer } from "@/widgets/hero/hero.container";
import { HomeLead } from "@/widgets/home-lead/home-lead";
import {
    BUILT_STAT_BUILDING,
    BUILT_STAT_STANDING,
    BUILT_STAT_YEARS,
    LEAD_SUBMIT,
} from "@/lib/copy";
import { HomeBlog } from "@/widgets/home-blog/home-blog";
import { HomeBuiltContainer } from "@/widgets/home-built/home-built.container";
import { buildBuiltStripItems } from "@/widgets/home-built/lib/items";
import { HomeCollectionsContainer } from "@/widgets/home-collections/home-collections.container";
import { buildCollectionItems } from "@/widgets/home-collections/lib/content";
import { HomeServices } from "@/widgets/home-services/home-services";
import { HomeStagesContainer } from "@/widgets/home-stages/home-stages.container";
import { HomeTechContainer } from "@/widgets/home-tech/home-tech.container";
import { PopularProjectsContainer } from "@/widgets/popular-projects/popular-projects.container";
import { ProjectCard } from "@/widgets/project-card/project-card";
import { LeadFormContainer } from "@/widgets/lead-form/lead-form.container";

export const metadata = {
    title: "Новый Коттедж — дома под ключ в СПб и Ленобласти",
};

const TECHS: Technology[] = [
    "gas_concrete",
    "brick",
    "frame",
    "sip",
    "fachwerk",
];

export default async function HomePage() {
    const catalog = unwrapAction(await listCatalogProjects());
    const listed = unwrapAction(await listListedObjects());
    const hero = unwrapAction(await getHero());
    const popular = catalog.projects.slice(0, 4);
    const objects = listed.objects;
    const individualProjects = catalog.projects
        .filter(projectIsIndividual)
        .slice(0, 4);
    const techCounts = TECHS.map((t) => ({
        tech: t,
        count: catalog.projects.filter((p) => p.technologies.includes(t))
            .length,
    })).filter((row) => row.count > 0);
    const collections = buildCollectionItems(catalog.projects);
    const builtCount = objects.filter((o) => o.status === "built").length;
    const buildingCount = objects.filter(
        (o) => o.status === "in-progress"
    ).length;
    const sinceYears = new Date().getFullYear() - settings.foundedYear;
    const builtStats = [
        ...(builtCount > 0
            ? [{ value: String(builtCount), hint: BUILT_STAT_STANDING }]
            : []),
        ...(buildingCount > 0
            ? [{ value: String(buildingCount), hint: BUILT_STAT_BUILDING }]
            : []),
        ...(sinceYears > 0
            ? [{ value: String(sinceYears), hint: BUILT_STAT_YEARS }]
            : []),
    ];
    const builtItems = buildBuiltStripItems(objects);

    return (
        <main className="pb-16 md:pb-0">
            <section data-section="hero">
                <HeroContainer payload={hero.payload} />
            </section>
            <PopularProjectsContainer
                serial={
                    <div className="grid gap-6 sm:grid-cols-2">
                        {popular.map((p, i) => (
                            <ProjectCard
                                key={p.slug}
                                project={p}
                                layout="grid"
                                priority={i < 2}
                            />
                        ))}
                    </div>
                }
                individual={
                    individualProjects.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2">
                            {individualProjects.map((p) => (
                                <ProjectCard key={p.slug} project={p} />
                            ))}
                        </div>
                    ) : null
                }
            />
            <HomeTechContainer techCounts={techCounts} />
            <HomeCollectionsContainer items={collections} />
            <HomeServices officeHoursLabel={settings.officeHoursLabel} />
            <HomeBuiltContainer items={builtItems} stats={builtStats} />
            <HomeBlog />
            <HomeStagesContainer />
            <HomeLead
                telegram={settings.telegram}
                max={settings.max}
                form={
                    <LeadFormContainer
                        source="home-lead"
                        layout="home"
                        ctaLabel={LEAD_SUBMIT}
                    />
                }
            />
        </main>
    );
}

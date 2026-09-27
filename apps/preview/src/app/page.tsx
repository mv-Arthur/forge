import { listCatalogProjects } from "@/actions/catalog/list-projects";
import { listListedObjects } from "@/actions/catalog/list-objects";
import { getHero } from "@/actions/hero/get-hero";
import { getHomeSlots } from "@/actions/home/get-home-slots";
import { unwrapAction } from "@/types/action";
import { slotUrl } from "@/lib/homeSlots";
import { BLOG_ITEMS } from "@/widgets/home-blog/lib/content";
import { STAGE_ITEMS } from "@/widgets/home-stages/lib/content";
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
import styles from "./page.module.css";

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
    const { projects: catalogProjects } = unwrapAction(
        await listCatalogProjects()
    );
    const { objects } = unwrapAction(await listListedObjects());
    const { payload: heroPayload } = unwrapAction(await getHero());
    const { slots } = unwrapAction(await getHomeSlots());
    const popular = catalogProjects.slice(0, 4);
    const individualProjects = catalogProjects
        .filter(projectIsIndividual)
        .slice(0, 4);
    const techCounts = TECHS.map((t) => ({
        tech: t,
        count: catalogProjects.filter((p) => p.technologies.includes(t)).length,
    })).filter((row) => row.count > 0);
    const collections = buildCollectionItems(catalogProjects, slots);
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
    const builtItems = buildBuiltStripItems(objects, slots);
    const blogItems = BLOG_ITEMS.map((item, index) => ({
        ...item,
        image: slotUrl(slots, `blog.${index}`) || item.image,
    }));
    const stageItems = STAGE_ITEMS.map((item) => ({
        ...item,
        image: slotUrl(slots, `stages.${item.id}`) || item.image,
    }));

    return (
        <main className={styles.main}>
            <section data-section="hero">
                <HeroContainer payload={heroPayload} slots={slots} />
            </section>
            <PopularProjectsContainer
                serial={
                    <>
                        {popular.map((p, i) => (
                            <ProjectCard
                                key={p.slug}
                                project={p}
                                layout="grid"
                                priority={i < 2}
                                cover={slots[`popular.serial.${i}`]}
                            />
                        ))}
                    </>
                }
                individual={
                    individualProjects.length > 0 ? (
                        <>
                            {individualProjects.map((p, i) => (
                                <ProjectCard
                                    key={p.slug}
                                    project={p}
                                    cover={slots[`popular.individual.${i}`]}
                                />
                            ))}
                        </>
                    ) : null
                }
            />
            <HomeTechContainer techCounts={techCounts} slots={slots} />
            <HomeCollectionsContainer items={collections} />
            <HomeServices
                officeHoursLabel={settings.officeHoursLabel}
                visitImage={slotUrl(slots, "services.visit")}
            />
            <HomeBuiltContainer items={builtItems} stats={builtStats} />
            <HomeBlog items={blogItems} />
            <HomeStagesContainer items={stageItems} />
            <HomeLead
                telegram={settings.telegram}
                max={settings.max}
                officeImage={slotUrl(slots, "lead.office")}
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

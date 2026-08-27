import { listCatalogProjects } from "@/actions/catalog/list-projects";
import { listListedObjects } from "@/actions/catalog/list-objects";
import { getHero } from "@/actions/hero/get-hero";
import { unwrapAction } from "@/types/action";
import { settings } from "@/lib/settings";
import type { Technology } from "@/types/catalog";
import { HeroContainer } from "@/widgets/hero/hero.container";
import { HomeTrust } from "@/widgets/home-trust/home-trust";
import { HomeWorks } from "@/widgets/home-works/home-works";
import { HomeLead } from "@/widgets/home-lead/home-lead";
import { HomeTech } from "@/widgets/home-tech/home-tech";
import { PopularProjects } from "@/widgets/popular-projects/popular-projects";
import { ObjectCarouselContainer } from "@/widgets/object-carousel/object-carousel.container";
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
    const popular = catalog.projects.slice(0, 6);
    const objects = listed.objects;
    const builtCount = objects.filter((o) => o.status === "built").length;
    const techCounts = TECHS.map((t) => ({
        tech: t,
        count: catalog.projects.filter((p) => p.technologies.includes(t))
            .length,
    })).filter((row) => row.count > 0);

    return (
        <main className="pb-16 md:pb-0">
            <section data-section="hero">
                <HeroContainer payload={hero.payload} />
            </section>
            <HomeTrust
                foundedYear={settings.foundedYear}
                warrantyYears={settings.warrantyYears}
                objectCount={objects.length}
            />
            <HomeWorks
                builtCount={builtCount}
                carousel={
                    <ObjectCarouselContainer objects={objects.slice(0, 12)} />
                }
            />
            <PopularProjects
                cards={
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            />
            <HomeLead
                officeHoursLabel={settings.officeHoursLabel}
                telegram={settings.telegram}
                whatsapp={settings.whatsapp}
                phone={settings.phone}
                phoneClean={settings.phoneClean}
                form={<LeadFormContainer source="home-lead" />}
            />
            <HomeTech techCounts={techCounts} />
        </main>
    );
}

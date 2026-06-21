import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { CertificatesStrip } from "@/components/sections/CertificatesStrip";
import { ContactSection } from "@/components/sections/ContactSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FeaturedProject } from "@/components/sections/FeaturedProject";
import { GeographySection } from "@/components/sections/GeographySection";
import { GuaranteesSection } from "@/components/sections/GuaranteesSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { OurWorksSection } from "@/components/sections/OurWorksSection";
import { ProjectPicker } from "@/components/sections/ProjectPicker";
import { PullQuote } from "@/components/sections/PullQuote";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { StagesSection } from "@/components/sections/StagesSection";
import { Catalog } from "@/components/features/home-catalog";
import { getHomeContent } from "@/content/home";
import { getBuiltObjects } from "@/data/built-objects";
import { getFeaturedProjects } from "@/data/projects";
import { formatMonthYear } from "@/lib/utils";

export default async function HomePage() {
    const home = await getHomeContent();
    const featuredProjects = await getFeaturedProjects();
    const builtObjects = getBuiltObjects();
    const featuredObject =
        builtObjects.find((o) => o.id === home.featuredProject.objectId) ??
        builtObjects[0];

    return (
        <>
            <HeroSection {...home.hero} />
            <ProjectPicker {...home.projectPicker} />
            <Catalog {...home.catalog} projects={featuredProjects} />
            <AdvantagesSection {...home.advantages} />
            <PullQuote {...home.pullQuote} />
            <OurWorksSection {...home.ourWorks} objects={builtObjects} />
            <StagesSection {...home.stages} />
            <GeographySection {...home.geography} />
            <ReviewsSection {...home.reviews} />
            <FeaturedProject
                {...home.featuredProject}
                overline={formatMonthYear()}
                project={featuredObject}
            />
            <GuaranteesSection {...home.guarantees} />
            <CertificatesStrip />
            <FaqSection {...home.faq} />
            <ContactSection {...home.contact} />
        </>
    );
}

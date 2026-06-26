import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import type { AdvantagesSectionContent } from "@/content/home";
import { getBuiltObjects } from "@/data/built-objects";
import { getPage, section } from "@/data/pages";
import { getFeaturedProjects } from "@/data/projects";
import { getReviews } from "@/data/reviews";
import { getContacts } from "@/data/settings";
import { formatMonthYear } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
    const page = await getPage("home");
    return {
        title: page?.seoTitle,
        description: page?.seoDescription,
        alternates: { canonical: "/" },
    };
}

export default async function HomePage() {
    const page = await getPage("home");
    if (!page) notFound();

    const hero = section(page, "homeHero");
    const picker = section(page, "projectPicker");
    const catalog = section(page, "catalogSection");
    // Преимущества переиспользуют тип cardGrid; на главной заголовок всегда задан.
    const advantages = section(page, "cardGrid") as
        | AdvantagesSectionContent
        | undefined;
    const quote = section(page, "pullQuote");
    const works = section(page, "worksTeaser");
    const stages = section(page, "stepsSection");
    const geography = section(page, "geography");
    const reviews = section(page, "reviewsCarousel");
    const featured = section(page, "featuredProject");
    const guarantees = section(page, "guaranteeCards");
    const faq = section(page, "faqList");
    const contact = section(page, "homeContact");

    const featuredProjects = await getFeaturedProjects();
    const builtObjects = await getBuiltObjects();
    const allReviews = await getReviews();
    const contacts = await getContacts();

    const featuredReviews = allReviews.filter((r) => r.featured);
    const featuredObject =
        builtObjects.find((o) => o.id === featured?.objectId) ??
        builtObjects[0];

    return (
        <>
            {hero && <HeroSection {...hero} />}
            {picker && <ProjectPicker {...picker} />}
            {catalog && <Catalog {...catalog} projects={featuredProjects} />}
            {advantages && <AdvantagesSection {...advantages} />}
            {quote && <PullQuote {...quote} />}
            {works && <OurWorksSection {...works} objects={builtObjects} />}
            {stages && <StagesSection {...stages} />}
            {geography && <GeographySection {...geography} />}
            {reviews && (
                <ReviewsSection {...reviews} reviews={featuredReviews} />
            )}
            {featured && (
                <FeaturedProject
                    {...featured}
                    overline={formatMonthYear()}
                    project={featuredObject}
                />
            )}
            {guarantees && <GuaranteesSection {...guarantees} />}
            <CertificatesStrip />
            {faq && <FaqSection {...faq} />}
            {contact && (
                <ContactSection
                    {...contact}
                    addresses={contacts.addresses.map((a) => a.value)}
                    phones={contacts.phones.map((p) => ({
                        number: p.number,
                        display: p.display,
                    }))}
                    email={contacts.email}
                />
            )}
        </>
    );
}

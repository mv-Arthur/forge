import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectPicker } from "@/components/sections/ProjectPicker";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { PopularProjects } from "@/components/sections/PopularProjects";
import { QuizSection } from "@/components/sections/QuizSection";
import { StagesSection } from "@/components/sections/StagesSection";
import { OurWorksSection } from "@/components/sections/OurWorksSection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactsMap } from "@/components/sections/ContactsMap";
import { ViewRequestSection } from "@/components/sections/ViewRequestSection";
import {
    ADVANTAGES_SECTION,
    CATEGORIES_SECTION,
    CONTACT_FORM,
    CONTACTS_MAP,
    CTA_SECTION,
    HERO,
    OUR_WORKS_SECTION,
    POPULAR_PROJECTS_SECTION,
    PROJECT_PICKER,
    QUIZ_SECTION,
    REVIEWS_SECTION,
    STAGES_SECTION,
    VIEW_REQUEST_SECTION,
} from "@/lib/constants";
import {
    getCategories,
    getFeaturedProjects,
    getBuiltObjects,
} from "@/lib/data";

export default function HomePage() {
    const categories = getCategories();
    const featuredProjects = getFeaturedProjects();
    const builtObjects = getBuiltObjects();

    return (
        <>
            <HeroSection
                subtitle={HERO.subtitle}
                title={HERO.title}
                text={HERO.text}
                cta={HERO.cta}
                image={HERO.image}
            />
            <ProjectPicker
                title={PROJECT_PICKER.title}
                text={PROJECT_PICKER.text}
                price={PROJECT_PICKER.price}
                area={PROJECT_PICKER.area}
                technologies={PROJECT_PICKER.technologies}
                floors={PROJECT_PICKER.floors}
                submitLabel={PROJECT_PICKER.submitLabel}
                overlap
            />
            <CategoriesSection
                title={CATEGORIES_SECTION.title}
                categories={categories}
                cta={CATEGORIES_SECTION.cta}
            />
            <QuizSection
                title={QUIZ_SECTION.title}
                speaker={QUIZ_SECTION.speaker}
                steps={QUIZ_SECTION.steps}
                prevLabel={QUIZ_SECTION.prevLabel}
                nextLabel={QUIZ_SECTION.nextLabel}
                submitLabel={QUIZ_SECTION.submitLabel}
                lastStepLabel={QUIZ_SECTION.lastStepLabel}
                successTitle={QUIZ_SECTION.successTitle}
                successText={QUIZ_SECTION.successText}
            />
            <AdvantagesSection
                title={ADVANTAGES_SECTION.title}
                text={ADVANTAGES_SECTION.text}
                background={ADVANTAGES_SECTION.background}
                items={ADVANTAGES_SECTION.items}
            />
            <ViewRequestSection
                title={VIEW_REQUEST_SECTION.title}
                nameLabel={VIEW_REQUEST_SECTION.nameLabel}
                namePlaceholder={VIEW_REQUEST_SECTION.namePlaceholder}
                phoneLabel={VIEW_REQUEST_SECTION.phoneLabel}
                phonePlaceholder={VIEW_REQUEST_SECTION.phonePlaceholder}
                submitLabel={VIEW_REQUEST_SECTION.submitLabel}
                privacy={VIEW_REQUEST_SECTION.privacy}
                successTitle={VIEW_REQUEST_SECTION.successTitle}
                successText={VIEW_REQUEST_SECTION.successText}
            />
            <PopularProjects
                title={POPULAR_PROJECTS_SECTION.title}
                titlePrefix={POPULAR_PROJECTS_SECTION.titlePrefix}
                priceLabel={POPULAR_PROJECTS_SECTION.priceLabel}
                statLabels={POPULAR_PROJECTS_SECTION.statLabels}
                tabs={POPULAR_PROJECTS_SECTION.tabs}
                cta={POPULAR_PROJECTS_SECTION.cta}
                projects={featuredProjects}
            />
            <StagesSection
                title={STAGES_SECTION.title}
                stages={STAGES_SECTION.stages}
            />
            <OurWorksSection
                title={OUR_WORKS_SECTION.title}
                tabs={OUR_WORKS_SECTION.tabs}
                cta={OUR_WORKS_SECTION.cta}
                objects={builtObjects}
            />
            <ReviewsSection
                title={REVIEWS_SECTION.title}
                showMoreLabel={REVIEWS_SECTION.showMoreLabel}
                prevLabel={REVIEWS_SECTION.prevLabel}
                nextLabel={REVIEWS_SECTION.nextLabel}
                reviews={REVIEWS_SECTION.reviews}
            />
            <CtaSection
                title={CTA_SECTION.title}
                text={CTA_SECTION.text}
                buttonLabel={CTA_SECTION.buttonLabel}
                image={CTA_SECTION.image}
            />
            <ContactForm
                title={CONTACT_FORM.title}
                subtitle={CONTACT_FORM.subtitle}
                nameLabel={CONTACT_FORM.nameLabel}
                namePlaceholder={CONTACT_FORM.namePlaceholder}
                phoneLabel={CONTACT_FORM.phoneLabel}
                phonePlaceholder={CONTACT_FORM.phonePlaceholder}
                messageLabel={CONTACT_FORM.messageLabel}
                messagePlaceholder={CONTACT_FORM.messagePlaceholder}
                submitLabel={CONTACT_FORM.submitLabel}
                privacy={CONTACT_FORM.privacy}
                image={CONTACT_FORM.image}
                successTitle={CONTACT_FORM.successTitle}
                successText={CONTACT_FORM.successText}
            />
            <ContactsMap
                title={CONTACTS_MAP.title}
                addresses={CONTACTS_MAP.addresses}
                phones={CONTACTS_MAP.phones}
                email={CONTACTS_MAP.email}
                hours={CONTACTS_MAP.hours}
                mapUrl={CONTACTS_MAP.mapUrl}
                mapTitle={CONTACTS_MAP.mapTitle}
            />
        </>
    );
}

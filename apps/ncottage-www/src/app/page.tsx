import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectPicker } from "@/components/sections/ProjectPicker";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { PopularProjects } from "@/components/sections/PopularProjects";
import { QuizSection } from "@/components/sections/QuizSection";
import { StagesSection } from "@/components/sections/StagesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { ContactForm } from "@/components/sections/ContactForm";
import { ViewRequestSection } from "@/components/sections/ViewRequestSection";
import {
    ADVANTAGES_SECTION,
    CATEGORIES_SECTION,
    HERO,
    PROJECT_PICKER,
    QUIZ_SECTION,
    VIEW_REQUEST_SECTION,
} from "@/lib/constants";
import { getCategories, getReviews, getGallery } from "@/lib/data";

export default function HomePage() {
    const categories = getCategories();
    const reviews = getReviews();
    const gallery = getGallery();

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
            <PopularProjects />
            <StagesSection />
            <GallerySection items={gallery} />
            <ReviewsSection reviews={reviews} />
            <CtaSection />
            <ContactForm />
        </>
    );
}

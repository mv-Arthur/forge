import { HeroSection } from "@/components/sections/HeroSection";
import { ProjectPicker } from "@/components/sections/ProjectPicker";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { PopularProjects } from "@/components/sections/PopularProjects";
import { CalculatorWizard } from "@/components/sections/CalculatorWizard";
import { StagesSection } from "@/components/sections/StagesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { ContactForm } from "@/components/sections/ContactForm";
import { HERO, PROJECT_PICKER } from "@/lib/constants";
import { getReviews, getGallery } from "@/lib/data";

export default function HomePage() {
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
            <CategoriesSection />
            <AdvantagesSection />
            <PopularProjects />
            <CalculatorWizard />
            <StagesSection />
            <GallerySection items={gallery} />
            <ReviewsSection reviews={reviews} />
            <CtaSection />
            <ContactForm />
        </>
    );
}

import { HeroSection } from "@/components/sections/HeroSection";
import { CategoriesSection } from "@/components/sections/CategoriesSection";
import { AdvantagesSection } from "@/components/sections/AdvantagesSection";
import { PopularProjects } from "@/components/sections/PopularProjects";
import { CalculatorWizard } from "@/components/sections/CalculatorWizard";
import { StagesSection } from "@/components/sections/StagesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { ContactForm } from "@/components/sections/ContactForm";
import { getReviews, getGallery } from "@/lib/data";

export default function HomePage() {
    const reviews = getReviews();
    const gallery = getGallery();

    return (
        <>
            <HeroSection />
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

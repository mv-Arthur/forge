import type { Project } from "@/types/project";
import type { Service } from "@/types/service";
import type { Review } from "@/types/review";
import type { Advantage, Stage, GalleryItem, Category } from "@/types/common";

import projectsData from "@/data/projects.json";
import servicesData from "@/data/services.json";
import reviewsData from "@/data/reviews.json";
import advantagesData from "@/data/advantages.json";
import stagesData from "@/data/stages.json";
import galleryData from "@/data/gallery.json";
import categoriesData from "@/data/categories.json";

export function getProjects(): Project[] {
    return projectsData as Project[];
}

export function getFeaturedProjects(): Project[] {
    return getProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
    return getProjects().find((p) => p.slug === slug);
}

export function getServices(): Service[] {
    return servicesData as Service[];
}

export function getServiceBySlug(slug: string): Service | undefined {
    return getServices().find((s) => s.slug === slug);
}

export function getReviews(): Review[] {
    return reviewsData as Review[];
}

export function getAdvantages(): Advantage[] {
    return advantagesData as Advantage[];
}

export function getStages(): Stage[] {
    return stagesData as Stage[];
}

export function getGallery(): GalleryItem[] {
    return galleryData as GalleryItem[];
}

export function getCategories(): Category[] {
    return categoriesData as Category[];
}

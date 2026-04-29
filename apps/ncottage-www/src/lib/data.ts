import type { Project } from "@/types/project";
import type { Service } from "@/types/service";
import type { Advantage, Stage, Category, BuiltObject } from "@/types/common";

import { PROJECTS } from "@/lib/constants";
import servicesData from "@/data/services.json";
import advantagesData from "@/data/advantages.json";
import stagesData from "@/data/stages.json";
import categoriesData from "@/data/categories.json";
import builtObjectsData from "@/data/built-objects.json";

export function getProjects(): Project[] {
    return PROJECTS;
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

export function getAdvantages(): Advantage[] {
    return advantagesData as Advantage[];
}

export function getStages(): Stage[] {
    return stagesData as Stage[];
}

export function getCategories(): Category[] {
    return categoriesData as Category[];
}

export function getBuiltObjects(): BuiltObject[] {
    return builtObjectsData as BuiltObject[];
}

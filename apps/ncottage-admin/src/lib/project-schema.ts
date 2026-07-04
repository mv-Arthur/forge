import {
    PROJECT_FEATURES,
    PROJECT_LIVING_TYPES,
    PROJECT_STYLES,
    type Project,
    type ProjectFeature,
    TECHNOLOGIES,
} from "@forge/shared";
import { z } from "zod";

// Local form schema mirroring the shared Project contract. Nested arrays are
// edited via repeater fields here; the backend model is normalised later (C1).
// String arrays are wrapped as { value } so useFieldArray has stable item keys.

const wrappedString = z.object({ value: z.string().min(1, "Не пусто") });

const roomSchema = z.object({
    name: z.string().min(1, "Название"),
    area: z.number({ message: "Число" }).nonnegative(),
});

const floorPlanSchema = z.object({
    label: z.string().min(1, "Название"),
    image: z.string().min(1, "Изображение"),
    area: z.number().nonnegative().optional(),
    rooms: z.array(roomSchema),
});

const includeSchema = z.object({
    label: z.string().min(1, "Название"),
    value: z.string().min(1, "Значение"),
});

const packageSchema = z.object({
    name: z.string().min(1, "Название"),
    price: z.number({ message: "Число" }).nonnegative(),
    tagline: z.string().optional(),
    highlighted: z.boolean().optional(),
    includes: z.array(includeSchema),
});

const optionSchema = z.object({
    label: z.string().min(1, "Название"),
    price: z.number({ message: "Число" }).nonnegative(),
    note: z.string().optional(),
});

export const projectSchema = z.object({
    slug: z
        .string()
        .min(1, "Укажите slug")
        .regex(/^[a-z0-9-]+$/, "Только строчные латиница, цифры и дефис"),
    name: z.string().min(1, "Укажите название"),
    technology: z.enum(TECHNOLOGIES),
    style: z.enum(PROJECT_STYLES),
    livingType: z.enum(PROJECT_LIVING_TYPES),
    area: z.number({ message: "Число" }).nonnegative(),
    floors: z.number({ message: "Число" }).int().nonnegative(),
    bedrooms: z.number({ message: "Число" }).int().nonnegative(),
    bathrooms: z.number({ message: "Число" }).int().nonnegative(),
    price: z.number({ message: "Число" }).nonnegative(),
    image: z.string().min(1, "Укажите главное изображение"),
    images: z.array(wrappedString),
    description: z.string().min(1, "Добавьте описание"),
    specs: z.object({
        dimensions: z.string(),
        roofType: z.string(),
        foundation: z.string(),
        wallMaterial: z.string(),
        buildTime: z.string(),
    }),
    features: z.array(z.enum(PROJECT_FEATURES)),
    featured: z.boolean(),
    floorPlans: z.array(floorPlanSchema),
    packages: z.array(packageSchema),
    options: z.array(optionSchema),
    relatedObjectIds: z.array(wrappedString),
    pdfUrl: z.string().optional(),
    seoTitle: z.string(),
    seoDescription: z.string(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export function emptyProjectValues(): ProjectFormValues {
    return {
        slug: "",
        name: "",
        technology: TECHNOLOGIES[0],
        style: PROJECT_STYLES[0],
        livingType: PROJECT_LIVING_TYPES[0],
        area: 0,
        floors: 1,
        bedrooms: 1,
        bathrooms: 1,
        price: 0,
        image: "",
        images: [],
        description: "",
        specs: {
            dimensions: "",
            roofType: "",
            foundation: "",
            wallMaterial: "",
            buildTime: "",
        },
        features: [],
        featured: false,
        floorPlans: [],
        packages: [],
        options: [],
        relatedObjectIds: [],
        pdfUrl: "",
        seoTitle: "",
        seoDescription: "",
    };
}

export function projectToFormValues(project: Project): ProjectFormValues {
    return {
        slug: project.slug,
        name: project.name,
        technology: project.technology,
        style: project.style,
        livingType: project.livingType,
        area: project.area,
        floors: project.floors,
        bedrooms: project.bedrooms,
        bathrooms: project.bathrooms,
        price: project.price,
        image: project.image,
        images: project.images.map((value) => ({ value })),
        description: project.description,
        specs: project.specs,
        features: project.features,
        featured: project.featured,
        floorPlans: (project.floorPlans ?? []).map((fp) => ({
            label: fp.label,
            image: fp.image,
            area: fp.area,
            rooms: fp.rooms ?? [],
        })),
        packages: (project.packages ?? []).map((pkg) => ({
            name: pkg.name,
            price: pkg.price,
            tagline: pkg.tagline,
            highlighted: pkg.highlighted,
            includes: pkg.includes,
        })),
        options: (project.options ?? []).map((opt) => ({
            label: opt.label,
            price: opt.price,
            note: opt.note,
        })),
        relatedObjectIds: (project.relatedObjectIds ?? []).map((value) => ({
            value,
        })),
        pdfUrl: project.pdfUrl ?? "",
        seoTitle: project.seoTitle ?? "",
        seoDescription: project.seoDescription ?? "",
    };
}

export function formValuesToProject(values: ProjectFormValues): Project {
    return {
        slug: values.slug.trim(),
        name: values.name.trim(),
        technology: values.technology,
        area: values.area,
        floors: values.floors,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        price: values.price,
        image: values.image.trim(),
        images: values.images.map((i) => i.value.trim()).filter(Boolean),
        description: values.description.trim(),
        specs: values.specs,
        style: values.style,
        features: values.features as ProjectFeature[],
        livingType: values.livingType,
        featured: values.featured,
        floorPlans: values.floorPlans,
        packages: values.packages,
        options: values.options,
        relatedObjectIds: values.relatedObjectIds
            .map((r) => r.value.trim())
            .filter(Boolean),
        pdfUrl: values.pdfUrl?.trim() ?? "",
        seoTitle: values.seoTitle.trim(),
        seoDescription: values.seoDescription.trim(),
    };
}

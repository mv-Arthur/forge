import type {
    ProjectFeature,
    ProjectLivingType,
    ProjectStyle,
    Technology,
} from "@forge/shared";

export type {
    ProjectFeature,
    ProjectLivingType,
    ProjectStyle,
    Technology,
} from "@forge/shared";

interface TechnologyDef {
    slug: Technology;
    label: string;
    pickerLabel: string;
    category: {
        title: string;
        description: string;
        image: string;
    };
}

const TECHNOLOGIES = [
    {
        slug: "gas-concrete",
        label: "Газобетон",
        pickerLabel: "Дом из газобетона",
        category: {
            title: "Дома из газобетона",
            description: "Тёплые и долговечные дома с быстрой сборкой",
            image: "/images/projects/otto.jpg",
        },
    },
    {
        slug: "brick",
        label: "Кирпич",
        pickerLabel: "Дом из кирпича",
        category: {
            title: "Дома из кирпича",
            description:
                "Классические дома с долгим сроком службы и премиальной отделкой",
            image: "/images/projects/karl.jpg",
        },
    },
    {
        slug: "frame",
        label: "Каркас",
        pickerLabel: "Каркасный дом",
        category: {
            title: "Каркасные дома",
            description: "Энергоэффективные дома для постоянного проживания",
            image: "/images/projects/eliot.jpg",
        },
    },
    {
        slug: "sip",
        label: "СИП-панели",
        pickerLabel: "Дом из SIP-панелей",
        category: {
            title: "Дома из СИП-панелей",
            description: "Быстрая сборка и отличная теплоизоляция",
            image: "/images/projects/berg.jpg",
        },
    },
    {
        slug: "fachwerk",
        label: "Фахверк",
        pickerLabel: "Фахверковые дома",
        category: {
            title: "Фахверковые дома",
            description: "Современный стиль с панорамным остеклением",
            image: "/images/projects/valter.jpg",
        },
    },
    {
        slug: "foam-block",
        label: "Пеноблоки",
        pickerLabel: "Дом из пеноблоков",
        category: {
            title: "Дома из пеноблоков",
            description: "Бюджетные тёплые дома",
            image: "/images/projects/otto.jpg",
        },
    },
    {
        slug: "modular",
        label: "Модульные",
        pickerLabel: "Модульный дом",
        category: {
            title: "Модульные дома",
            description: "Заводская готовность и сборка за дни",
            image: "/images/projects/eliot.jpg",
        },
    },
    {
        slug: "combined",
        label: "Комбинированные",
        pickerLabel: "Комбинированный дом",
        category: {
            title: "Комбинированные дома",
            description: "Сочетание материалов под индивидуальный проект",
            image: "/images/projects/karl.jpg",
        },
    },
] as const satisfies readonly TechnologyDef[];

export const PROJECT_TECHNOLOGY_LABELS: Record<Technology, string> =
    Object.fromEntries(TECHNOLOGIES.map((t) => [t.slug, t.label])) as Record<
        Technology,
        string
    >;

export const PROJECT_STYLE_LABELS: Record<ProjectStyle, string> = {
    modern: "Модерн",
    finnish: "Финский",
    german: "Немецкий",
    loft: "Лофт",
    chalet: "Шале",
    "hi-tech": "Хай-тек",
    minimalism: "Минимализм",
};

export const PROJECT_FEATURE_LABELS: Record<ProjectFeature, string> = {
    "panoramic-windows": "С панорамными окнами",
    "second-light": "Со вторым светом",
    guest: "Гостевые",
    "with-utilities": "С коммуникациями и отделкой",
    ready: "Готовые",
    balcony: "С балконом",
    "bay-window": "С эркером",
    "boiler-room": "С котельной",
    garage: "С гаражом",
    terrace: "С террасой",
    attic: "С мансардой",
};

export const PROJECT_LIVING_TYPE_LABELS: Record<ProjectLivingType, string> = {
    permanent: "Для постоянного проживания",
    seasonal: "Дачные",
};

const HUB_TECHNOLOGY_SLUGS = [
    "gas-concrete",
    "brick",
    "frame",
    "sip",
    "fachwerk",
] as const satisfies readonly Technology[];

type HubTechnologySlug = (typeof HUB_TECHNOLOGY_SLUGS)[number];

export type ProjectCategorySlug = "all" | HubTechnologySlug;

export interface ProjectCategoryInfo {
    slug: ProjectCategorySlug;
    title: string;
    description: string;
    image: string;
    technology: Technology | null;
}

export const PROJECT_HUB_CATEGORIES: ProjectCategoryInfo[] = [
    {
        slug: "all",
        title: "Все проекты",
        description:
            "Полная коллекция готовых проектов под ключ — фиксированная цена и сроки",
        image: "/images/projects/nord.jpg",
        technology: null,
    },
    ...HUB_TECHNOLOGY_SLUGS.map((slug): ProjectCategoryInfo => {
        const tech = TECHNOLOGIES.find((t) => t.slug === slug)!;
        return {
            slug,
            title: tech.category.title,
            description: tech.category.description,
            image: tech.category.image,
            technology: slug,
        };
    }),
];

import type { Project } from "@/domain/project";

export type SelectionGroup =
    | "purpose"
    | "floors"
    | "area"
    | "features"
    | "styles";

export interface ProjectSelection {
    slug: string;
    group: SelectionGroup;
    title: string;
    shortTitle: string;
    description: string;
    metaDescription: string;
    filter: (project: Project) => boolean;
}

export const GROUP_LABELS: Record<SelectionGroup, string> = {
    purpose: "Назначение",
    floors: "Этажность",
    area: "Площадь",
    features: "Особенности",
    styles: "Стили",
};

const hasSauna = (project: Project) =>
    project.description.toLowerCase().includes("саун");

const hasWrightMood = (project: Project) =>
    project.features.includes("panoramic-windows") &&
    project.features.includes("terrace") &&
    ["modern", "hi-tech", "minimalism"].includes(project.style);

export const PROJECT_SELECTIONS: ProjectSelection[] = [
    {
        slug: "zagorodnye-doma",
        group: "purpose",
        title: "Проекты загородных домов",
        shortTitle: "Загородные дома",
        description:
            "Готовые проекты для строительства за городом: компактные дачные решения и дома для круглогодичной жизни.",
        metaDescription:
            "Подборка проектов загородных домов Новый Коттедж с ценами, площадями и фильтрами по технологии, этажности и планировке.",
        filter: () => true,
    },
    {
        slug: "dlya-postoyannogo-prozhivaniya",
        group: "purpose",
        title: "Дома для постоянного проживания",
        shortTitle: "Для ПМЖ",
        description:
            "Проекты тёплых домов для круглогодичного проживания семьи с продуманными инженерными зонами.",
        metaDescription:
            "Проекты домов для постоянного проживания под ключ: цены, планировки, технологии строительства и удобные фильтры каталога.",
        filter: (project) => project.livingType === "permanent",
    },
    {
        slug: "dachnye-doma",
        group: "purpose",
        title: "Проекты дачных домов",
        shortTitle: "Дачные дома",
        description:
            "Сезонные и компактные дома для отдыха на участке, гостевого размещения и семейных выходных.",
        metaDescription:
            "Каталог проектов дачных домов: компактные площади, террасы, быстрые технологии строительства и понятная стоимость.",
        filter: (project) => project.livingType === "seasonal",
    },
    {
        slug: "gostevye-doma",
        group: "purpose",
        title: "Проекты гостевых домов",
        shortTitle: "Гостевые дома",
        description:
            "Небольшие дома для гостей, отдыха и дополнительного строения на загородном участке.",
        metaDescription:
            "Проекты гостевых домов для загородного участка: готовые планировки, цены и подбор по параметрам.",
        filter: (project) => project.features.includes("guest"),
    },
    {
        slug: "odnoetazhnye-doma",
        group: "floors",
        title: "Проекты одноэтажных домов",
        shortTitle: "Одноэтажные",
        description:
            "Удобные одноэтажные планировки без лестниц: спальни, кухня-гостиная и выход на участок на одном уровне.",
        metaDescription:
            "Проекты одноэтажных домов Новый Коттедж: цены, площади, планировки и фильтры для выбора технологии строительства.",
        filter: (project) => project.floors === 1,
    },
    {
        slug: "polutoraetazhnye-doma",
        group: "floors",
        title: "Проекты полутораэтажных домов",
        shortTitle: "Полутораэтажные",
        description:
            "Рациональные дома с мансардным уровнем: больше полезной площади при компактном пятне застройки.",
        metaDescription:
            "Подборка полутораэтажных домов и проектов с мансардой: планировки, площади и стоимость строительства.",
        filter: (project) =>
            project.features.includes("attic") ||
            project.description.toLowerCase().includes("мансард"),
    },
    {
        slug: "dvuhetazhnye-doma",
        group: "floors",
        title: "Проекты двухэтажных домов",
        shortTitle: "Двухэтажные",
        description:
            "Двухэтажные дома для семей, которым нужны отдельные приватные зоны, несколько спален и просторная гостиная.",
        metaDescription:
            "Каталог проектов двухэтажных домов с ценами, площадями, спальнями и фильтрами по технологии строительства.",
        filter: (project) => project.floors === 2,
    },
    {
        slug: "doma-s-mansardoy",
        group: "floors",
        title: "Проекты домов с мансардой",
        shortTitle: "С мансардой",
        description:
            "Дома с мансардным этажом для дополнительной жилой зоны, кабинета или спален под кровлей.",
        metaDescription:
            "Проекты домов с мансардой: готовые планировки, цены строительства и подбор по площади, стилю и технологии.",
        filter: (project) => project.features.includes("attic"),
    },
    {
        slug: "doma-do-150-m2",
        group: "area",
        title: "Проекты домов до 150 м²",
        shortTitle: "До 150 м²",
        description:
            "Компактные и практичные проекты до 150 м² для семьи, дачи или постоянного проживания.",
        metaDescription:
            "Проекты домов до 150 м²: каталог с ценами, планировками и фильтрами по этажности, технологии и особенностям.",
        filter: (project) => project.area <= 150,
    },
    {
        slug: "doma-do-250-m2",
        group: "area",
        title: "Проекты домов до 250 м²",
        shortTitle: "До 250 м²",
        description:
            "Семейные дома до 250 м² с несколькими спальнями, террасами, гаражами и гибкими планировками.",
        metaDescription:
            "Проекты домов до 250 м² от Новый Коттедж: стоимость, площади, этажность и подбор по параметрам.",
        filter: (project) => project.area <= 250,
    },
    {
        slug: "doma-do-300-m2",
        group: "area",
        title: "Проекты домов до 300 м²",
        shortTitle: "До 300 м²",
        description:
            "Просторные проекты для большой семьи с приватными комнатами, гостевыми зонами и техническими помещениями.",
        metaDescription:
            "Каталог проектов домов до 300 м² с ценами, планировками и фильтрацией по стилю, этажности и технологии.",
        filter: (project) => project.area <= 300,
    },
    {
        slug: "doma-do-400-m2",
        group: "area",
        title: "Проекты домов до 400 м²",
        shortTitle: "До 400 м²",
        description:
            "Большие загородные дома для комфортной жизни, приёма гостей и расширенного состава помещений.",
        metaDescription:
            "Проекты домов до 400 м²: подборка просторных загородных домов с ценами и фильтрами каталога.",
        filter: (project) => project.area <= 400,
    },
    {
        slug: "doma-do-600-m2",
        group: "area",
        title: "Проекты домов до 600 м²",
        shortTitle: "До 600 м²",
        description:
            "Крупные проекты и премиальные решения, которые можно адаптировать под участок и сценарий жизни семьи.",
        metaDescription:
            "Проекты домов до 600 м²: большой каталог загородных домов с ценами, площадями и подбором по параметрам.",
        filter: (project) => project.area <= 600,
    },
    {
        slug: "doma-s-terrasoy",
        group: "features",
        title: "Проекты домов с террасой",
        shortTitle: "С террасой",
        description:
            "Дома с открытой или крытой террасой для отдыха, семейных завтраков и выхода из кухни-гостиной на участок.",
        metaDescription:
            "Проекты домов с террасой: готовые планировки, цены строительства и фильтры по площади, этажности и технологии.",
        filter: (project) => project.features.includes("terrace"),
    },
    {
        slug: "doma-s-garazhom",
        group: "features",
        title: "Проекты домов с гаражом",
        shortTitle: "С гаражом",
        description:
            "Проекты с встроенным или пристроенным гаражом и удобной связью с жилой частью дома.",
        metaDescription:
            "Проекты домов с гаражом: каталог с ценами, площадями, технологиями строительства и удобными фильтрами.",
        filter: (project) => project.features.includes("garage"),
    },
    {
        slug: "doma-s-saunoy",
        group: "features",
        title: "Проекты домов с сауной",
        shortTitle: "С сауной",
        description:
            "Подборка проектов, где можно предусмотреть банный блок, сауну или зону восстановления внутри дома.",
        metaDescription:
            "Проекты домов с сауной и банным блоком: варианты планировок, цены и подбор по площади и технологии.",
        filter: hasSauna,
    },
    {
        slug: "doma-s-kotelnoy",
        group: "features",
        title: "Проекты домов с котельной",
        shortTitle: "С котельной",
        description:
            "Планировки с выделенной котельной и техническими помещениями для постоянного проживания.",
        metaDescription:
            "Проекты домов с котельной: готовые решения для круглогодичного проживания с ценами и фильтрами каталога.",
        filter: (project) => project.features.includes("boiler-room"),
    },
    {
        slug: "doma-s-panoramnymi-oknami",
        group: "features",
        title: "Проекты домов с панорамными окнами",
        shortTitle: "С панорамными окнами",
        description:
            "Современные дома с большим остеклением, светлой гостиной и выразительным фасадом.",
        metaDescription:
            "Проекты домов с панорамными окнами: современные планировки, цены и подбор по стилю, площади и технологии.",
        filter: (project) => project.features.includes("panoramic-windows"),
    },
    {
        slug: "sovremennye-doma",
        group: "styles",
        title: "Проекты современных домов",
        shortTitle: "Современные",
        description:
            "Актуальная архитектура с лаконичными фасадами, большими окнами и открытыми семейными пространствами.",
        metaDescription:
            "Проекты современных домов Новый Коттедж: каталог с ценами, планировками и фильтрами по площади и технологии.",
        filter: (project) =>
            ["modern", "hi-tech", "minimalism"].includes(project.style),
    },
    {
        slug: "doma-v-stile-modern",
        group: "styles",
        title: "Проекты домов в стиле модерн",
        shortTitle: "Модерн",
        description:
            "Дома в стиле модерн с выразительной геометрией, удобной планировкой и светлыми общими зонами.",
        metaDescription:
            "Проекты домов в стиле модерн: готовые планировки, цены строительства и подбор по параметрам каталога.",
        filter: (project) => project.style === "modern",
    },
    {
        slug: "finskie-doma",
        group: "styles",
        title: "Проекты финских домов",
        shortTitle: "Финские",
        description:
            "Тёплые и рациональные дома в северной традиции: компактность, энергоэффективность и уют.",
        metaDescription:
            "Проекты финских домов: каталог загородных домов с ценами, площадями и фильтрами по технологии строительства.",
        filter: (project) => project.style === "finnish",
    },
    {
        slug: "skandinavskie-doma",
        group: "styles",
        title: "Проекты скандинавских домов",
        shortTitle: "Скандинавские",
        description:
            "Сдержанные северные фасады, простые формы, практичные площади и комфорт для круглогодичной жизни.",
        metaDescription:
            "Проекты скандинавских домов: цены, планировки и подбор по площади, этажности и технологии строительства.",
        filter: (project) => ["finnish", "minimalism"].includes(project.style),
    },
    {
        slug: "doma-v-stile-loft",
        group: "styles",
        title: "Проекты домов в стиле лофт",
        shortTitle: "Лофт",
        description:
            "Лаконичная архитектура, открытые пространства и выразительные материалы для загородного дома в стиле лофт.",
        metaDescription:
            "Проекты домов в стиле лофт: подборка планировок с ценами, площадями и фильтрами каталога.",
        filter: (project) =>
            project.style === "loft" ||
            project.description.toLowerCase().includes("открытая планировка"),
    },
    {
        slug: "doma-v-stile-haytek",
        group: "styles",
        title: "Проекты домов в стиле хай-тек",
        shortTitle: "Хай-тек",
        description:
            "Современные дома с плоскими кровлями, панорамным остеклением и выразительной геометрией фасадов.",
        metaDescription:
            "Проекты домов в стиле хай-тек: цены, планировки и фильтры по площади, этажности и технологии.",
        filter: (project) => project.style === "hi-tech",
    },
    {
        slug: "doma-v-stile-rayt",
        group: "styles",
        title: "Проекты домов в стиле Райта",
        shortTitle: "Стиль Райта",
        description:
            "Горизонтальная архитектура, террасы и большое остекление для связи дома с природным окружением.",
        metaDescription:
            "Проекты домов в стиле Райта: загородные дома с террасами, панорамными окнами и подбором по параметрам.",
        filter: hasWrightMood,
    },
];

export function getSelectionBySlug(slug: string) {
    return PROJECT_SELECTIONS.find((selection) => selection.slug === slug);
}

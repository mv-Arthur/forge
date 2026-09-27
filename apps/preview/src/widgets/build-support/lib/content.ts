import type {
    BuildSupportMedia,
    BuildSupportQuality,
} from "../build-support.types";

export const HERO_IMAGE = "/media/hero/hill.jpg";

export const MANAGER_IMAGE = "/media/lead/office.jpg";

export const CABINET_IMAGE = "/media/hero/own-project.jpg";

export const AFTERCARE_IMAGE = "/media/built-strip/01.jpg";

export const PLANNING_IMAGE = "/media/hero/kiskelovo.jpg";

export const QUALITY: BuildSupportQuality[] = [
    {
        id: "stages",
        title: "Проверка на всех этапах",
        text: "Инженер технадзора принимает работы, включая скрытые.",
        image: "/media/stages/facade.jpg",
    },
    {
        id: "checklists",
        title: "По чек-листам",
        text: "Каждый этап закрывают по чек-листу, а не на глаз.",
        image: "/media/blog/tech-materials.jpg",
    },
    {
        id: "photos",
        title: "Фиксация проверок",
        text: "Результат - фото и документы, не устные договорённости.",
        image: "/media/stages/interior.jpg",
    },
];

export const MEDIA: BuildSupportMedia[] = [
    {
        id: "cameras",
        title: "Камеры на объекте",
        text: "На участке стоят камеры, этапы фиксируем фотоотчётами.",
    },
    {
        id: "reports",
        title: "Видно самим",
        text: "Не нужно приезжать, чтобы убедиться, что работы идут по плану.",
    },
    {
        id: "daily",
        title: "Отчёт по дню",
        text: "В конце дня видно, что сделали на площадке.",
    },
];

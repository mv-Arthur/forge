import type {
    SiteSurveyAudience,
    SiteSurveyChip,
    SiteSurveyDeliverable,
    SiteSurveyWhyItem,
} from "../site-survey.types";

export const HERO_IMAGE = "/media/stages/plot.jpg";

export const WHO_IMAGE = "/media/stages/plot.jpg";

export const HERO_CHIPS: SiteSurveyChip[] = [
    { id: "photo", label: "Осмотр с фотофиксацией" },
    { id: "ready", label: "Заключение о готовности к стройке" },
    { id: "advice", label: "Рекомендации по дому и коммуникациям" },
];

export const AUDIENCES: SiteSurveyAudience[] = [
    {
        id: "owned",
        n: "1.",
        title: "У вас уже есть участок",
        text: "Хотите узнать, готов ли он к строительству? Инженер оценит рельеф, грунты и коммуникации, составит план подготовки.",
        hint: "Проверим перепады высот, тип грунта, риски подтопления",
        image: "/media/blog/start-survey.jpg",
    },
    {
        id: "looking",
        n: "2.",
        title: "Присматриваете участок",
        text: "Сомневаетесь, подойдёт ли земля под дом? Инженер осмотрит участок, оценит пригодность и подскажет место для дома с учётом норм.",
        hint: "Оценим пригодность, соседние постройки, расположение дома",
        image: "/media/stages/site.jpg",
    },
];

export const DELIVERABLES: SiteSurveyDeliverable[] = [
    {
        id: "report",
        title: "Фотоотчёт",
        text: "Фиксация ключевых точек участка: рельеф, подъезд, сети, пятно дома.",
    },
    {
        id: "checklist",
        title: "Чек-лист готовности",
        text: "Пошаговый план: с чего начать подготовку к стройке.",
    },
    {
        id: "advice",
        title: "Рекомендации",
        text: "Где поставить дом, септик, скважину с учётом норм.",
    },
    {
        id: "estimate",
        title: "Расчёт",
        text: "Объём, стоимость и сроки подготовки участка.",
    },
];

export const WHY_ITEMS: SiteSurveyWhyItem[] = [
    {
        id: "place",
        text: "Выбрать место для дома с учётом норм и удобства",
    },
    {
        id: "rework",
        text: "Избежать лишних затрат на переделки",
    },
    {
        id: "scope",
        text: "Заранее понять объём и стоимость подготовительных работ",
    },
    {
        id: "plan",
        text: "Спокойно планировать бюджет и сроки",
    },
];

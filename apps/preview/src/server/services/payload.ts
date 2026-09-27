import "server-only";
import type { ServicesHubPayload } from "@/types/services";
import { getListedObjects } from "@/server/catalog/data";
import { settings } from "@/lib/settings";
import { routes } from "@/lib/routes";
import {
    BUILT_STAT_BUILDING,
    BUILT_STAT_STANDING,
    BUILT_STAT_YEARS,
    CTA_MORE,
    CTA_SIGN_UP,
    HUB_CHOOSE,
    NAV_SERVICES,
    NAV_WORKS_GALLERY,
    NAV_WORKS_STAGES,
    SERVICES_HUB_HEADING,
    SERVICES_HUB_LEAD,
    SERVICES_HUB_LEAD_HEADING,
    SERVICES_HUB_LEAD_TEXT,
    SERVICES_HUB_MEET,
    SERVICES_HUB_PATH_HEADING,
    SERVICES_HUB_SITUATIONS_HEADING,
    SERVICES_HUB_SITUATIONS_LEAD,
    SERVICES_HUB_STAT_WARRANTY,
    SERVICES_HUB_WORKS_BUILT_LEAD,
    SERVICES_HUB_WORKS_STAGES_LEAD,
    SEE_HOUSES,
    WORKS_STAGES_SEE,
} from "@/lib/copy";

const MORE = CTA_MORE;
const MEET = "#lead";

export function getServicesHub(): ServicesHubPayload {
    const objects = getListedObjects();
    const builtCount = objects.filter((o) => o.status === "built").length;
    const buildingCount = objects.filter(
        (o) => o.status === "in-progress"
    ).length;
    const sinceYears = new Date().getFullYear() - settings.foundedYear;
    const stats = [
        ...(builtCount > 0
            ? [{ value: String(builtCount), hint: BUILT_STAT_STANDING }]
            : []),
        ...(buildingCount > 0
            ? [{ value: String(buildingCount), hint: BUILT_STAT_BUILDING }]
            : []),
        ...(sinceYears > 0
            ? [{ value: String(sinceYears), hint: BUILT_STAT_YEARS }]
            : []),
        {
            value: String(settings.warrantyYears),
            hint: SERVICES_HUB_STAT_WARRANTY,
        },
    ];

    return {
        crumb: NAV_SERVICES,
        eyebrow: NAV_SERVICES,
        heading: SERVICES_HUB_HEADING,
        lead: SERVICES_HUB_LEAD,
        chooseLabel: HUB_CHOOSE,
        chooseHref: routes.projects(),
        meetLabel: SERVICES_HUB_MEET,
        meetHref: MEET,
        heroImage: "/media/services/hub-hero.jpg",
        situationsHeading: SERVICES_HUB_SITUATIONS_HEADING,
        situationsLead: SERVICES_HUB_SITUATIONS_LEAD,
        situations: [
            {
                id: "plot",
                title: "Есть участок",
                lead: "Нужно понять, что строить и как начать",
                image: "/media/stages/plot.jpg",
                panelTitle: "У вас есть участок - начнём с проекта",
                panelLead:
                    "Проверим документы, оценим участок с инженером, подберём проект под задачу и бюджет. Первый шаг - консультация.",
                ctaLabel: "Записаться к архитектору",
                ctaHref: MEET,
                offers: [
                    {
                        kicker: "С участка",
                        badge: "По записи",
                        title: "Проверка участка инженером",
                        href: MEET,
                        moreLabel: MORE,
                    },
                    {
                        kicker: "С чего начать",
                        title: "Каталог проектов",
                        href: routes.projects(),
                        moreLabel: MORE,
                    },
                    {
                        kicker: "Приезжайте",
                        title: "Посмотреть построенные дома",
                        href: routes.worksGallery(),
                        moreLabel: MORE,
                    },
                ],
            },
            {
                id: "choose",
                title: "Только выбираю",
                lead: "Ещё не определился с проектом и участком",
                image: "/media/collections/panorama.jpg",
                panelTitle: "Сначала смотрим дома, потом участок",
                panelLead:
                    "Серийный или индивидуальный, материал и площадь. Когда образ дома ясен - проще выбрать землю и смету.",
                ctaLabel: HUB_CHOOSE,
                ctaHref: routes.projects(),
                offers: [
                    {
                        kicker: "Каталог",
                        title: "Серийные и индивидуальные",
                        href: routes.projects(),
                        moreLabel: MORE,
                    },
                    {
                        kicker: "Свой чертёж",
                        title: "Индивидуальный проект",
                        href: routes.projects({ kind: "individual" }),
                        moreLabel: MORE,
                    },
                    {
                        kicker: "Вживую",
                        title: "Портфолио построенных",
                        href: routes.works,
                        moreLabel: MORE,
                    },
                ],
            },
            {
                id: "control",
                title: "Хочу контроль стройки",
                lead: "Уже строюсь - важна прозрачность и качество",
                image: "/media/stages/facade.jpg",
                panelTitle: "Смотрите ход работ, как есть",
                panelLead:
                    "Фото этапов, готовые дома и карта объектов. Так видно, как кладут стены, кровлю и инженерию - до договора и во время стройки.",
                ctaLabel: "Смотреть этапы",
                ctaHref: routes.worksStagesHub,
                offers: [
                    {
                        kicker: "Этапы",
                        title: "Фотографии стройки",
                        href: routes.worksStagesHub,
                        moreLabel: MORE,
                    },
                    {
                        kicker: "Готовые",
                        title: "Фотогалерея домов",
                        href: routes.worksGallery(),
                        moreLabel: MORE,
                    },
                    {
                        kicker: "На карте",
                        title: "Наши дома в области",
                        href: routes.worksMap,
                        moreLabel: MORE,
                    },
                ],
            },
            {
                id: "service",
                title: "Сервис после сдачи",
                lead: "Дом готов - нужно обслуживание и поддержка",
                image: "/media/stages/interior.jpg",
                panelTitle: "Гарантия 7 лет и связь с бригадой",
                panelLead:
                    "После сдачи остаёмся на связи: конструктив, инженерия, вопросы по дому. Пишите - разберём, что чинить по гарантии, а что отдельно.",
                ctaLabel: SERVICES_HUB_MEET,
                ctaHref: MEET,
                offers: [
                    {
                        kicker: "Офис",
                        title: "Контакты",
                        href: routes.contacts,
                        moreLabel: MORE,
                    },
                    {
                        kicker: "Гарантия",
                        badge: `${settings.warrantyYears} лет`,
                        title: "Сервис после сдачи",
                        href: MEET,
                        moreLabel: MORE,
                    },
                    {
                        kicker: "Как живёт дом",
                        title: "Построенные объекты",
                        href: routes.worksGallery(),
                        moreLabel: MORE,
                    },
                ],
            },
        ],
        pathHeading: SERVICES_HUB_PATH_HEADING,
        pathSteps: [
            {
                id: "land",
                title: "Участок",
                lead: "Помогаем проверить и подготовить землю. Это снимает юридические риски и лишние расходы до проекта.",
                checks: [
                    "Документы и ограничения участка",
                    "Выезд инженера на место",
                    "Рельеф, подъезд, посадка дома",
                ],
                ctaLabel: CTA_SIGN_UP,
                ctaHref: MEET,
                offers: [
                    {
                        title: "Проверка участка инженером",
                        href: MEET,
                        moreLabel: MORE,
                        badge: "По записи",
                        image: "/media/blog/start-survey.jpg",
                    },
                    {
                        title: "Портфолио на карте",
                        href: routes.worksMap,
                        moreLabel: MORE,
                        image: "/media/stages/plot.jpg",
                    },
                ],
            },
            {
                id: "project",
                title: "Проект",
                lead: "Серийный дом или ваш чертёж. Фиксируем планировку, материал и смету до старта.",
                checks: [
                    "Подбор серийного или индивидуального",
                    "Материал стен и комплектация",
                    "Смета в договоре",
                ],
                ctaLabel: HUB_CHOOSE,
                ctaHref: routes.projects(),
                offers: [
                    {
                        title: "Каталог проектов",
                        href: routes.projects(),
                        moreLabel: MORE,
                        image: "/media/catalog/consult.jpg",
                    },
                    {
                        title: "Индивидуальный проект",
                        href: routes.projects({ kind: "individual" }),
                        moreLabel: MORE,
                        image: "/media/hero/own-project.jpg",
                    },
                ],
            },
            {
                id: "prep",
                title: "Подготовка",
                lead: "Сети, основание, площадка. Чтобы к выходу бригады участок был готов, а не «разберёмся потом».",
                checks: [
                    "Вводы, дренаж, отмостка",
                    "Фундамент под выбранную технологию",
                    "Складирование и подъезд техники",
                ],
                ctaLabel: CTA_SIGN_UP,
                ctaHref: MEET,
                offers: [
                    {
                        title: "Наружные сети и участок",
                        href: routes.worksStagesHub,
                        moreLabel: MORE,
                        image: "/media/stages/site.jpg",
                    },
                ],
            },
            {
                id: "build",
                title: "Стройка",
                lead: "Коробка по выбранной технологии: газобетон, кирпич, каркас, СИП или фахверк. Срок и состав работ - в договоре.",
                checks: [
                    "Стены, перекрытия, кровля",
                    "Фото этапов по ходу работ",
                    "Фиксированная смета",
                ],
                ctaLabel: "Смотреть этапы",
                ctaHref: routes.worksStagesHub,
                offers: [
                    {
                        title: "Фото этапов стройки",
                        href: routes.worksStagesHub,
                        moreLabel: MORE,
                        image: "/media/stages/facade.jpg",
                    },
                    {
                        title: "Открытая стройка",
                        href: routes.works,
                        moreLabel: MORE,
                        image: "/media/stages/visit-banner.jpg",
                    },
                ],
            },
            {
                id: "control",
                title: "Контроль",
                lead: "Смотрите, как идёт объект: фото, этапы, можно приехать. Вопросы по качеству - в рабочем порядке, не в конце.",
                checks: [
                    "Промежуточная приёмка узлов",
                    "Фотоотчёт этапов",
                    "Посещение площадки",
                ],
                ctaLabel: CTA_SIGN_UP,
                ctaHref: MEET,
                offers: [
                    {
                        title: "Этапы работ",
                        href: routes.worksStagesHub,
                        moreLabel: MORE,
                        image: "/media/stages/facade.jpg",
                    },
                ],
            },
            {
                id: "handover",
                title: "Сдача",
                lead: "Дом под ключ: инженерия, отделка по договору, ключи. Смета не «всплывает» в последний месяц.",
                checks: [
                    "Инженерия и отделка по комплектации",
                    "Приёмка и ключи",
                    "Гарантийные обязательства в акте",
                ],
                ctaLabel: CTA_SIGN_UP,
                ctaHref: MEET,
                offers: [
                    {
                        title: "Построенные дома",
                        href: routes.worksGallery(),
                        moreLabel: MORE,
                        image: "/media/built-strip/01.jpg",
                    },
                    {
                        title: "Внутренняя отделка",
                        href: routes.worksStagesHub,
                        moreLabel: MORE,
                        image: "/media/stages/interior.jpg",
                    },
                ],
            },
            {
                id: "after",
                title: "Сервис",
                lead: "После сдачи остаёмся на связи. Гарантия 7 лет на конструктив, вопросы по дому - в офис.",
                checks: [
                    `Гарантия ${settings.warrantyYears} лет`,
                    "Контакт бригады и офиса",
                    "Что по гарантии, что отдельно",
                ],
                ctaLabel: SERVICES_HUB_MEET,
                ctaHref: MEET,
                offers: [
                    {
                        title: "Контакты офиса",
                        href: routes.contacts,
                        moreLabel: MORE,
                        image: "/media/lead/office.jpg",
                    },
                ],
            },
        ],
        leadHeading: SERVICES_HUB_LEAD_HEADING,
        leadText: SERVICES_HUB_LEAD_TEXT,
        stats,
        works: [
            {
                title: NAV_WORKS_GALLERY,
                lead: SERVICES_HUB_WORKS_BUILT_LEAD,
                href: routes.worksGallery(),
                ctaLabel: SEE_HOUSES,
                image: "/media/built-strip/02.jpg",
            },
            {
                title: NAV_WORKS_STAGES,
                lead: SERVICES_HUB_WORKS_STAGES_LEAD,
                href: routes.worksStagesHub,
                ctaLabel: WORKS_STAGES_SEE,
                image: "/media/stages/facade.jpg",
            },
        ],
    };
}

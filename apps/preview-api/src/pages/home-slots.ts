export type HomeSlotDef = {
    slot: string;
    label: string;
    group: string;
    cluster?: string;
    defaultKey?: string;
};

const TECHS = [
    ["gas_concrete", "Газобетон"],
    ["brick", "Кирпич"],
    ["frame", "Каркас"],
    ["sip", "СИП"],
    ["fachwerk", "Фахверк"],
] as const;

export const HOME_SLOTS: HomeSlotDef[] = [
    {
        slot: "hero.banner",
        label: "Фон",
        group: "Баннер",
        cluster: "Фон",
        defaultKey: "hero/banner.jpg",
    },
    {
        slot: "hero.fargo",
        label: "Карточка Fargo",
        group: "Баннер",
        cluster: "Карусель",
        defaultKey: "hero/fargo.jpg",
    },
    {
        slot: "hero.hill",
        label: "Карточка Hill",
        group: "Баннер",
        cluster: "Карусель",
        defaultKey: "hero/hill.jpg",
    },
    {
        slot: "hero.visit",
        label: "Карточка визит",
        group: "Баннер",
        cluster: "Карусель",
        defaultKey: "hero/visit.jpg",
    },
    {
        slot: "hero.own-project",
        label: "Карточка свой проект",
        group: "Баннер",
        cluster: "Карусель",
        defaultKey: "hero/own-project.jpg",
    },
    {
        slot: "hero.kiskelovo",
        label: "Карточка Кискелово",
        group: "Баннер",
        cluster: "Карусель",
        defaultKey: "hero/kiskelovo.jpg",
    },
    ...[0, 1, 2, 3].map((i) => ({
        slot: `popular.serial.${i}`,
        label: `Серийный ${i + 1}`,
        group: "Популярные проекты",
    })),
    ...[0, 1, 2, 3].map((i) => ({
        slot: `popular.individual.${i}`,
        label: `Индивидуальный ${i + 1}`,
        group: "Популярные проекты",
    })),
    {
        slot: "tech.thumb.0",
        label: "Превью 1",
        group: "Технологии",
        defaultKey: "projects/reyn.jpg",
    },
    {
        slot: "tech.thumb.1",
        label: "Превью 2",
        group: "Технологии",
        defaultKey: "projects/arkada.jpg",
    },
    {
        slot: "tech.thumb.2",
        label: "Превью 3",
        group: "Технологии",
        defaultKey: "projects/kasl.jpg",
    },
    ...TECHS.flatMap(([id, label]) => [
        {
            slot: `tech.${id}.house`,
            label: `${label}: дом`,
            group: "Технологии",
            defaultKey: `tech/${id}/house.png`,
        },
        {
            slot: `tech.${id}.sample-a`,
            label: `${label}: образец A`,
            group: "Технологии",
            defaultKey: `tech/${id}/sample-a.jpg`,
        },
        {
            slot: `tech.${id}.sample-b`,
            label: `${label}: образец B`,
            group: "Технологии",
            defaultKey: `tech/${id}/sample-b.jpg`,
        },
    ]),
    {
        slot: "collection.second_light",
        label: "Второй свет",
        group: "Коллекции",
        defaultKey: "collections/second_light.jpg",
    },
    {
        slot: "collection.panorama",
        label: "Панорама",
        group: "Коллекции",
        defaultKey: "collections/panorama.jpg",
    },
    {
        slot: "collection.flat_roof",
        label: "Плоская крыша",
        group: "Коллекции",
        defaultKey: "collections/flat_roof.jpg",
    },
    {
        slot: "collection.garage",
        label: "Гараж",
        group: "Коллекции",
        defaultKey: "collections/garage.jpg",
    },
    {
        slot: "collection.terrace",
        label: "Терраса",
        group: "Коллекции",
        defaultKey: "collections/terrace.jpg",
    },
    {
        slot: "services.visit",
        label: "Визит на участок",
        group: "Услуги",
        defaultKey: "services/visit-house.jpg",
    },
    ...[1, 2, 3, 4, 5, 6, 7].map((n) => ({
        slot: `built.${n - 1}`,
        label: `Лента ${String(n).padStart(2, "0")}`,
        group: "Построенные",
        defaultKey: `built-strip/${String(n).padStart(2, "0")}.jpg`,
    })),
    {
        slot: "blog.0",
        label: "С чего начать",
        group: "Блог",
        defaultKey: "blog/start-survey.jpg",
    },
    {
        slot: "blog.1",
        label: "Выбор технологии",
        group: "Блог",
        defaultKey: "blog/tech-materials.jpg",
    },
    {
        slot: "blog.2",
        label: "Фундамент",
        group: "Блог",
        defaultKey: "blog/foundation-crack.jpg",
    },
    {
        slot: "stages.plot",
        label: "Участок",
        group: "Этапы",
        defaultKey: "stages/plot.jpg",
    },
    {
        slot: "stages.site",
        label: "Сети и участок",
        group: "Этапы",
        defaultKey: "stages/site.jpg",
    },
    {
        slot: "stages.facade",
        label: "Фасады",
        group: "Этапы",
        defaultKey: "stages/facade.jpg",
    },
    {
        slot: "stages.interior",
        label: "Отделка",
        group: "Этапы",
        defaultKey: "stages/interior.jpg",
    },
    {
        slot: "lead.office",
        label: "Офис",
        group: "Заявка",
        defaultKey: "lead/office.jpg",
    },
];

export function isHomeSlot(slot: string): boolean {
    return HOME_SLOTS.some((row) => row.slot === slot);
}

export function fallbackHomeUrls(): Record<string, string> {
    return Object.fromEntries(
        HOME_SLOTS.filter((row) => row.defaultKey).map((row) => [
            row.slot,
            `/media/${row.defaultKey}`,
        ])
    );
}

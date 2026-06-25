import type { Partner } from "@/domain/partner";

// Fallback-данные партнёров: отдаются, когда ncottage-api недоступен. Этот же
// массив — источник сидов в БД.
export const PARTNERS: Partner[] = [
    { slug: "lsr", name: "ЛСР", href: "https://www.lsr.ru", category: "материалы" },
    {
        slug: "top-house",
        name: "Top House",
        href: "https://www.tophouse.ru",
        category: "домокомплекты",
    },
    {
        slug: "petrovich",
        name: "Петрович",
        href: "https://petrovich.ru",
        category: "строительные материалы",
    },
    {
        slug: "penopleks",
        name: "Пеноплекс",
        href: "https://www.penoplex.ru",
        category: "теплоизоляция",
    },
    {
        slug: "paroc",
        name: "Paroc",
        href: "https://www.paroc.ru",
        category: "изоляция",
    },
    {
        slug: "rockwool",
        name: "Rockwool",
        href: "https://www.rockwool.ru",
        category: "каменная вата",
    },
    {
        slug: "nanoizol",
        name: "Наноизол",
        href: "https://www.nanoizol.com",
        category: "мембраны",
    },
    {
        slug: "izospan",
        name: "Изоспан",
        href: "https://isospan.gexa.ru",
        category: "изоляционные материалы",
    },
    { slug: "renessans-beton", name: "Ренессанс Бетон", category: "бетон" },
    {
        slug: "monolit",
        name: "Монолит",
        href: "https://www.monolittex.ru",
        category: "строительные решения",
    },
    {
        slug: "greenside",
        name: "Greenside",
        href: "https://www.greenside.ru",
        category: "фасады",
    },
    {
        slug: "quickdeck",
        name: "QuickDeck",
        href: "https://quickdeck.ru",
        category: "плиты",
    },
];

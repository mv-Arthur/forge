export const COMPANY_NAME = "Новый Коттедж";

export type CityCode = "spb" | "msk";

export type City = { code: CityCode; label: string };

export type Phone = { number: string; display: string };

export const CITIES: City[] = [
    { code: "spb", label: "Санкт-Петербург" },
    { code: "msk", label: "Москва" },
];

export const PHONES: Record<CityCode, Phone> = {
    spb: { number: "+78123093818", display: "+7 (812) 309-38-18" },
    msk: { number: "+74952043856", display: "+7 (495) 204-38-56" },
};

export const EMAIL = "info@ncottage.ru";

export const ADDRESSES = {
    spb: "г. Санкт-Петербург, ул. Заставская, д. 31, к. 2, оф. 413",
    msk: "Варшавское ш. 35 с1, БЦ Ривер Плаза, оф. 412",
    lenobl: "Ленинградская область",
    novobl: "Новгородская область",
};

export const SOCIAL = {
    vk: "https://vk.com/ncottage",
    telegram: "https://t.me/ncottage",
    whatsapp: "https://wa.me/78123093818",
    website: "https://ncottage.ru",
};

export const WORK_HOURS = "Пн–Пт: 10:00–19:00";

export const LEGAL = {
    ogrn: "1187847109823",
    inn: "7802663069",
    kpp: "781401001",
};

export const NAV_ITEMS = [
    { label: "Проекты", href: "/projects" },
    {
        label: "Услуги",
        href: "/services",
        children: [
            { label: "Проектирование", href: "/services/design" },
            { label: "Строительство", href: "/services/construction" },
            { label: "Фундаменты", href: "/services/foundations" },
            { label: "Бани", href: "/services/baths" },
            { label: "Отделка", href: "/services/finishing" },
            { label: "Благоустройство", href: "/services/landscaping" },
            {
                label: "Инженерные сети",
                href: "/services/engineering",
            },
        ],
    },
    { label: "Наши работы", href: "/our-works" },
    {
        label: "Клиентам",
        href: "/about",
        children: [
            { label: "О компании", href: "/about" },
            { label: "Отзывы", href: "/reviews" },
            { label: "Гарантия", href: "/about#guarantee" },
            { label: "FAQ", href: "/faq" },
            { label: "Оплата", href: "/about#payment" },
        ],
    },
    { label: "Акции", href: "/promotions" },
    { label: "Контакты", href: "/contacts" },
];

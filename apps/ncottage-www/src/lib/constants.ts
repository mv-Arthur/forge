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
    spb: "ул. Заставская, д. 31, к. 2, оф. 413",
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

export type NavSubItem = { label: string; href: string };

export type NavMegaMenuColumn = {
    title: string;
    items: NavSubItem[];
};

export type NavItem = {
    label: string;
    href: string;
    children?: NavSubItem[];
    megaMenu?: NavMegaMenuColumn[];
    badge?: "sale";
};

export const PROJECT_CATEGORIES: NavMegaMenuColumn[] = [
    {
        title: "Технологии",
        items: [
            { label: "Каркасные дома", href: "/projects/frame" },
            { label: "Дома из кирпича", href: "/projects/brick" },
            { label: "Дома из газобетона", href: "/projects/aerocrete" },
            { label: "Дома из СИП панелей", href: "/projects/sip" },
            { label: "Дома из пеноблоков", href: "/projects/foam-block" },
            { label: "Быстровозводимые", href: "/projects/prefab" },
            { label: "Модульные", href: "/projects/modular" },
            { label: "Щитовые", href: "/projects/shield" },
            { label: "Панельные", href: "/projects/panel" },
            { label: "Проекты фахверковых домов", href: "/projects/fachwerk" },
            {
                label: "Дома из блоков под ключ",
                href: "/projects/block-turnkey",
            },
            {
                label: "Дома из газосиликатных блоков",
                href: "/projects/aerated-silicate",
            },
            { label: "Комбинированные дома", href: "/projects/combined" },
            {
                label: "Проекты домов со стеклянными стенами",
                href: "/projects/glass-walls",
            },
            {
                label: "Энергоэффективные дома",
                href: "/projects/energy-efficient",
            },
        ],
    },
    {
        title: "Стиль",
        items: [
            { label: "Финские", href: "/projects/finnish" },
            { label: "Американские", href: "/projects/american" },
            { label: "Модерн", href: "/projects/modern" },
            { label: "Лофт", href: "/projects/loft" },
            { label: "Современные", href: "/projects/contemporary" },
            { label: "Скандинавские", href: "/projects/scandinavian" },
            { label: "Райт", href: "/projects/wright" },
            { label: "Хай-тек", href: "/projects/hi-tech" },
            {
                label: "Проекты американских домов",
                href: "/projects/american-style",
            },
        ],
    },
    {
        title: "Площадь",
        items: [
            { label: "До 150 кв.м.", href: "/projects/area-150" },
            { label: "До 250 кв.м.", href: "/projects/area-250" },
            { label: "До 300 кв.м.", href: "/projects/area-300" },
            { label: "До 400 кв.м.", href: "/projects/area-400" },
            { label: "До 500 кв.м.", href: "/projects/area-500" },
            { label: "До 600 кв.м.", href: "/projects/area-600" },
        ],
    },
    {
        title: "Размер",
        items: [
            { label: "8x12", href: "/projects/size-8x12" },
            { label: "9x9", href: "/projects/size-9x9" },
            { label: "9x10", href: "/projects/size-9x10" },
            { label: "9x12", href: "/projects/size-9x12" },
            { label: "10x12", href: "/projects/size-10x12" },
            { label: "10x13", href: "/projects/size-10x13" },
            { label: "10x14", href: "/projects/size-10x14" },
            { label: "11x11", href: "/projects/size-11x11" },
            { label: "12x14", href: "/projects/size-12x14" },
            { label: "15x15", href: "/projects/size-15x15" },
        ],
    },
    {
        title: "Виды домов",
        items: [
            { label: "Дачные", href: "/projects/country" },
            { label: "Гостевые", href: "/projects/guest" },
            {
                label: "Для постоянного проживания",
                href: "/projects/permanent",
            },
            { label: "Загородные дома", href: "/projects/suburban" },
            { label: "Гостиницы", href: "/projects/hotels" },
            {
                label: "Строительство загородных домов",
                href: "/projects/suburban-construction",
            },
            { label: "Проекты мини гостиниц", href: "/projects/mini-hotels" },
            { label: "Дома в стиле шале", href: "/projects/chalet" },
        ],
    },
    {
        title: "Особенность",
        items: [
            { label: "С террасой", href: "/projects/with-terrace" },
            { label: "С гаражом", href: "/projects/with-garage" },
            { label: "С сауной", href: "/projects/with-sauna" },
            { label: "С котельной", href: "/projects/with-boiler" },
            {
                label: "С панорамными окнами",
                href: "/projects/panoramic-windows",
            },
            {
                label: "Проекты домов с мансардой и террасой",
                href: "/projects/attic-terrace",
            },
            { label: "С зимним садом", href: "/projects/winter-garden" },
            { label: "С кухней гостиной", href: "/projects/kitchen-living" },
            {
                label: "Проекты домов с мансардой и гаражом",
                href: "/projects/attic-garage",
            },
            {
                label: "С гаражом и террасой",
                href: "/projects/garage-terrace",
            },
            { label: "С зоной барбекю", href: "/projects/bbq" },
            {
                label: "Проекты домов с лестницей в центре дома",
                href: "/projects/central-stairs",
            },
            {
                label: "С гаражом на 2 машины",
                href: "/projects/two-car-garage",
            },
            {
                label: "С цокольным этажом и гаражом",
                href: "/projects/basement-garage",
            },
        ],
    },
    {
        title: "Этажность",
        items: [
            { label: "Одноэтажные", href: "/projects/one-story" },
            { label: "Полутораэтажные", href: "/projects/one-and-half" },
            { label: "Двухэтажные", href: "/projects/two-story" },
            { label: "С мансардой", href: "/projects/attic" },
        ],
    },
];

export const NAV_ITEMS: NavItem[] = [
    {
        label: "Проекты",
        href: "/projects",
        megaMenu: PROJECT_CATEGORIES,
    },
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
    { label: "Акции", href: "/promotions", badge: "sale" },
    { label: "Контакты", href: "/contacts" },
];

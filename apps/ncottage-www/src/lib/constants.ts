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
    spb: "Санкт-Петербург, Комендантский проспект, д. 4",
    msk: "Варшавское шоссе 35 с1, БЦ Ривер Плаза, офис 412",
    lenobl: "Ленинградская область, Всеволожский район, д. Лепсари, промзона Спутник 4 проезд",
    novobl: "Новгородская область, Окуловский район, с/п Боровёнковское",
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

export type HeroContent = {
    subtitle: string;
    title: string;
    text: string;
    cta: { label: string; href: string };
    image: { src: string; alt: string };
};

export const HERO: HeroContent = {
    subtitle: "Строительная компания Новый Коттедж",
    title: "Строительство домов",
    text: "стильная эргономика и комфорт загородной жизни",
    cta: { label: "Каталог проектов", href: "/projects" },
    image: { src: "/images/hero/banner.jpg", alt: "" },
};

export type RangeBounds = { min: number; max: number };

export type SelectOption = { value: string; label: string };

export type ProjectPickerContent = {
    title: string;
    text: string;
    price: RangeBounds;
    area: RangeBounds;
    technologies: SelectOption[];
    floors: SelectOption[];
    submitLabel: string;
};

export type CategoriesSectionContent = {
    title: string;
    cta: {
        title: string;
        text: string;
        ctaLabel: string;
    };
};

export const CATEGORIES_SECTION: CategoriesSectionContent = {
    title: "Строительство домов в СПб и ЛО",
    cta: {
        title: "Не знаете, что выбрать?",
        text: "Оставьте заявку и наши специалисты свяжутся с вами в самое ближайшее время!",
        ctaLabel: "Бесплатная консультация",
    },
};

export type AdvantageItem = {
    icon: string;
    title: string;
    text: string;
};

export type AdvantagesSectionContent = {
    title: string;
    text: string;
    background: string;
    items: AdvantageItem[];
};

export const ADVANTAGES_SECTION: AdvantagesSectionContent = {
    title: "6 причин обратиться в компанию «Новый Коттедж»",
    text: "Наша миссия — обеспечить людей желающих перебраться жить на природу недорогим, качественным загородным жильём.",
    background: "/images/advantages/bg.png",
    items: [
        {
            icon: "/images/advantages/i1.png",
            title: "Квалифицированные инженеры",
            text: "Делаем расчёт нагрузок и закладываем запас прочности, чтобы дом получился надёжным и служил долго.",
        },
        {
            icon: "/images/advantages/i2.png",
            title: "Опытные строители",
            text: "Специалисты с высшим строительным образованием. Постоянные монтажные бригады с опытом более 10 лет.",
        },
        {
            icon: "/images/advantages/i3.png",
            title: "Прозрачное ценообразование",
            text: "Мы считаем строительные объёмы каждого проекта, а не привязываемся к квадратному метру.",
        },
        {
            icon: "/images/advantages/i4.png",
            title: "Закрытая смета",
            text: "Никаких скрытых платежей и увеличения стоимости сверх оговоренных расходов.",
        },
        {
            icon: "/images/advantages/i5.png",
            title: "Контроль качества",
            text: "Видеонаблюдение на объекте и надзор за соблюдением проектных решений.",
        },
        {
            icon: "/images/advantages/i6.png",
            title: "Официально и с гарантиями",
            text: "Работаем по договору, в котором прописаны сроки выполнения работ и состав проекта.",
        },
    ],
};

import type {
    Project,
    ProjectFeature,
    ProjectLivingType,
    ProjectStyle,
    Technology,
} from "@/types/project";

export const TECHNOLOGY_GENITIVE: Record<string, string> = {
    "gas-concrete": "газобетона",
    brick: "кирпича",
    frame: "каркаса",
    sip: "СИП-панелей",
    fachwerk: "фахверка",
    "foam-block": "пеноблоков",
    modular: "модулей",
    combined: "комбинированных материалов",
};

export const PROJECT_TECHNOLOGY_LABELS: Record<Technology, string> = {
    "gas-concrete": "Газобетон",
    brick: "Кирпич",
    frame: "Каркас",
    sip: "СИП-панели",
    fachwerk: "Фахверк",
    "foam-block": "Пеноблоки",
    modular: "Модульные",
    combined: "Комбинированные",
};

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

export const PROJECTS: Project[] = [
    {
        slug: "nord",
        name: "Норд",
        technology: "gas-concrete",
        area: 156,
        floors: 2,
        bedrooms: 4,
        bathrooms: 2,
        price: 4850000,
        image: "/images/projects/nord.jpg",
        images: ["/images/projects/nord.jpg"],
        description:
            "Современный двухэтажный дом из газобетона с панорамными окнами и просторной террасой.",
        specs: {
            dimensions: "10x13",
            roofType: "Двускатная",
            foundation: "Ленточный",
            wallMaterial: "Газобетон D400",
            buildTime: "4-5 месяцев",
        },
        style: "modern",
        features: ["panoramic-windows", "terrace", "second-light"],
        livingType: "permanent",
        featured: true,
    },
    {
        slug: "alaster",
        name: "Аластер",
        technology: "brick",
        area: 210,
        floors: 2,
        bedrooms: 5,
        bathrooms: 3,
        price: 7200000,
        image: "/images/projects/alaster.jpg",
        images: ["/images/projects/alaster.jpg"],
        description:
            "Классический кирпичный дом с мансардой, гаражом и вторым светом в гостиной.",
        specs: {
            dimensions: "13x16",
            roofType: "Вальмовая",
            foundation: "Плитный",
            wallMaterial: "Кирпич",
            buildTime: "6-8 месяцев",
        },
        style: "german",
        features: ["attic", "garage", "second-light", "terrace"],
        livingType: "permanent",
        featured: true,
    },
    {
        slug: "valter",
        name: "Вальтер",
        technology: "gas-concrete",
        area: 180,
        floors: 2,
        bedrooms: 4,
        bathrooms: 2,
        price: 5600000,
        image: "/images/projects/valter.jpg",
        images: ["/images/projects/valter.jpg"],
        description:
            "Элегантный дом с плоской кровлей в стиле хай-тек. Большая терраса и второй свет.",
        specs: {
            dimensions: "12x14",
            roofType: "Плоская",
            foundation: "Монолитная плита",
            wallMaterial: "Газобетон D500",
            buildTime: "5-6 месяцев",
        },
        style: "hi-tech",
        features: ["panoramic-windows", "second-light", "terrace"],
        livingType: "permanent",
        featured: true,
    },
    {
        slug: "eliot",
        name: "Элиот",
        technology: "frame",
        area: 120,
        floors: 1,
        bedrooms: 3,
        bathrooms: 1,
        price: 3200000,
        image: "/images/projects/eliot.jpg",
        images: ["/images/projects/eliot.jpg"],
        description:
            "Компактный одноэтажный каркасный дом для постоянного проживания семьи из 3-4 человек.",
        specs: {
            dimensions: "10x12",
            roofType: "Двускатная",
            foundation: "Свайно-винтовой",
            wallMaterial: "Каркас + утеплитель 200мм",
            buildTime: "2-3 месяца",
        },
        style: "finnish",
        features: ["terrace"],
        livingType: "permanent",
        featured: true,
    },
    {
        slug: "faust",
        name: "Фауст",
        technology: "frame",
        area: 95,
        floors: 1,
        bedrooms: 2,
        bathrooms: 1,
        price: 2400000,
        image: "/images/projects/faust.jpg",
        images: ["/images/projects/faust.jpg"],
        description:
            "Уютный каркасный дом для загородного отдыха с открытой планировкой.",
        specs: {
            dimensions: "8x12",
            roofType: "Двускатная",
            foundation: "Свайно-винтовой",
            wallMaterial: "Каркас + утеплитель 150мм",
            buildTime: "2 месяца",
        },
        style: "minimalism",
        features: ["terrace", "guest"],
        livingType: "seasonal",
        featured: false,
    },
    {
        slug: "berg",
        name: "Берг",
        technology: "sip",
        area: 140,
        floors: 2,
        bedrooms: 4,
        bathrooms: 2,
        price: 3800000,
        image: "/images/projects/berg.jpg",
        images: ["/images/projects/berg.jpg"],
        description:
            "Энергоэффективный дом из СИП-панелей с быстрой сборкой и отличной теплоизоляцией.",
        specs: {
            dimensions: "10x12",
            roofType: "Двускатная",
            foundation: "Ленточный",
            wallMaterial: "СИП-панели 174мм",
            buildTime: "2-3 месяца",
        },
        style: "minimalism",
        features: ["boiler-room", "balcony"],
        livingType: "permanent",
        featured: true,
    },
    {
        slug: "karl",
        name: "Карл",
        technology: "brick",
        area: 240,
        floors: 2,
        bedrooms: 5,
        bathrooms: 3,
        price: 8500000,
        image: "/images/projects/karl.jpg",
        images: ["/images/projects/karl.jpg"],
        description:
            "Просторный кирпичный дом премиум-класса с бассейном и сауной.",
        specs: {
            dimensions: "14x18",
            roofType: "Многоскатная",
            foundation: "Монолитная плита",
            wallMaterial: "Кирпич + утеплитель",
            buildTime: "8-10 месяцев",
        },
        style: "chalet",
        features: [
            "garage",
            "boiler-room",
            "terrace",
            "balcony",
            "with-utilities",
            "ready",
        ],
        livingType: "permanent",
        featured: true,
    },
    {
        slug: "otto",
        name: "Отто",
        technology: "gas-concrete",
        area: 130,
        floors: 1,
        bedrooms: 3,
        bathrooms: 2,
        price: 4100000,
        image: "/images/projects/otto.jpg",
        images: ["/images/projects/otto.jpg"],
        description:
            "Одноэтажный дом из газобетона с панорамным остеклением и террасой.",
        specs: {
            dimensions: "12x11",
            roofType: "Плоская",
            foundation: "Ленточный",
            wallMaterial: "Газобетон D400",
            buildTime: "3-4 месяца",
        },
        style: "minimalism",
        features: ["panoramic-windows", "terrace", "bay-window"],
        livingType: "permanent",
        featured: false,
    },
];

export type PopularProjectsTab = {
    id: string;
    label: string;
    technology: string | null;
};

export type PopularProjectsSectionContent = {
    title: string;
    tabs: PopularProjectsTab[];
    titlePrefix: string;
    priceLabel: string;
    statLabels: {
        area: string;
        bedrooms: string;
        bathrooms: string;
        floors: string;
        size: string;
    };
    cta: { label: string; href: string };
};

export const POPULAR_PROJECTS_SECTION: PopularProjectsSectionContent = {
    title: "Популярные проекты",
    titlePrefix: "Дом из",
    priceLabel: "Цена от:",
    tabs: [
        { id: "all", label: "Загородные дома", technology: null },
        {
            id: "gas-concrete",
            label: "Дома из газобетона",
            technology: "gas-concrete",
        },
        { id: "brick", label: "Кирпичные дома", technology: "brick" },
        { id: "frame", label: "Каркасные дома", technology: "frame" },
        { id: "sip", label: "СИП дома", technology: "sip" },
    ],
    statLabels: {
        area: "Площадь",
        bedrooms: "Спальни",
        bathrooms: "Санузлов",
        floors: "Этажей",
        size: "Размер",
    },
    cta: {
        label: "Смотреть больше проектов",
        href: "/projects",
    },
};

export type OurWorksSectionTab = {
    id: string;
    label: string;
    href?: string;
};

export type OurWorksSectionContent = {
    title: string;
    tabs: OurWorksSectionTab[];
    cta: { label: string; href: string };
};

export const OUR_WORKS_SECTION: OurWorksSectionContent = {
    title: "Наши работы",
    tabs: [
        { id: "objects", label: "Построенные объекты" },
        { id: "map", label: "Объекты на карте", href: "/map" },
    ],
    cta: {
        label: "Смотреть все построенные объекты",
        href: "/our-works",
    },
};

export type ViewRequestSectionContent = {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    submitLabel: string;
    privacy: {
        text: string;
        linkLabel: string;
        linkHref: string;
    };
    successTitle: string;
    successText: string;
};

export const VIEW_REQUEST_SECTION: ViewRequestSectionContent = {
    title: "Оставить заявку на просмотр построенных домов",
    nameLabel: "Ваше имя",
    namePlaceholder: "Ваше имя",
    phoneLabel: "Телефон",
    phonePlaceholder: "Телефон *",
    submitLabel: "Отправить",
    privacy: {
        text: "Нажимая на кнопку «Отправить», вы даёте согласие на обработку своих персональных данных. Ознакомиться с",
        linkLabel: "политикой конфиденциальности.",
        linkHref: "/privacy",
    },
    successTitle: "Заявка отправлена",
    successText: "Мы свяжемся с вами в течение 15 минут.",
};

export type FooterMenuItem = {
    label: string;
    href: string;
};

export type FooterMenu = {
    title: string;
    items: FooterMenuItem[];
};

export type FooterOffice = {
    address: string;
    mapHref: string;
    hours: string;
    email: string;
    phone: Phone;
};

export type FooterBottomLink = {
    label: string;
    href: string;
    external?: boolean;
};

export type FooterContent = {
    projects: FooterMenu;
    company: FooterMenu;
    services: FooterMenu;
    contactsTitle: string;
    socialLabel: string;
    legal: { ogrn: string; inn: string; kpp: string };
    offices: FooterOffice[];
    bottomLinks: FooterBottomLink[];
    copyright: string;
    disclaimer: string;
    mapLinkLabel: string;
    toTopLabel: string;
};

export const FOOTER: FooterContent = {
    projects: {
        title: "Проекты",
        items: [
            { label: "Дома из газобетона", href: "/projects/aerocrete" },
            { label: "Кирпичные дома", href: "/projects/brick" },
            { label: "Каркасные дома", href: "/projects/frame" },
            { label: "Дома из СИП-панелей", href: "/projects/sip" },
            { label: "Проекты домов", href: "/projects" },
            { label: "Дома из блоков", href: "/projects/foam-block" },
            {
                label: "Жилые дома для постоянного проживания",
                href: "/projects/permanent",
            },
            {
                label: "Готовые одноэтажные проекты",
                href: "/projects/one-story",
            },
            {
                label: "Строительство теплых деревянных домов",
                href: "/services/construction",
            },
            { label: "Стоимость строительных работ", href: "/projects" },
        ],
    },
    company: {
        title: "Компания",
        items: [
            { label: "О компании", href: "/about" },
            { label: "Наши работы", href: "/our-works" },
            { label: "Гарантия на постройку", href: "/about#guarantee" },
            { label: "Акции", href: "/promotions" },
            { label: "Вакансии", href: "/about/vacancy" },
            { label: "Реквизиты", href: "/about/legal" },
        ],
    },
    services: {
        title: "Услуги",
        items: [
            {
                label: "Индивидуальное проектирование",
                href: "/services/design",
            },
            {
                label: "Строительство коттеджей под ключ",
                href: "/services/construction",
            },
            { label: "Возведение фундамента", href: "/services/foundation" },
            { label: "Отделка загородных домов", href: "/services/finishing" },
            { label: "Монтаж инженерных сетей", href: "/services/engineering" },
        ],
    },
    contactsTitle: "Контакты",
    socialLabel: "Мы в соц. сетях:",
    legal: LEGAL,
    offices: [
        {
            address:
                "г. Санкт-Петербург, Комендантский проспект, д. 4, офис 405",
            mapHref: "/contacts",
            hours: "Пн-Пт, с 10:00 до 19:00",
            email: EMAIL,
            phone: PHONES.spb,
        },
        {
            address: "Москва, 1-й Нагатинский проезд, д. 2, офис 6",
            mapHref: "/contacts",
            hours: "Пн-Пт, с 10:00 до 19:00",
            email: EMAIL,
            phone: PHONES.msk,
        },
    ],
    bottomLinks: [
        { label: "Обработка персональных данных", href: "/privacy" },
        {
            label: "Политика конфиденциальности",
            href: "/privacy",
            external: true,
        },
        { label: "Карта сайта", href: "/sitemap" },
    ],
    copyright:
        '© 2008 - 2026 Компания "Новый Коттедж" - в работе используются современные строительные материалы, технологии и конструкции.',
    disclaimer:
        "Публичная оферта. Вся представленная на сайте информация носит информационный характер и ни при каких условиях не является публичной офертой, определяемой положением Статьи 437(2) Гражданского кодекса РФ.",
    mapLinkLabel: "Смотреть на карте",
    toTopLabel: "Наверх",
};

export type ContactsMapContent = {
    title: string;
    addresses: string[];
    phones: Phone[];
    email: string;
    hours: string;
    mapUrl: string;
    mapTitle: string;
};

export const CONTACTS_MAP: ContactsMapContent = {
    title: "Наши контакты",
    addresses: [
        ADDRESSES.spb,
        ADDRESSES.msk,
        ADDRESSES.lenobl,
        ADDRESSES.novobl,
    ],
    phones: [PHONES.spb, PHONES.msk],
    email: EMAIL,
    hours: "10:00-19:00",
    mapUrl: "https://yandex.ru/map-widget/v1/?um=constructor%3A2d90c25ab0936eb15651abcde0660b4d6c2d3ab5fbe77c29046669dfcb0394ab&source=constructor",
    mapTitle: "Наши офисы на карте",
};

export type ContactFormContent = {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    privacy: {
        text: string;
        linkLabel: string;
        linkHref: string;
    };
    image: {
        src: string;
        alt: string;
    };
    successTitle: string;
    successText: string;
};

export const CONTACT_FORM: ContactFormContent = {
    title: "Остались вопросы?",
    subtitle: "Оставьте номер телефона, мы перезвоним Вам в течение 15 минут!",
    nameLabel: "Ваше имя",
    namePlaceholder: "Ваше имя",
    phoneLabel: "Телефон",
    phonePlaceholder: "Телефон *",
    messageLabel: "Сообщение",
    messagePlaceholder: "Сообщение",
    submitLabel: "Задать вопрос специалистам",
    privacy: {
        text: 'Нажимая на кнопку "Задать вопрос специалистам", вы даете согласие на обработку своих персональных данных. Ознакомиться с',
        linkLabel: "политикой конфиденциальности.",
        linkHref: "/privacy",
    },
    image: {
        src: "https://ncottage.ru/app/themes/sage/dist/images/svg/devyshka-photo-form.svg",
        alt: "Менеджер по работе с клиентами",
    },
    successTitle: "Заявка отправлена",
    successText: "Мы свяжемся с вами в течение 15 минут.",
};

export type CtaSectionContent = {
    title: string;
    text: string;
    buttonLabel: string;
    image: {
        src: string;
        alt: string;
    };
};

export const CTA_SECTION: CtaSectionContent = {
    title: "Хотите оригинальный дом, не похожий ни на один другой?",
    text: "Закажите разработку индивидуального проекта с учетом всех ваших пожеланий и предпочтений!",
    buttonLabel: "Оставить заявку на проектирование",
    image: {
        src: "https://ncottage.ru/app/uploads/2019/10/house.png",
        alt: "Проект дома",
    },
};

export type Review = {
    id: string;
    author: string;
    date: string;
    text: string;
    image?: string;
    videoUrl?: string;
};

export type ReviewsSectionContent = {
    title: string;
    showMoreLabel: string;
    prevLabel: string;
    nextLabel: string;
    reviews: Review[];
};

export const REVIEWS_SECTION: ReviewsSectionContent = {
    title: "Отзывы о нашей работе:",
    showMoreLabel: "Весь отзыв",
    prevLabel: "Предыдущий отзыв",
    nextLabel: "Следующий отзыв",
    reviews: [
        {
            id: "r1",
            author: "Алексей",
            date: "22.02.2019",
            image: "https://ncottage.ru/app/uploads/2020/03/pgb2favbgwu-e1591215656105.jpg",
            text: "Выбирали каркасный дом. Сразу пригласили на стройку показали построенный дом, который отделывали искусственным камнем. Менеджер Антон рассказал про все нюансы строительства каркасного дома. Выбрали типовой проект Аркада, и внесли изменения в планировку. Сделали очень быстро. Дом под крышу собрали за 3 недели и обшили плитами. Мы очень довольны.",
        },
        {
            id: "r2",
            author: "Михаил",
            date: "06.03.2019",
            image: "https://ncottage.ru/app/uploads/2020/05/6ad24f1f-b37b-4958-ba9f-4cddbefbcdf0.jpg",
            text: "Собирали зимой СИП дом. Сделали за 2 месяца с внешней отделкой. Повесили камеру нам на стройку, очень удобно не надо было ездить. Домом очень довольны. Ребята молодцы!",
        },
        {
            id: "r3",
            author: "Андрей",
            date: "17.03.2019",
            image: "https://ncottage.ru/app/uploads/2020/05/7907140c-e0ad-471f-b3c6-7cfb254819c5.jpg",
            text: "Заказывали коробку дома из СИП панелей. Предложили нам лучшую цену. Да ещё нашли ошибки в нашем проекте, которые сами же и исправили. Дом собрали за 3 недели и накрыли кровлей. Монтажники русские, работают оперативно.",
        },
        {
            id: "r4",
            author: "Оксана",
            date: "22.06.2019",
            image: "https://ncottage.ru/app/uploads/2020/04/v5r13te5esq.jpg",
            text: "Когда выбирали строительную компанию обращались в разные фирмы. У нас на участке столбы выпирает из земли, и она поднимается и опускается зимой и весной. Поэтому старый дом весь покосился. Везде нам предлагали разные решения от замены грунта до «сделаем как Вы хотите». В ребятах понравилось, что они сразу же предложили сделать геологию, а уже после предлагать какие-то решения. В итоге спроектировали нам фундамент на основе свай и плиты с лентой. Получилось значительно дешевле чем у соседей с заменой грунта. Построили дом из газобетона с внешней отделкой за 3 месяца. Особенно порадовали кирпичные вентканалы, очень престижно смотрятся на крыше.",
        },
        {
            id: "r5",
            author: "Татьяна",
            date: "06.09.2021",
            videoUrl: "https://www.youtube.com/embed/zgDZH0EjGKs",
            text: "Мне даже не верится, что за такой короткий срок смогли реализовать нашу мечту! Огромное спасибо всем ребятам, кто участвовал в строительстве нашего дома.",
        },
        {
            id: "r6",
            author: "Евгений и Ирина",
            date: "24.11.2021",
            videoUrl: "https://www.youtube.com/embed/q2qF9IPXvEA",
            text: "Двухэтажный дом из СИП панелей, на железобетонных сваях",
        },
    ],
};

export type StagesSectionStage = {
    num: string;
    title: string;
};

export type StagesSectionContent = {
    title: string;
    stages: StagesSectionStage[];
};

export const STAGES_SECTION: StagesSectionContent = {
    title: "Этапы работы с нами",
    stages: [
        { num: "01", title: "Встреча в офисе" },
        { num: "02", title: "Заключение договора" },
        { num: "03", title: "Разработка проекта" },
        { num: "04", title: "Строительство дома" },
        { num: "05", title: "Технический надзор" },
        { num: "06", title: "Сдача дома" },
    ],
};

export type QuizSpeaker = {
    name: string;
    role: string;
    avatar: string;
};

export type QuizImageOption = {
    value: string;
    label: string;
    image?: string;
};

export type QuizTextOption = {
    value: string;
    label: string;
};

export type QuizStep =
    | {
          kind: "image-choice";
          fieldId: string;
          label: string;
          cloud: string;
          options: QuizImageOption[];
      }
    | {
          kind: "range";
          fieldId: string;
          label: string;
          cloud: string;
          min: number;
          max: number;
          step: number;
          default: number;
          unit: string;
      }
    | {
          kind: "text-radio";
          fieldId: string;
          label: string;
          cloud: string;
          options: QuizTextOption[];
          required?: boolean;
      }
    | {
          kind: "contact";
          cloud: string;
          heading: string;
          nameLabel: string;
          namePlaceholder: string;
          phoneLabel: string;
          phonePlaceholder: string;
      };

export type QuizSectionContent = {
    title: string;
    speaker: QuizSpeaker;
    prevLabel: string;
    nextLabel: string;
    submitLabel: string;
    lastStepLabel: string;
    successTitle: string;
    successText: string;
    steps: QuizStep[];
};

export const QUIZ_SECTION: QuizSectionContent = {
    title: "Ответьте на 6 вопросов ниже и узнайте предварительную смету под ваш бюджет и параметры",
    speaker: {
        name: "Антон",
        role: "специалист по строительству",
        avatar: "/images/quiz/anton.webp",
    },
    prevLabel: "Назад",
    nextLabel: "Далее",
    submitLabel: "Получить расчёт",
    lastStepLabel: "Заключительный шаг",
    successTitle: "Заявка отправлена",
    successText:
        "Мы рассчитаем стоимость и свяжемся с вами в течение 15 минут.",
    steps: [
        {
            kind: "image-choice",
            fieldId: "floors",
            label: "Этаж дома",
            cloud: "Расскажите, сколько этажей будет в вашем доме? Выберите один из вариантов ответа.",
            options: [
                {
                    value: "1 этаж",
                    label: "1 этаж",
                    image: "/images/quiz/1floor.jpg",
                },
                {
                    value: "1 этаж с мансардой",
                    label: "1 этаж с мансардой",
                    image: "/images/quiz/1floor-mansard.jpg",
                },
                {
                    value: "2 этажа",
                    label: "2 этажа",
                    image: "/images/quiz/2floor.jpg",
                },
                {
                    value: "unknown",
                    label: "Не знаю, нужна консультация",
                },
            ],
        },
        {
            kind: "range",
            fieldId: "area",
            label: "Площадь дома",
            cloud: "Отлично! Теперь укажите желаемую площадь дома.",
            min: 50,
            max: 400,
            step: 10,
            default: 250,
            unit: "м²",
        },
        {
            kind: "image-choice",
            fieldId: "foundation",
            label: "Фундамент дома",
            cloud: "Супер! Осталось всего 3 шага, чтобы узнать предварительную смету под ваш бюджет.",
            options: [
                {
                    value: "Сваи",
                    label: "Сваи",
                    image: "/images/quiz/foundation-piles.jpg",
                },
                {
                    value: "Монолитная плита",
                    label: "Монолитная плита",
                    image: "/images/quiz/foundation-slab.jpg",
                },
                {
                    value: "Утеплённая монолитная плита",
                    label: "Утеплённая монолитная плита",
                    image: "/images/quiz/foundation-insulated-slab.jpg",
                },
                {
                    value: "Утеплённая шведская плита",
                    label: "Утеплённая шведская плита",
                    image: "/images/quiz/foundation-ushp.jpg",
                },
                {
                    value: "Монолитная плита ребра вниз",
                    label: "Монолитная плита ребра вниз",
                    image: "/images/quiz/foundation-ribs-down.jpg",
                },
                {
                    value: "Комбинированный фундамент",
                    label: "Комбинированный фундамент",
                    image: "/images/quiz/foundation-combined.jpg",
                },
                {
                    value: "unknown",
                    label: "Не знаю, нужна консультация",
                },
            ],
        },
        {
            kind: "image-choice",
            fieldId: "roof",
            label: "Тип кровли",
            cloud: "Осталось совсем немножко. Давай теперь выберем тип кровли.",
            options: [
                {
                    value: "Металлочерепица",
                    label: "Металлочерепица",
                    image: "/images/quiz/roof-metal-tile.jpg",
                },
                {
                    value: "Фальцевая металлочерепица",
                    label: "Фальцевая металлочерепица",
                    image: "/images/quiz/roof-standing-seam.jpg",
                },
                {
                    value: "Мягкая битумная черепица",
                    label: "Мягкая битумная черепица",
                    image: "/images/quiz/roof-soft-bitumen.jpg",
                },
                {
                    value: "Цементно песчаная черепица",
                    label: "Цементно песчаная черепица",
                    image: "/images/quiz/roof-cement-sand.jpg",
                },
                {
                    value: "Наплавляемая кровля",
                    label: "Наплавляемая кровля",
                    image: "/images/quiz/roof-rolled.jpg",
                },
                {
                    value: "Мембранная кровля",
                    label: "Мембранная кровля",
                    image: "/images/quiz/roof-membrane.jpg",
                },
                {
                    value: "unknown",
                    label: "Не знаю, нужна консультация",
                },
            ],
        },
        {
            kind: "text-radio",
            fieldId: "budget",
            label: "Бюджет на строительство Вашего дома",
            cloud: "В какой бюджет вы хотели бы уложиться по строительству вашего дома под ключ?",
            required: true,
            options: [
                {
                    value: "4 000 000 - 5 000 000 руб.",
                    label: "4 000 000 – 5 000 000 руб.",
                },
                {
                    value: "5 000 000 - 6 000 000 руб.",
                    label: "5 000 000 – 6 000 000 руб.",
                },
                {
                    value: "6 000 000 - 7 500 000 руб.",
                    label: "6 000 000 – 7 500 000 руб.",
                },
                {
                    value: "7 500 000 - 10 000 000 руб.",
                    label: "7 500 000 – 10 000 000 руб.",
                },
                {
                    value: "Более 10 000 000 руб.",
                    label: "Более 10 000 000 руб.",
                },
            ],
        },
        {
            kind: "text-radio",
            fieldId: "timeline",
            label: "Начало строительства дома",
            cloud: "Ура! Уже последний вопрос. Когда хотите начать строить себе дом?",
            options: [
                {
                    value: "В ближайшее время, выбираю подрядчика",
                    label: "В ближайшее время, выбираю подрядчика",
                },
                {
                    value: "В течении 3-6 месяцев, ищу подходящий проект дома",
                    label: "В течении 3–6 месяцев, ищу подходящий проект дома",
                },
                {
                    value: "Позже чем через 6 мес., пока не определился/прицениваюсь",
                    label: "Позже чем через 6 мес., пока не определился/прицениваюсь",
                },
                {
                    value: "Смотрю на перспективу",
                    label: "Смотрю на перспективу",
                },
            ],
        },
        {
            kind: "contact",
            cloud: "Вот и всё! Оставьте ваши контакты и мы перезвоним в течение 15 минут.",
            heading: "Как с вами связаться?",
            nameLabel: "Ваше имя",
            namePlaceholder: "Ваше имя*",
            phoneLabel: "Ваш телефон",
            phonePlaceholder: "Ваш телефон*",
        },
    ],
};

export const PROJECT_PICKER: ProjectPickerContent = {
    title: "Подберите проект",
    text: "Из более 50 готовых проектов на нашем сайте",
    price: { min: 3_160_780, max: 36_946_370 },
    area: { min: 67, max: 679 },
    technologies: [
        { value: "", label: "Не имеет значения" },
        { value: "sip", label: "Дом из SIP-панелей" },
        { value: "aerocrete", label: "Дом из газобетона" },
        { value: "brick", label: "Дом из кирпича" },
        { value: "frame", label: "Каркасный дом" },
        { value: "fachwerk", label: "Фахверковые дома" },
    ],
    floors: [
        { value: "", label: "Не имеет значения" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
    ],
    submitLabel: "Подобрать подходящий проект",
};

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

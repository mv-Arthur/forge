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

import { ADDRESSES, EMAIL, PHONES } from "./contacts";

// Async getters keep the door open for a CMS-backed source: today they return
// the in-repo constants, tomorrow they `await fetch()` from a CMS client.

type HeroTrustItem = { value: string; label: string };

export type HeroContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    text: string;
    primaryCta: { label: string; href: string };
    secondaryCta?: { label: string; href: string };
    trust: HeroTrustItem[];
    image: { src: string; alt: string };
};

export const HERO: HeroContent = {
    eyebrow: "Загородные дома под ключ · СПб и Ленобласть",
    title: "Дом, который служит",
    titleAccent: "поколениям",
    text: "Проектируем и строим частные дома с 2007 года. Фиксированная цена в договоре, авторский надзор архитектора и гарантия 7 лет.",
    primaryCta: { label: "Подобрать проект", href: "/projects" },
    secondaryCta: { label: "Смотреть каталог", href: "/projects" },
    trust: [
        { value: "17", label: "лет на рынке" },
        { value: "320+", label: "построенных домов" },
        { value: "0", label: "скрытых платежей" },
        { value: "7", label: "лет гарантии" },
    ],
    image: { src: "/images/hero/banner.jpg", alt: "Современный частный дом" },
};

type RangeBounds = { min: number; max: number };

type SelectOption = { value: string; label: string };

export type ProjectPickerContent = {
    title: string;
    text: string;
    price: RangeBounds;
    area: RangeBounds;
    technologies: SelectOption[];
    floors: SelectOption[];
    submitLabel: string;
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

type CatalogTab = {
    id: string;
    label: string;
    technology: string | null;
};

export type CatalogSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    tabs: CatalogTab[];
    cta: { label: string; href: string };
    customProject: { text: string; linkLabel: string };
};

const CATALOG_SECTION: CatalogSectionContent = {
    eyebrow: "Каталог проектов",
    title: "Готовые проекты домов",
    titleAccent: "под ключ",
    lead: "Более 50 готовых решений по технологии, площади и этажности. Любой проект адаптируем под ваш участок и образ жизни.",
    tabs: [
        { id: "all", label: "Все проекты", technology: null },
        { id: "gas-concrete", label: "Газобетон", technology: "gas-concrete" },
        { id: "brick", label: "Кирпич", technology: "brick" },
        { id: "frame", label: "Каркас", technology: "frame" },
        { id: "sip", label: "СИП", technology: "sip" },
    ],
    cta: { label: "Смотреть весь каталог", href: "/projects" },
    customProject: {
        text: "Не нашли подходящий —",
        linkLabel: "закажите индивидуальный проект",
    },
};

type AdvantageItem = { title: string; text: string };

export type AdvantagesSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    items: AdvantageItem[];
};

export const ADVANTAGES_SECTION: AdvantagesSectionContent = {
    eyebrow: "Почему мы",
    title: "Подход, который",
    titleAccent: "не подведёт",
    lead: "Мы строим частные дома 17 лет: десятки инженеров, монтажные бригады с опытом 10+ лет и контракт, в котором фиксируется всё — от состава работ до сроков сдачи.",
    items: [
        {
            title: "Квалифицированные инженеры",
            text: "Расчёт нагрузок и запас прочности — дом получается надёжным и служит десятилетиями.",
        },
        {
            title: "Опытные строители",
            text: "Постоянные монтажные бригады с опытом более 10 лет, без подрядного аутсорса.",
        },
        {
            title: "Прозрачное ценообразование",
            text: "Считаем объёмы каждого проекта по сметным позициям, а не по «средней цене за квадрат».",
        },
        {
            title: "Закрытая смета",
            text: "Никаких скрытых платежей: всё, что нужно для сдачи дома, согласовано до старта.",
        },
        {
            title: "Контроль качества",
            text: "Видеонаблюдение на объекте и регулярный надзор за соблюдением проектных решений.",
        },
        {
            title: "Договор и гарантии",
            text: "Работаем по договору с фиксированной ценой, чёткими сроками и гарантией 7 лет.",
        },
    ],
};

export type PullQuoteContent = {
    quote: string;
    author: string;
    role?: string;
};

const PULL_QUOTE: PullQuoteContent = {
    quote: "Хороший дом не нужно объяснять — в нём просто хочется жить. Наша работа — собрать его так, чтобы через пять лет он нравился вам сильнее, чем в день сдачи.",
    author: "Артём Левит",
    role: "главный архитектор",
};

export type OurWorksSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    cta: { label: string; href: string };
    visitInvite: {
        title: string;
        text: string;
        ctaLabel: string;
    };
};

export const OUR_WORKS_SECTION: OurWorksSectionContent = {
    eyebrow: "Наши работы",
    title: "Дома, которые уже",
    titleAccent: "стоят",
    lead: "Готовые объекты в Ленинградской области и Москве. Посетите любой — посмотрите качество вживую и поговорите с владельцами.",
    cta: {
        label: "Все построенные объекты",
        href: "/projects",
    },
    visitInvite: {
        title: "Запишитесь на просмотр",
        text: "Покажем готовые дома в живую и расскажем, во сколько обошлась стройка.",
        ctaLabel: "Записаться на просмотр",
    },
};

type StagesSectionStage = {
    num: string;
    title: string;
    text: string;
};

export type StagesSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    stages: StagesSectionStage[];
};

export const STAGES_SECTION: StagesSectionContent = {
    eyebrow: "Как мы работаем",
    title: "Шесть шагов",
    titleAccent: "до новоселья",
    lead: "Прозрачный процесс, в котором на каждом этапе вы знаете, что происходит, какие сроки и что будет дальше.",
    stages: [
        {
            num: "01",
            title: "Встреча и бриф",
            text: "Обсуждаем участок, образ жизни, бюджет. Подбираем подходящий проект или планируем индивидуальный.",
        },
        {
            num: "02",
            title: "Договор и смета",
            text: "Закрытая смета и фиксированная цена. Прописываем сроки, состав работ и порядок оплаты.",
        },
        {
            num: "03",
            title: "Проектирование",
            text: "Архитектор и конструктор готовят рабочий проект и инженерные разделы под ваш участок.",
        },
        {
            num: "04",
            title: "Строительство",
            text: "Стройка под ключ: фундамент, коробка, кровля. Работают наши штатные бригады.",
        },
        {
            num: "05",
            title: "Авторский надзор",
            text: "Архитектор и прораб контролируют каждый этап. Видеоотчёты с площадки еженедельно.",
        },
        {
            num: "06",
            title: "Сдача и гарантия",
            text: "Подписываем акт, передаём паспорта на оборудование. Гарантия на конструктив 7 лет.",
        },
    ],
};

type GeographyRegion = {
    label: string;
    count: number;
    percent: number;
    note?: string;
};

export type GeographyContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    totalLabel: string;
    totalValue: string;
    regions: GeographyRegion[];
    cta: { label: string; href: string };
};

const GEOGRAPHY: GeographyContent = {
    eyebrow: "География работ",
    title: "Где мы",
    titleAccent: "строим",
    lead: "Главные регионы — Ленинградская область и Санкт-Петербург. По запросу выезжаем в Москву и соседние области.",
    totalLabel: "построенных домов",
    totalValue: "320+",
    regions: [
        {
            label: "Ленинградская область",
            count: 238,
            percent: 74,
            note: "от Выборга до Кировска",
        },
        {
            label: "Санкт-Петербург",
            count: 54,
            percent: 17,
            note: "Сестрорецк, Левашово, Парголово",
        },
        {
            label: "Москва и МО",
            count: 21,
            percent: 7,
            note: "Домодедово, Истра, Одинцово",
        },
        {
            label: "Новгородская область",
            count: 8,
            percent: 2,
        },
    ],
    cta: { label: "Все построенные объекты", href: "/projects" },
};

type Review = {
    id: string;
    author: string;
    date: string;
    text: string;
    image?: string;
    videoUrl?: string;
};

export type ReviewsSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    showMoreLabel: string;
    prevLabel: string;
    nextLabel: string;
    reviews: Review[];
};

export const REVIEWS_SECTION: ReviewsSectionContent = {
    eyebrow: "Отзывы клиентов",
    title: "Что говорят те, кто уже",
    titleAccent: "переехал",
    lead: "320+ построенных домов и сотни довольных семей. Реальные отзывы от тех, кто живёт в наших домах.",
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

export type FeaturedProjectContent = {
    eyebrow: string;
    overline: string;
    ctaLabel: string;
    objectId: string;
    technology: string;
};

const FEATURED_PROJECT: FeaturedProjectContent = {
    eyebrow: "Проект месяца",
    overline: "Май 2026",
    ctaLabel: "Смотреть проект",
    objectId: "severnaya-zhemchuzhina",
    technology: "Каркас в сосновом лесу",
};

export type GuaranteeIcon =
    | "price"
    | "contract"
    | "steps"
    | "eye"
    | "shield"
    | "umbrella";

type GuaranteeItem = {
    icon: GuaranteeIcon;
    title: string;
    text: string;
};

export type GuaranteesSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    items: GuaranteeItem[];
};

const GUARANTEES_SECTION: GuaranteesSectionContent = {
    eyebrow: "Что входит в стоимость",
    title: "Никаких сюрпризов",
    titleAccent: "после подписи",
    lead: "Заранее обсуждаем все этапы и фиксируем их в договоре. Вы платите ровно столько, сколько указано в смете.",
    items: [
        {
            icon: "price",
            title: "Фиксированная цена",
            text: "Цена в договоре не меняется до сдачи объекта — даже если стройматериалы подорожают.",
        },
        {
            icon: "contract",
            title: "Закрытая смета",
            text: "Состав и объём работ согласуются до старта. Дополнительные работы — только по вашему решению.",
        },
        {
            icon: "steps",
            title: "Поэтапная оплата",
            text: "Платите только за фактически выполненный этап. Никаких авансов «на материалы».",
        },
        {
            icon: "eye",
            title: "Авторский надзор",
            text: "Архитектор контролирует соответствие проекту от фундамента до финишной отделки.",
        },
        {
            icon: "shield",
            title: "Гарантия 7 лет",
            text: "На несущие конструкции и узлы. Бесплатно устраняем все случаи по гарантийному обязательству.",
        },
        {
            icon: "umbrella",
            title: "Страховка СМР",
            text: "Объект застрахован на весь срок строительства от пожара, кражи и стихийных бедствий.",
        },
    ],
};

type FaqItem = {
    question: string;
    answer: string;
};

export type FaqSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead?: string;
    items: FaqItem[];
};

const FAQ_SECTION: FaqSectionContent = {
    eyebrow: "Частые вопросы",
    title: "Что чаще всего",
    titleAccent: "спрашивают",
    items: [
        {
            question: "Можно ли изменить готовый проект под мой участок?",
            answer: "Да, любой типовой проект адаптируем под ваш участок и пожелания: меняем планировку, фасады, добавляем террасу или гараж. Архитектор проектирует под ваш сценарий жизни.",
        },
        {
            question: "Что входит в стоимость в договоре?",
            answer: "В смете прописаны материалы, монтажные работы, инженерные сети, кровля, фасад и финишная отделка — всё необходимое для сдачи под ключ. Скрытых платежей нет: цена в договоре фиксируется на весь срок строительства.",
        },
        {
            question: "Какие сроки строительства?",
            answer: "В среднем 4–8 месяцев в зависимости от технологии и площади. Каркасный дом — от 3 месяцев, газобетон или кирпич — 5–8 месяцев. Точные сроки прописываем в договоре.",
        },
        {
            question: "Как происходит оплата?",
            answer: "Поэтапно — после фактической приёмки каждого этапа: фундамент, коробка, кровля, отделка. Авансы «на материалы» не берём.",
        },
        {
            question: "Какая гарантия на дом?",
            answer: "7 лет на несущие конструкции и узлы. Все случаи устраняем бесплатно по гарантийному обязательству. На инженерные сети — гарантия производителей оборудования.",
        },
        {
            question: "Можно ли посмотреть готовые объекты?",
            answer: "Да, организуем выездной осмотр. Покажем построенные дома в Ленобласти и расскажем, во сколько обошлась стройка. Запишитесь на просмотр в любой удобный день.",
        },
    ],
};

export type ContactSectionContent = {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    lead: string;
    addresses: string[];
    phones: { number: string; display: string }[];
    email: string;
    hours: string;
    form: {
        title: string;
        namePlaceholder: string;
        phonePlaceholder: string;
        messagePlaceholder: string;
        submitLabel: string;
        privacy: {
            text: string;
            linkLabel: string;
            linkHref: string;
        };
        successTitle: string;
        successText: string;
    };
};

const CONTACT_SECTION: ContactSectionContent = {
    eyebrow: "Связаться",
    title: "Готовы обсудить",
    titleAccent: "ваш дом?",
    lead: "Оставьте телефон — перезвоним в течение 15 минут. Или приезжайте в офис в Санкт-Петербурге или Москве.",
    addresses: [
        ADDRESSES.spb,
        ADDRESSES.msk,
        ADDRESSES.lenobl,
        ADDRESSES.novobl,
    ],
    phones: [PHONES.spb, PHONES.msk],
    email: EMAIL,
    hours: "Пн–Пт 10:00–19:00",
    form: {
        title: "Оставить заявку",
        namePlaceholder: "Ваше имя",
        phonePlaceholder: "Телефон",
        messagePlaceholder: "Расскажите о проекте (необязательно)",
        submitLabel: "Отправить заявку",
        privacy: {
            text: "Нажимая «Отправить», вы соглашаетесь с",
            linkLabel: "политикой конфиденциальности",
            linkHref: "/privacy",
        },
        successTitle: "Заявка отправлена",
        successText: "Мы свяжемся с вами в течение 15 минут.",
    },
};

interface HomeContent {
    hero: HeroContent;
    projectPicker: ProjectPickerContent;
    catalog: CatalogSectionContent;
    advantages: AdvantagesSectionContent;
    pullQuote: PullQuoteContent;
    ourWorks: OurWorksSectionContent;
    stages: StagesSectionContent;
    geography: GeographyContent;
    reviews: ReviewsSectionContent;
    featuredProject: FeaturedProjectContent;
    guarantees: GuaranteesSectionContent;
    faq: FaqSectionContent;
    contact: ContactSectionContent;
}

export async function getHomeContent(): Promise<HomeContent> {
    return {
        hero: HERO,
        projectPicker: PROJECT_PICKER,
        catalog: CATALOG_SECTION,
        advantages: ADVANTAGES_SECTION,
        pullQuote: PULL_QUOTE,
        ourWorks: OUR_WORKS_SECTION,
        stages: STAGES_SECTION,
        geography: GEOGRAPHY,
        reviews: REVIEWS_SECTION,
        featuredProject: FEATURED_PROJECT,
        guarantees: GUARANTEES_SECTION,
        faq: FAQ_SECTION,
        contact: CONTACT_SECTION,
    };
}

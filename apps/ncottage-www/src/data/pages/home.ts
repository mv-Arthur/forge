import type {
    AdvantagesSectionContent,
    CatalogSectionContent,
    FeaturedProjectContent,
    GeographyContent,
    GuaranteesSectionContent,
    HeroContent,
    OurWorksSectionContent,
    ProjectPickerContent,
    PullQuoteContent,
    ReviewsSectionContent,
    StagesSectionContent,
} from "@/content/home";
import type {
    FaqListData,
    HomeContactData,
    Page,
    ReviewsCarouselData,
} from "@/domain/page";

// Статический fallback главной — отдаётся, когда ncottage-api недоступен. Это же
// содержимое — источник сидов API. Динамические блоки (каталог проектов,
// построенные объекты, отзывы) подтягиваются на странице из своих коллекций;
// здесь хранится только редактируемая копирайт-часть секций.

const hero: HeroContent = {
    eyebrow: "Загородные дома под ключ · СПб/ЛО/Москва",
    title: "Дом под ключ",
    titleAccent: "по фиксированной смете",
    text: "Строим частные дома с 2007 года в Санкт-Петербурге, Ленобласти и Москве. До старта фиксируем цену, смету, сроки и состав работ в договоре — без скрытых платежей.",
    primaryCta: { label: "Заказать расчёт", href: "/contacts" },
    secondaryCta: { label: "Смотреть проекты", href: "/projects/all" },
    trust: [
        { value: "с 2007", label: "года строим дома" },
        { value: "320+", label: "построенных домов" },
        { value: "0", label: "скрытых платежей" },
        { value: "7", label: "лет гарантии" },
    ],
    image: { src: "/images/hero/banner.jpg", alt: "Современный частный дом" },
};

const projectPicker: ProjectPickerContent = {
    title: "Подберите проект",
    text: "Готовые проекты — по цене, площади, технологии и этажности",
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

const catalog: CatalogSectionContent = {
    eyebrow: "Каталог проектов",
    title: "Готовые проекты домов",
    titleAccent: "под ключ",
    lead: "Готовые решения по технологии, площади и этажности. Любой проект адаптируем под ваш участок и образ жизни.",
    tabs: [
        { id: "all", label: "Все проекты", technology: null },
        { id: "gas-concrete", label: "Газобетон", technology: "gas-concrete" },
        { id: "brick", label: "Кирпич", technology: "brick" },
        { id: "frame", label: "Каркас", technology: "frame" },
        { id: "sip", label: "СИП", technology: "sip" },
    ],
    cta: { label: "Смотреть весь каталог", href: "/projects/all" },
    customProject: {
        text: "Не нашли подходящий —",
        linkLabel: "закажите индивидуальный проект",
    },
};

const advantages: AdvantagesSectionContent = {
    eyebrow: "Почему мы",
    title: "Подход, который",
    titleAccent: "не подведёт",
    lead: "Мы строим частные дома с 2007 года: десятки инженеров, монтажные бригады с опытом 10+ лет и контракт, в котором фиксируется всё — от состава работ до сроков сдачи.",
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

const pullQuote: PullQuoteContent = {
    quote: "Хороший дом не нужно объяснять — в нём просто хочется жить. Наша работа — собрать его так, чтобы через пять лет он нравился вам сильнее, чем в день сдачи.",
    author: "Артём Левит",
    role: "главный архитектор",
};

const ourWorks: OurWorksSectionContent = {
    eyebrow: "Наши работы",
    title: "Дома, которые уже",
    titleAccent: "стоят",
    lead: "Готовые объекты в Ленинградской области и Москве. Посетите любой — посмотрите качество вживую и поговорите с владельцами.",
    cta: {
        label: "Все построенные объекты",
        href: "/works",
    },
    visitInvite: {
        title: "Запишитесь на просмотр",
        text: "Покажем готовые дома в живую и расскажем, во сколько обошлась стройка.",
        ctaLabel: "Записаться на просмотр",
    },
};

const stages: StagesSectionContent = {
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

const geography: GeographyContent = {
    eyebrow: "География работ",
    title: "Где мы",
    titleAccent: "строим",
    lead: "Строим в Санкт-Петербурге, Ленинградской области, Москве и Московской области. Соседние регионы обсуждаем по запросу.",
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
    cta: { label: "Все построенные объекты", href: "/works" },
};

const reviews: ReviewsCarouselData = {
    eyebrow: "Отзывы клиентов",
    title: "Что говорят те, кто уже",
    titleAccent: "переехал",
    lead: "320+ построенных домов и сотни довольных семей. Реальные отзывы от тех, кто живёт в наших домах.",
    showMoreLabel: "Весь отзыв",
    prevLabel: "Предыдущий отзыв",
    nextLabel: "Следующий отзыв",
};

const featuredProject: FeaturedProjectContent = {
    eyebrow: "Проект месяца",
    overline: "Май 2026",
    ctaLabel: "Смотреть проект",
    objectId: "severnaya-zhemchuzhina",
    technology: "Каркас в сосновом лесу",
};

const guarantees: GuaranteesSectionContent = {
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

const faq: FaqListData = {
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

const contact: HomeContactData = {
    eyebrow: "Связаться",
    title: "Готовы обсудить",
    titleAccent: "ваш дом?",
    lead: "Оставьте телефон — перезвоним в течение 15 минут. Или приезжайте в офис в Санкт-Петербурге или Москве.",
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

export const homePage: Page = {
    key: "home",
    title: "Главная",
    seoTitle: "Строительство домов в СПб и ЛО под ключ — Новый Коттедж",
    seoDescription:
        "Строительная компания Новый Коттедж. Строительство загородных домов под ключ в Санкт-Петербурге и Ленинградской области.",
    sections: [
        { id: "home-hero", type: "homeHero", order: 0, data: hero },
        { id: "home-picker", type: "projectPicker", order: 1, data: projectPicker },
        { id: "home-catalog", type: "catalogSection", order: 2, data: catalog },
        { id: "home-advantages", type: "cardGrid", order: 3, data: advantages },
        { id: "home-quote", type: "pullQuote", order: 4, data: pullQuote },
        { id: "home-works", type: "worksTeaser", order: 5, data: ourWorks },
        { id: "home-stages", type: "stepsSection", order: 6, data: stages },
        { id: "home-geography", type: "geography", order: 7, data: geography },
        { id: "home-reviews", type: "reviewsCarousel", order: 8, data: reviews },
        { id: "home-featured", type: "featuredProject", order: 9, data: featuredProject },
        { id: "home-guarantees", type: "guaranteeCards", order: 10, data: guarantees },
        { id: "home-faq", type: "faqList", order: 11, data: faq },
        { id: "home-contact", type: "homeContact", order: 12, data: contact },
    ],
};

// Фикстуры для Storybook (компоненты главной рендерятся изолированно).
export const HERO = hero;
export const PROJECT_PICKER = projectPicker;
export const ADVANTAGES_SECTION = advantages;
export const OUR_WORKS_SECTION = ourWorks;
export const STAGES_SECTION = stages;
export const REVIEWS_SECTION: ReviewsSectionContent = {
    ...reviews,
    reviews: [
        {
            id: "r1",
            author: "Алексей",
            date: "22.02.2019",
            image: "https://ncottage.ru/app/uploads/2020/03/pgb2favbgwu-e1591215656105.jpg",
            text: "Выбирали каркасный дом. Сразу пригласили на стройку показали построенный дом. Дом под крышу собрали за 3 недели и обшили плитами. Мы очень довольны.",
        },
        {
            id: "r5",
            author: "Татьяна",
            date: "06.09.2021",
            videoUrl: "https://www.youtube.com/embed/zgDZH0EjGKs",
            text: "Мне даже не верится, что за такой короткий срок смогли реализовать нашу мечту! Огромное спасибо всем ребятам, кто участвовал в строительстве нашего дома.",
        },
    ],
};

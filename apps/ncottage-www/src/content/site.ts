import { ADDRESSES, EMAIL, LEGAL, PHONES, type Phone } from "./contacts";

type NavSubItem = { label: string; href: string };

export type NavItem = {
    label: string;
    href: string;
    children?: NavSubItem[];
    badge?: "sale";
};

export const NAV_ITEMS: NavItem[] = [
    {
        label: "Проекты",
        href: "/projects",
        children: [
            { label: "Все проекты", href: "/projects/all" },
            { label: "Дома из газобетона", href: "/projects/gas-concrete" },
            { label: "Кирпичные дома", href: "/projects/brick" },
            { label: "Каркасные дома", href: "/projects/frame" },
            { label: "Дома из СИП-панелей", href: "/projects/sip" },
            { label: "Фахверковые дома", href: "/projects/fachwerk" },
        ],
    },
    {
        label: "Услуги",
        href: "/services",
        children: [
            { label: "Проектирование", href: "/services/design" },
            { label: "Строительство домов", href: "/services/construction" },
            { label: "Фундаменты", href: "/services/foundations" },
            { label: "Инженерные сети", href: "/services/engineering" },
            { label: "Отделочные работы", href: "/services/finishing" },
            { label: "Строительство бань", href: "/services/baths" },
        ],
    },
    { label: "Наши работы", href: "/works" },
    {
        label: "Клиентам",
        href: "/about",
        children: [
            { label: "О компании", href: "/about" },
            { label: "Гарантия", href: "/guarantee" },
            { label: "Отзывы", href: "/reviews" },
            { label: "Вопрос-ответ", href: "/faq" },
            { label: "Ипотека", href: "/mortgage" },
            { label: "Оплата", href: "/payment" },
        ],
    },
    { label: "Акции", href: "/promos", badge: "sale" },
    { label: "Контакты", href: "/contacts" },
];

type FooterLink = {
    label: string;
    href: string;
    external?: boolean;
};

type FooterMenu = {
    title: string;
    items: FooterLink[];
};

type FooterOffice = {
    label: string;
    address: string;
    phone: Phone;
};

export type FooterContent = {
    tagline: string;
    nav: FooterMenu;
    contactsTitle: string;
    email: string;
    workHours: string;
    offices: FooterOffice[];
    socialLabel: string;
    legal: { ogrn: string; inn: string; kpp: string };
    bottomLinks: FooterLink[];
    copyright: string;
    disclaimer: string;
    toTopLabel: string;
};

export const FOOTER: FooterContent = {
    tagline:
        "Загородные дома под ключ в Санкт-Петербурге и Москве с 2007 года.",
    nav: {
        title: "Разделы",
        items: [
            { label: "Проекты", href: "/projects" },
            { label: "Услуги", href: "/services" },
            { label: "Наши работы", href: "/works" },
            { label: "О компании", href: "/about" },
            { label: "Гарантия", href: "/guarantee" },
            { label: "Отзывы", href: "/reviews" },
            { label: "Вопрос-ответ", href: "/faq" },
            { label: "Ипотека", href: "/mortgage" },
            { label: "Акции", href: "/promos" },
            { label: "Контакты", href: "/contacts" },
            { label: "Реквизиты", href: "/requisites" },
        ],
    },
    contactsTitle: "Контакты",
    email: EMAIL,
    workHours: "Пн–Пт, 10:00–19:00",
    legal: LEGAL,
    offices: [
        {
            label: "Санкт-Петербург",
            address: "Комендантский проспект, 4, офис 405",
            phone: PHONES.spb,
        },
        {
            label: "Москва",
            address: ADDRESSES.msk,
            phone: PHONES.msk,
        },
    ],
    socialLabel: "Мы в соцсетях",
    bottomLinks: [
        { label: "Политика конфиденциальности", href: "/privacy" },
        { label: "Обработка персональных данных", href: "/personal-data" },
        { label: "Карта сайта", href: "/sitemap" },
    ],
    copyright: "© 2007–2026 Новый Коттедж",
    disclaimer:
        "Информация на сайте носит справочный характер и не является публичной офертой (ст. 437 ГК РФ).",
    toTopLabel: "Наверх",
};

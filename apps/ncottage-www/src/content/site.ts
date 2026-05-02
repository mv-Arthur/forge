import { EMAIL, LEGAL, PHONES, type Phone } from "./contacts";

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
        ],
    },
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
        title: "Проекты",
        items: [
            { label: "Газобетон", href: "/projects/gas-concrete" },
            { label: "Кирпич", href: "/projects/brick" },
            { label: "Каркасные", href: "/projects/frame" },
            { label: "СИП-панели", href: "/projects/sip" },
            { label: "Все проекты", href: "/projects/all" },
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
            address: "1-й Нагатинский проезд, 2, офис 6",
            phone: PHONES.msk,
        },
    ],
    socialLabel: "Мы в соцсетях",
    bottomLinks: [
        { label: "Политика конфиденциальности", href: "/privacy" },
        { label: "Обработка персональных данных", href: "/privacy" },
    ],
    copyright: "© 2008–2026 Новый Коттедж",
    disclaimer:
        "Информация на сайте носит справочный характер и не является публичной офертой (ст. 437 ГК РФ).",
    toTopLabel: "Наверх",
};

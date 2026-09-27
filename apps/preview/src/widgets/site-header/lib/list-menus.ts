import { routes } from "@/lib/routes";
import type { NavMenuIconName } from "../__list-menu/icons";

export type HeaderListMenuId = "services" | "build" | "about" | "contacts";

export type HeaderListChild = {
    href: string;
    label: string;
};

export type HeaderListItem = {
    href: string;
    label: string;
    icon: NavMenuIconName;
    children?: HeaderListChild[];
};

export const HEADER_LIST_MENUS: Record<HeaderListMenuId, HeaderListItem[]> = {
    services: [
        {
            href: routes.services,
            label: "Весь путь клиента",
            icon: "uslugi-roadmap",
        },
        {
            href: routes.service("individual-planning"),
            label: "Индивидуальное проектирование",
            icon: "uslugi-individual-planning",
        },
        {
            href: routes.service("site-survey"),
            label: "Проверка участка инженером",
            icon: "uslugi-domain-examination",
        },
        {
            href: routes.service("construction"),
            label: "Строительство",
            icon: "uslugi-construction",
            children: [
                {
                    href: routes.service("construction/wood"),
                    label: "Дерево",
                },
                {
                    href: routes.service("construction/stone"),
                    label: "Камень",
                },
            ],
        },
        {
            href: routes.service("engineering"),
            label: "Инженерные системы",
            icon: "uslugi-engineering",
            children: [
                {
                    href: routes.service("engineering/heating"),
                    label: "Отопление",
                },
                {
                    href: routes.service("engineering/external"),
                    label: "Наружные инженерные сети",
                },
                {
                    href: routes.service("engineering/ventilation"),
                    label: "Вентиляция и кондиционирование",
                },
                {
                    href: routes.service("engineering/plumbing"),
                    label: "Водоснабжение и канализация",
                },
            ],
        },
        {
            href: routes.service("finishing"),
            label: "Отделка",
            icon: "uslugi-decor",
            children: [
                {
                    href: routes.service("finishing/paint"),
                    label: "Покраска деревянных домов",
                },
                {
                    href: routes.service("finishing/exterior"),
                    label: "Внешняя отделка",
                },
                {
                    href: routes.service("finishing/facade"),
                    label: "Отделка фасадов каменных домов",
                },
            ],
        },
    ],
    build: [
        {
            href: routes.technologyPage("methods"),
            label: "Технологии строительства",
            icon: "tech-tech",
        },
        {
            href: routes.worksStagesHub,
            label: "Этапы работ",
            icon: "tech-stages",
        },
        {
            href: routes.technologyPage("heat-calc"),
            label: "Калькулятор отопления",
            icon: "tech-calc",
        },
        {
            href: routes.technologyPage("faq"),
            label: "Частые вопросы о стройке",
            icon: "tech-faq",
        },
        {
            href: routes.technologyPage("how-we-build"),
            label: "Как строим",
            icon: "tech-how-we-build",
            children: [
                {
                    href: routes.technologyPage("how-we-build/support"),
                    label: "Сопровождение строительства",
                },
                {
                    href: routes.technologyPage("how-we-build/supervision"),
                    label: "Технический надзор",
                },
            ],
        },
    ],
    about: [
        {
            href: routes.about,
            label: "О компании",
            icon: "about-company",
        },
        {
            href: routes.aboutPage("production"),
            label: "Производство",
            icon: "about-production",
        },
        {
            href: routes.aboutPage("career"),
            label: "Карьера",
            icon: "about-career",
        },
        {
            href: routes.aboutPage("team"),
            label: "Команда",
            icon: "about-team",
        },
        {
            href: routes.aboutPage("partners"),
            label: "Партнёры",
            icon: "about-partners",
        },
        {
            href: routes.aboutPage("warranty"),
            label: "Гарантии и сервис",
            icon: "about-guarantee",
        },
    ],
    contacts: [
        {
            href: routes.contactsOffice("spb"),
            label: "Санкт-Петербург",
            icon: "contacts-tsentralnyy-ofis",
        },
        {
            href: routes.contactsOffice("msk"),
            label: "Москва",
            icon: "contacts-moskva",
        },
    ],
};

export function flattenListMenu(items: HeaderListItem[]) {
    const links: HeaderListChild[] = [];
    for (const item of items) {
        links.push({ href: item.href, label: item.label });
        if (item.children) links.push(...item.children);
    }
    return links;
}

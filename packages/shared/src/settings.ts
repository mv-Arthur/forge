// Контент-настройки сайта (singletons). Хранятся в Setting по ключу,
// редактируются типизированными формами в админке, читаются публичным www.

import type { ServicesUi } from "./service.js";

export interface NavSubItem {
    label: string;
    href: string;
}

export interface NavItem {
    label: string;
    href: string;
    children?: NavSubItem[];
    badge?: "sale";
}

export interface Navigation {
    items: NavItem[];
}

export interface FooterLink {
    label: string;
    href: string;
    external?: boolean;
}

export interface FooterOffice {
    label: string;
    address: string;
    phoneNumber: string;
    phoneDisplay: string;
}

export interface Footer {
    tagline: string;
    navTitle: string;
    navItems: FooterLink[];
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
}

export interface ContactPhone {
    code: string;
    label: string;
    number: string;
    display: string;
}

export interface ContactAddress {
    key: string;
    label: string;
    value: string;
}

export interface ContactSocial {
    key: string;
    label: string;
    url: string;
}

export interface Contacts {
    phones: ContactPhone[];
    email: string;
    addresses: ContactAddress[];
    social: ContactSocial[];
    workHours: string;
    legal: { ogrn: string; inn: string; kpp: string };
}

// Чрома страницы блога (заголовки секций и блок CTA). Карточки и список статей
// приходят отдельно как коллекция Article.
export interface BlogPage {
    hero: { eyebrow: string; title: string; lead: string; panelLabel: string };
    featured: {
        eyebrow: string;
        title: string;
        titleAccent: string;
        lead: string;
    };
    list: { eyebrow: string; title: string; lead: string };
    cta: {
        eyebrow: string;
        title: string;
        text: string;
        buttonLabel: string;
        buttonHref: string;
    };
}

// Индексные (листинговые) страницы, чьи title/description управляются из CMS
// через настройку seo (у них нет своей сущности Page или коллекции-владельца).
export const SEO_INDEX_KEYS = [
    "blog",
    "services",
    "projects",
    "promos",
    "reviews",
    "faq",
    "certificates",
    "partners",
    "vacancies",
    "project-selections",
] as const;
export type SeoIndexKey = (typeof SEO_INDEX_KEYS)[number];

export interface SeoIndexMeta {
    title: string;
    description: string;
}

// Сквозные SEO-настройки сайта: дефолты (layout), индексные страницы и Open Graph.
export interface Seo {
    baseUrl: string;
    siteName: string;
    defaultTitle: string;
    defaultDescription: string;
    ogImageUrl: string;
    indexes: Record<SeoIndexKey, SeoIndexMeta>;
}

export const SETTING_KEYS = [
    "nav",
    "footer",
    "contacts",
    "blog_page",
    "services_ui",
    "seo",
] as const;
export type SettingKey = (typeof SETTING_KEYS)[number];

export interface SettingValues {
    nav: Navigation;
    footer: Footer;
    contacts: Contacts;
    blog_page: BlogPage;
    services_ui: ServicesUi;
    seo: Seo;
}

export interface Setting<K extends SettingKey = SettingKey> {
    key: K;
    value: SettingValues[K];
    updatedAt: string;
}

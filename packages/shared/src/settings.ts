// Контент-настройки сайта (singletons). Хранятся в Setting по ключу,
// редактируются типизированными формами в админке, читаются публичным www.

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

export const SETTING_KEYS = ["nav", "footer", "contacts"] as const;
export type SettingKey = (typeof SETTING_KEYS)[number];

export interface SettingValues {
    nav: Navigation;
    footer: Footer;
    contacts: Contacts;
}

export interface Setting<K extends SettingKey = SettingKey> {
    key: K;
    value: SettingValues[K];
    updatedAt: string;
}

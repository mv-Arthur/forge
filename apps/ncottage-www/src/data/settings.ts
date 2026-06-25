import type { City, CityCode, Phone } from "@/content/contacts";
import {
    ADDRESSES,
    CITIES,
    EMAIL,
    LEGAL,
    PHONES,
    SOCIAL,
    WORK_HOURS,
} from "@/content/contacts";
import type { FooterContent } from "@/content/site";
import { FOOTER, NAV_ITEMS } from "@/content/site";
import type { Contacts, Footer, Navigation } from "@/domain/settings";

// Настройки сайта (навигация, футер, контакты) приходят из ncottage-api.
// ISR: ответы кешируются и ревалидируются по тегам settings/settings:<key>.
// Если API недоступен (нет URL, dev без backend, Storybook) — отдаём статику
// из src/content, которая и была источником сидов.
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;

const NAV_FALLBACK: Navigation = { items: NAV_ITEMS };

const FOOTER_FALLBACK: Footer = {
    tagline: FOOTER.tagline,
    navTitle: FOOTER.nav.title,
    navItems: FOOTER.nav.items,
    contactsTitle: FOOTER.contactsTitle,
    email: FOOTER.email,
    workHours: FOOTER.workHours,
    offices: FOOTER.offices.map((o) => ({
        label: o.label,
        address: o.address,
        phoneNumber: o.phone.number,
        phoneDisplay: o.phone.display,
    })),
    socialLabel: FOOTER.socialLabel,
    legal: FOOTER.legal,
    bottomLinks: FOOTER.bottomLinks,
    copyright: FOOTER.copyright,
    disclaimer: FOOTER.disclaimer,
    toTopLabel: FOOTER.toTopLabel,
};

const ADDRESS_LABELS: Record<string, string> = {
    spb: "Санкт-Петербург",
    msk: "Москва",
    lenobl: "Ленинградская область",
    novobl: "Новгородская область",
};

const SOCIAL_LABELS: Record<string, string> = {
    vk: "VK",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    website: "Сайт",
};

const CONTACTS_FALLBACK: Contacts = {
    phones: CITIES.map((c) => ({
        code: c.code,
        label: c.label,
        number: PHONES[c.code].number,
        display: PHONES[c.code].display,
    })),
    email: EMAIL,
    addresses: Object.entries(ADDRESSES).map(([key, value]) => ({
        key,
        label: ADDRESS_LABELS[key] ?? key,
        value,
    })),
    social: Object.entries(SOCIAL).map(([key, url]) => ({
        key,
        label: SOCIAL_LABELS[key] ?? key,
        url,
    })),
    workHours: WORK_HOURS,
    legal: LEGAL,
};

async function getSetting<T>(key: string, fallback: T): Promise<T> {
    if (!API_URL) return fallback;
    try {
        const res = await fetch(`${API_URL}/settings/${key}`, {
            next: {
                revalidate: REVALIDATE,
                tags: ["settings", `settings:${key}`],
            },
        });
        if (!res.ok) return fallback;
        const data = (await res.json()) as { value: T };
        return data.value;
    } catch {
        return fallback;
    }
}

export async function getNavigation(): Promise<Navigation> {
    return getSetting("nav", NAV_FALLBACK);
}

export async function getFooter(): Promise<Footer> {
    return getSetting("footer", FOOTER_FALLBACK);
}

export async function getContacts(): Promise<Contacts> {
    return getSetting("contacts", CONTACTS_FALLBACK);
}

// --- Адаптеры: форма API → форма, которую ждут компоненты сайта ---

export function toFooterContent(footer: Footer): FooterContent {
    return {
        tagline: footer.tagline,
        nav: { title: footer.navTitle, items: footer.navItems },
        contactsTitle: footer.contactsTitle,
        email: footer.email,
        workHours: footer.workHours,
        offices: footer.offices.map((o) => ({
            label: o.label,
            address: o.address,
            phone: { number: o.phoneNumber, display: o.phoneDisplay },
        })),
        socialLabel: footer.socialLabel,
        legal: footer.legal,
        bottomLinks: footer.bottomLinks,
        copyright: footer.copyright,
        disclaimer: footer.disclaimer,
        toTopLabel: footer.toTopLabel,
    };
}

export interface HeaderContacts {
    cities: City[];
    phones: Record<CityCode, Phone>;
    addresses: Record<CityCode, string>;
    email: string;
    workHours: string;
}

export function toHeaderContacts(contacts: Contacts): HeaderContacts {
    const phones: Record<string, Phone> = {};
    const addresses: Record<string, string> = {};
    for (const p of contacts.phones) {
        phones[p.code] = { number: p.number, display: p.display };
    }
    for (const a of contacts.addresses) {
        addresses[a.key] = a.value;
    }
    return {
        cities: contacts.phones.map((p) => ({
            code: p.code as CityCode,
            label: p.label,
        })),
        phones: phones as Record<CityCode, Phone>,
        addresses: addresses as Record<CityCode, string>,
        email: contacts.email,
        workHours: contacts.workHours,
    };
}

export interface ContactLinks {
    vk: string;
    telegram: string;
    whatsapp: string;
}

export function toContactLinks(contacts: Contacts): ContactLinks {
    const url = (key: string) =>
        contacts.social.find((s) => s.key === key)?.url;
    return {
        vk: url("vk") ?? SOCIAL.vk,
        telegram: url("telegram") ?? SOCIAL.telegram,
        whatsapp: url("whatsapp") ?? SOCIAL.whatsapp,
    };
}

export interface ContactRecords {
    phones: Record<string, Phone>;
    addresses: Record<string, string>;
    email: string;
    workHours: string;
    legal: { ogrn: string; inn: string; kpp: string };
}

export function toContactRecords(contacts: Contacts): ContactRecords {
    const phones: Record<string, Phone> = {};
    const addresses: Record<string, string> = {};
    for (const p of contacts.phones) {
        phones[p.code] = { number: p.number, display: p.display };
    }
    for (const a of contacts.addresses) {
        addresses[a.key] = a.value;
    }
    return {
        phones,
        addresses,
        email: contacts.email,
        workHours: contacts.workHours,
        legal: contacts.legal,
    };
}

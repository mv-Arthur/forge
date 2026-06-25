import type {
    ContactAddress,
    ContactPhone,
    Contacts,
    ContactSocial,
    Footer,
    FooterLink,
    FooterOffice,
    Navigation,
    NavItem,
    NavSubItem,
} from "@forge/shared";
import { z } from "zod";

// Form schemas for the site settings singletons. They mirror the shared
// contracts but model the optional `badge`/`external` flags as plain booleans
// so the forms stay typed; the converters map back to the stored shape.

const legalSchema = z.object({
    ogrn: z.string(),
    inn: z.string(),
    kpp: z.string(),
});

// --- Navigation ---

const navSubItemSchema = z.object({
    label: z.string().min(1, "Укажите название"),
    href: z.string().min(1, "Укажите ссылку"),
});

const navItemSchema = z.object({
    label: z.string().min(1, "Укажите название"),
    href: z.string().min(1, "Укажите ссылку"),
    badge: z.boolean(),
    children: z.array(navSubItemSchema),
});

export const navSchema = z.object({ items: z.array(navItemSchema) });
export type NavFormValues = z.infer<typeof navSchema>;

export function navToFormValues(nav: Navigation): NavFormValues {
    return {
        items: nav.items.map((item) => ({
            label: item.label,
            href: item.href,
            badge: item.badge === "sale",
            children: (item.children ?? []).map((c) => ({
                label: c.label,
                href: c.href,
            })),
        })),
    };
}

export function formValuesToNav(values: NavFormValues): Navigation {
    return {
        items: values.items.map((item): NavItem => {
            const children: NavSubItem[] = item.children.map((c) => ({
                label: c.label.trim(),
                href: c.href.trim(),
            }));
            return {
                label: item.label.trim(),
                href: item.href.trim(),
                ...(item.badge ? { badge: "sale" as const } : {}),
                ...(children.length ? { children } : {}),
            };
        }),
    };
}

export function emptyNavValues(): NavFormValues {
    return { items: [] };
}

// --- Footer ---

const footerLinkSchema = z.object({
    label: z.string().min(1, "Укажите название"),
    href: z.string().min(1, "Укажите ссылку"),
    external: z.boolean(),
});

const footerOfficeSchema = z.object({
    label: z.string().min(1, "Укажите город"),
    address: z.string().min(1, "Укажите адрес"),
    phoneNumber: z.string().min(1, "Укажите номер"),
    phoneDisplay: z.string().min(1, "Укажите отображение"),
});

export const footerSchema = z.object({
    tagline: z.string().min(1, "Укажите слоган"),
    navTitle: z.string().min(1, "Укажите заголовок меню"),
    navItems: z.array(footerLinkSchema),
    contactsTitle: z.string().min(1, "Укажите заголовок"),
    email: z.string().min(1, "Укажите email"),
    workHours: z.string().min(1, "Укажите часы работы"),
    offices: z.array(footerOfficeSchema),
    socialLabel: z.string().min(1, "Укажите подпись соцсетей"),
    legal: legalSchema,
    bottomLinks: z.array(footerLinkSchema),
    copyright: z.string().min(1, "Укажите копирайт"),
    disclaimer: z.string().min(1, "Укажите дисклеймер"),
    toTopLabel: z.string().min(1, "Укажите подпись «Наверх»"),
});
export type FooterFormValues = z.infer<typeof footerSchema>;

function footerLinkToForm(link: FooterLink) {
    return {
        label: link.label,
        href: link.href,
        external: link.external ?? false,
    };
}

function formToFooterLink(link: {
    label: string;
    href: string;
    external: boolean;
}): FooterLink {
    return {
        label: link.label.trim(),
        href: link.href.trim(),
        ...(link.external ? { external: true } : {}),
    };
}

export function footerToFormValues(footer: Footer): FooterFormValues {
    return {
        tagline: footer.tagline,
        navTitle: footer.navTitle,
        navItems: footer.navItems.map(footerLinkToForm),
        contactsTitle: footer.contactsTitle,
        email: footer.email,
        workHours: footer.workHours,
        offices: footer.offices.map((o) => ({
            label: o.label,
            address: o.address,
            phoneNumber: o.phoneNumber,
            phoneDisplay: o.phoneDisplay,
        })),
        socialLabel: footer.socialLabel,
        legal: footer.legal,
        bottomLinks: footer.bottomLinks.map(footerLinkToForm),
        copyright: footer.copyright,
        disclaimer: footer.disclaimer,
        toTopLabel: footer.toTopLabel,
    };
}

export function formValuesToFooter(values: FooterFormValues): Footer {
    return {
        tagline: values.tagline.trim(),
        navTitle: values.navTitle.trim(),
        navItems: values.navItems.map(formToFooterLink),
        contactsTitle: values.contactsTitle.trim(),
        email: values.email.trim(),
        workHours: values.workHours.trim(),
        offices: values.offices.map(
            (o): FooterOffice => ({
                label: o.label.trim(),
                address: o.address.trim(),
                phoneNumber: o.phoneNumber.trim(),
                phoneDisplay: o.phoneDisplay.trim(),
            })
        ),
        socialLabel: values.socialLabel.trim(),
        legal: {
            ogrn: values.legal.ogrn.trim(),
            inn: values.legal.inn.trim(),
            kpp: values.legal.kpp.trim(),
        },
        bottomLinks: values.bottomLinks.map(formToFooterLink),
        copyright: values.copyright.trim(),
        disclaimer: values.disclaimer.trim(),
        toTopLabel: values.toTopLabel.trim(),
    };
}

// --- Contacts ---

const contactPhoneSchema = z.object({
    code: z.string().min(1, "Укажите код"),
    label: z.string().min(1, "Укажите подпись"),
    number: z.string().min(1, "Укажите номер"),
    display: z.string().min(1, "Укажите отображение"),
});

const contactAddressSchema = z.object({
    key: z.string().min(1, "Укажите ключ"),
    label: z.string().min(1, "Укажите подпись"),
    value: z.string().min(1, "Укажите адрес"),
});

const contactSocialSchema = z.object({
    key: z.string().min(1, "Укажите ключ"),
    label: z.string().min(1, "Укажите подпись"),
    url: z.string().min(1, "Укажите ссылку"),
});

export const contactsSchema = z.object({
    phones: z.array(contactPhoneSchema),
    email: z.string().min(1, "Укажите email"),
    addresses: z.array(contactAddressSchema),
    social: z.array(contactSocialSchema),
    workHours: z.string().min(1, "Укажите часы работы"),
    legal: legalSchema,
});
export type ContactsFormValues = z.infer<typeof contactsSchema>;

export function contactsToFormValues(contacts: Contacts): ContactsFormValues {
    return {
        phones: contacts.phones.map((p) => ({ ...p })),
        email: contacts.email,
        addresses: contacts.addresses.map((a) => ({ ...a })),
        social: contacts.social.map((s) => ({ ...s })),
        workHours: contacts.workHours,
        legal: contacts.legal,
    };
}

export function formValuesToContacts(values: ContactsFormValues): Contacts {
    return {
        phones: values.phones.map(
            (p): ContactPhone => ({
                code: p.code.trim(),
                label: p.label.trim(),
                number: p.number.trim(),
                display: p.display.trim(),
            })
        ),
        email: values.email.trim(),
        addresses: values.addresses.map(
            (a): ContactAddress => ({
                key: a.key.trim(),
                label: a.label.trim(),
                value: a.value.trim(),
            })
        ),
        social: values.social.map(
            (s): ContactSocial => ({
                key: s.key.trim(),
                label: s.label.trim(),
                url: s.url.trim(),
            })
        ),
        workHours: values.workHours.trim(),
        legal: {
            ogrn: values.legal.ogrn.trim(),
            inn: values.legal.inn.trim(),
            kpp: values.legal.kpp.trim(),
        },
    };
}

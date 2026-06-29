import type {
    BlogPage,
    ContactAddress,
    ContactPhone,
    Contacts,
    ContactSocial,
    Footer,
    FooterLink,
    FooterOffice,
    ListingPages,
    Navigation,
    NavItem,
    NavSubItem,
    Seo,
    ServicesUi,
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

// --- Blog page (chrome of /blog) ---

export const blogPageSchema = z.object({
    hero: z.object({
        eyebrow: z.string().min(1, "Укажите надзаголовок"),
        title: z.string().min(1, "Укажите заголовок"),
        lead: z.string().min(1, "Укажите подзаголовок"),
        panelLabel: z.string().min(1, "Укажите подпись панели"),
    }),
    featured: z.object({
        eyebrow: z.string().min(1, "Укажите надзаголовок"),
        title: z.string().min(1, "Укажите заголовок"),
        titleAccent: z.string().min(1, "Укажите акцент заголовка"),
        lead: z.string().min(1, "Укажите подзаголовок"),
    }),
    list: z.object({
        eyebrow: z.string().min(1, "Укажите надзаголовок"),
        title: z.string().min(1, "Укажите заголовок"),
        lead: z.string().min(1, "Укажите подзаголовок"),
    }),
    cta: z.object({
        eyebrow: z.string().min(1, "Укажите надзаголовок"),
        title: z.string().min(1, "Укажите заголовок"),
        text: z.string().min(1, "Укажите текст"),
        buttonLabel: z.string().min(1, "Укажите подпись кнопки"),
        buttonHref: z.string().min(1, "Укажите ссылку кнопки"),
    }),
});
export type BlogPageFormValues = z.infer<typeof blogPageSchema>;

export function blogPageToFormValues(blogPage: BlogPage): BlogPageFormValues {
    return {
        hero: { ...blogPage.hero },
        featured: { ...blogPage.featured },
        list: { ...blogPage.list },
        cta: { ...blogPage.cta },
    };
}

export function formValuesToBlogPage(values: BlogPageFormValues): BlogPage {
    const trim = <T extends Record<string, string>>(obj: T): T =>
        Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k, v.trim()])
        ) as T;
    return {
        hero: trim(values.hero),
        featured: trim(values.featured),
        list: trim(values.list),
        cta: trim(values.cta),
    };
}

// --- Services navigator UI (Setting services_ui) ---

// SelectField cannot hold an empty value; use this sentinel for "no service".
export const SERVICE_SLUG_NONE = "__none__";

const wrappedStringMin = z.object({ value: z.string().min(1, "Не пусто") });

export const servicesUiSchema = z.object({
    quiz: z.object({
        objectOptions: z.array(wrappedStringMin),
        timingOptions: z.array(wrappedStringMin),
    }),
    routeSteps: z.array(
        z.object({
            title: z.string().min(1, "Укажите заголовок"),
            description: z.string().min(1, "Добавьте описание"),
            serviceSlug: z.string(),
        })
    ),
    additionalLinks: z.array(
        z.object({
            title: z.string().min(1, "Укажите заголовок"),
            parentSlug: z.string().min(1, "Выберите услугу"),
        })
    ),
});
export type ServicesUiFormValues = z.infer<typeof servicesUiSchema>;

export function servicesUiToFormValues(ui: ServicesUi): ServicesUiFormValues {
    return {
        quiz: {
            objectOptions: ui.quiz.objectOptions.map((value) => ({ value })),
            timingOptions: ui.quiz.timingOptions.map((value) => ({ value })),
        },
        routeSteps: ui.routeSteps.map((s) => ({
            title: s.title,
            description: s.description,
            serviceSlug: s.serviceSlug ?? SERVICE_SLUG_NONE,
        })),
        additionalLinks: ui.additionalLinks.map((l) => ({
            title: l.title,
            parentSlug: l.parentSlug,
        })),
    };
}

export function formValuesToServicesUi(
    values: ServicesUiFormValues
): ServicesUi {
    const unwrap = (items: { value: string }[]) =>
        items.map((i) => i.value.trim()).filter(Boolean);
    return {
        quiz: {
            objectOptions: unwrap(values.quiz.objectOptions),
            timingOptions: unwrap(values.quiz.timingOptions),
        },
        routeSteps: values.routeSteps.map((s) => ({
            title: s.title.trim(),
            description: s.description.trim(),
            serviceSlug:
                s.serviceSlug === SERVICE_SLUG_NONE
                    ? null
                    : s.serviceSlug.trim(),
        })),
        additionalLinks: values.additionalLinks.map((l) => ({
            title: l.title.trim(),
            parentSlug: l.parentSlug,
        })),
    };
}

// --- Listing pages chrome (Setting listing_pages) ---

export const listingPagesSchema = z.object({
    reviews: z.object({
        metrics: z.array(
            z.object({
                value: z.string().min(1, "Укажите значение"),
                label: z.string().min(1, "Укажите подпись"),
            })
        ),
    }),
    certificates: z.object({
        checks: z.array(
            z.object({
                title: z.string().min(1, "Укажите заголовок"),
                text: z.string().min(1, "Укажите текст"),
            })
        ),
    }),
    partners: z.object({
        principles: z.array(z.object({ value: z.string().min(1, "Не пусто") })),
    }),
});
export type ListingPagesFormValues = z.infer<typeof listingPagesSchema>;

export function listingPagesToFormValues(
    lp: ListingPages
): ListingPagesFormValues {
    return {
        reviews: { metrics: lp.reviews.metrics.map((m) => ({ ...m })) },
        certificates: {
            checks: lp.certificates.checks.map((c) => ({ ...c })),
        },
        partners: {
            principles: lp.partners.principles.map((value) => ({ value })),
        },
    };
}

export function formValuesToListingPages(
    values: ListingPagesFormValues
): ListingPages {
    return {
        reviews: {
            metrics: values.reviews.metrics.map((m) => ({
                value: m.value.trim(),
                label: m.label.trim(),
            })),
        },
        certificates: {
            checks: values.certificates.checks.map((c) => ({
                title: c.title.trim(),
                text: c.text.trim(),
            })),
        },
        partners: {
            principles: values.partners.principles
                .map((p) => p.value.trim())
                .filter(Boolean),
        },
    };
}

// --- Site SEO (Setting seo): defaults, index pages, Open Graph ---

const seoIndexMetaSchema = z.object({
    title: z.string().min(1, "Укажите заголовок"),
    description: z.string().min(1, "Укажите описание"),
});

export const seoSchema = z.object({
    baseUrl: z
        .string()
        .url("Укажите полный URL со схемой, например https://ncottage.ru"),
    siteName: z.string().min(1, "Укажите название сайта"),
    defaultTitle: z.string().min(1, "Укажите заголовок по умолчанию"),
    defaultDescription: z.string().min(1, "Укажите описание по умолчанию"),
    ogImageUrl: z.string(),
    indexes: z.object({
        blog: seoIndexMetaSchema,
        services: seoIndexMetaSchema,
        projects: seoIndexMetaSchema,
        promos: seoIndexMetaSchema,
        reviews: seoIndexMetaSchema,
        faq: seoIndexMetaSchema,
        certificates: seoIndexMetaSchema,
        partners: seoIndexMetaSchema,
        vacancies: seoIndexMetaSchema,
        "project-selections": seoIndexMetaSchema,
    }),
});
export type SeoFormValues = z.infer<typeof seoSchema>;

export function seoToFormValues(seo: Seo): SeoFormValues {
    const indexes = Object.fromEntries(
        Object.entries(seo.indexes).map(([k, v]) => [k, { ...v }])
    ) as SeoFormValues["indexes"];
    return {
        baseUrl: seo.baseUrl,
        siteName: seo.siteName,
        defaultTitle: seo.defaultTitle,
        defaultDescription: seo.defaultDescription,
        ogImageUrl: seo.ogImageUrl,
        indexes,
    };
}

export function formValuesToSeo(values: SeoFormValues): Seo {
    const indexes = Object.fromEntries(
        Object.entries(values.indexes).map(([k, v]) => [
            k,
            { title: v.title.trim(), description: v.description.trim() },
        ])
    ) as Seo["indexes"];
    return {
        baseUrl: values.baseUrl.trim(),
        siteName: values.siteName.trim(),
        defaultTitle: values.defaultTitle.trim(),
        defaultDescription: values.defaultDescription.trim(),
        ogImageUrl: values.ogImageUrl.trim(),
        indexes,
    };
}

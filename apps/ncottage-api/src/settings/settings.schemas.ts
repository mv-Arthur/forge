import type { SettingKey } from "@forge/shared";
import { z } from "zod";

const navSubItem = z.object({ label: z.string(), href: z.string() });
const navItem = z.object({
    label: z.string(),
    href: z.string(),
    children: z.array(navSubItem).optional(),
    badge: z.literal("sale").optional(),
});
const navigation = z.object({ items: z.array(navItem) });

const footerLink = z.object({
    label: z.string(),
    href: z.string(),
    external: z.boolean().optional(),
});
const footerOffice = z.object({
    label: z.string(),
    address: z.string(),
    phoneNumber: z.string(),
    phoneDisplay: z.string(),
});
const legal = z.object({ ogrn: z.string(), inn: z.string(), kpp: z.string() });
const footer = z.object({
    tagline: z.string(),
    navTitle: z.string(),
    navItems: z.array(footerLink),
    contactsTitle: z.string(),
    email: z.string(),
    workHours: z.string(),
    offices: z.array(footerOffice),
    socialLabel: z.string(),
    legal,
    bottomLinks: z.array(footerLink),
    copyright: z.string(),
    disclaimer: z.string(),
    toTopLabel: z.string(),
});

const contactPhone = z.object({
    code: z.string(),
    label: z.string(),
    number: z.string(),
    display: z.string(),
});
const contactAddress = z.object({
    key: z.string(),
    label: z.string(),
    value: z.string(),
});
const contactSocial = z.object({
    key: z.string(),
    label: z.string(),
    url: z.string(),
});
const contacts = z.object({
    phones: z.array(contactPhone),
    email: z.string(),
    addresses: z.array(contactAddress),
    social: z.array(contactSocial),
    workHours: z.string(),
    legal,
});

const blogPage = z.object({
    hero: z.object({
        eyebrow: z.string(),
        title: z.string(),
        lead: z.string(),
        panelLabel: z.string(),
    }),
    featured: z.object({
        eyebrow: z.string(),
        title: z.string(),
        titleAccent: z.string(),
        lead: z.string(),
    }),
    list: z.object({
        eyebrow: z.string(),
        title: z.string(),
        lead: z.string(),
    }),
    cta: z.object({
        eyebrow: z.string(),
        title: z.string(),
        text: z.string(),
        buttonLabel: z.string(),
        buttonHref: z.string(),
    }),
});

const servicesUi = z.object({
    quiz: z.object({
        objectOptions: z.array(z.string()),
        timingOptions: z.array(z.string()),
    }),
    routeSteps: z.array(
        z.object({
            title: z.string(),
            description: z.string(),
            serviceSlug: z.string().nullable(),
        })
    ),
    additionalLinks: z.array(
        z.object({
            title: z.string(),
            parentSlug: z.string(),
        })
    ),
});

const seoIndexMeta = z.object({
    title: z.string(),
    description: z.string(),
});
const seo = z.object({
    baseUrl: z.string(),
    siteName: z.string(),
    defaultTitle: z.string(),
    defaultDescription: z.string(),
    ogImageUrl: z.string(),
    indexes: z.object({
        blog: seoIndexMeta,
        services: seoIndexMeta,
        projects: seoIndexMeta,
        promos: seoIndexMeta,
        reviews: seoIndexMeta,
        faq: seoIndexMeta,
        certificates: seoIndexMeta,
        partners: seoIndexMeta,
        vacancies: seoIndexMeta,
        "project-selections": seoIndexMeta,
    }),
});

export const SETTING_SCHEMAS: Record<SettingKey, z.ZodType> = {
    nav: navigation,
    footer,
    contacts,
    blog_page: blogPage,
    services_ui: servicesUi,
    seo,
};

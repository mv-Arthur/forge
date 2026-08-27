import {
    ATTR_REGIONS_SUB,
    ATTR_TURNKEY_SUB,
    ATTR_TURNKEY_TITLE,
    ATTR_VISIT_READY_SUB,
    ATTR_WARRANTY_SUB,
    COMPANY_OFFER_HEADING,
    COMPANY_OFFER_LEAD,
    CTA_MORE,
    CTA_SEND,
    CTA_SIGN_UP,
    PROMO_FARGO_SUB,
    PROMO_FARGO_TITLE,
    PROMO_HILL_SUB,
    PROMO_HILL_TITLE,
    PROMO_OWN_SUB,
    PROMO_OWN_TITLE,
    PROMO_SITE_SUB,
    PROMO_SITE_TITLE,
    PROMO_VISIT_SUB,
    PROMO_VISIT_TITLE,
} from "@/lib/copy";
import { settings } from "@/lib/settings";
import type { HeroPayload } from "./types";

const KISKELOVO_SLUG =
    "dvuhetazhnyi-dom-iz-gazobetonnyh-blokov-v-derevne-kiskelovo";

export const heroPayload: HeroPayload = {
    heading: COMPANY_OFFER_HEADING,
    lead: COMPANY_OFFER_LEAD,
    cards: [
        {
            href: "/projects/fargo",
            image: "fargo",
            title: PROMO_FARGO_TITLE,
            subtitle: PROMO_FARGO_SUB,
            cta: CTA_MORE,
        },
        {
            href: "/projects/hill",
            image: "hill",
            title: PROMO_HILL_TITLE,
            subtitle: PROMO_HILL_SUB,
            cta: CTA_MORE,
        },
        {
            href: "/works",
            image: "visit",
            title: PROMO_VISIT_TITLE,
            subtitle: PROMO_VISIT_SUB,
            cta: CTA_SIGN_UP,
        },
        {
            href: "/#lead",
            image: "own-project",
            title: PROMO_OWN_TITLE,
            subtitle: PROMO_OWN_SUB,
            cta: CTA_SEND,
        },
        {
            href: `/works/${KISKELOVO_SLUG}`,
            image: "kiskelovo",
            title: PROMO_SITE_TITLE,
            subtitle: PROMO_SITE_SUB,
            cta: CTA_SIGN_UP,
        },
    ],
    attributes: [
        {
            icon: "tools",
            title: ATTR_TURNKEY_TITLE,
            subtitle: ATTR_TURNKEY_SUB,
        },
        {
            icon: "home",
            title: `Гарантия ${settings.warrantyYears} лет`,
            subtitle: ATTR_WARRANTY_SUB,
        },
        {
            icon: "corner",
            title: PROMO_VISIT_TITLE,
            subtitle: ATTR_VISIT_READY_SUB,
        },
        {
            icon: "user",
            title: `С ${settings.foundedYear} года`,
            subtitle: ATTR_REGIONS_SUB,
        },
    ],
};

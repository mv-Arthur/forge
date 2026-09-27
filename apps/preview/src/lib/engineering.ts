import { routes } from "./routes";
import {
    ENGINEERING_EXTERNAL_NAV,
    ENGINEERING_HEATING_NAV,
    ENGINEERING_PLUMBING_NAV,
    ENGINEERING_VENTILATION_NAV,
} from "./copy";

export type EngineeringArticleSlug = "heating" | "ventilation" | "plumbing";

export type EngineeringSlug = EngineeringArticleSlug | "external";

export type EngineeringNavItem = {
    slug: EngineeringSlug;
    href: string;
    label: string;
};

export const ENGINEERING_HUB_HREF = routes.service("engineering");

export const ENGINEERING_NAV: EngineeringNavItem[] = [
    {
        slug: "heating",
        href: routes.service("engineering/heating"),
        label: ENGINEERING_HEATING_NAV,
    },
    {
        slug: "external",
        href: routes.service("engineering/external"),
        label: ENGINEERING_EXTERNAL_NAV,
    },
    {
        slug: "ventilation",
        href: routes.service("engineering/ventilation"),
        label: ENGINEERING_VENTILATION_NAV,
    },
    {
        slug: "plumbing",
        href: routes.service("engineering/plumbing"),
        label: ENGINEERING_PLUMBING_NAV,
    },
];

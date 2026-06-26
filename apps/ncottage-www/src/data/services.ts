import {
    ADDITIONAL_SERVICE_LINKS,
    BUILD_ROUTE_STEPS,
    SERVICES,
    SERVICE_SCENARIOS,
} from "@/app/services/services";
import {
    DEFAULT_PLAN_PROFILE,
    QUIZ_OBJECT_OPTIONS,
    QUIZ_TIMING_OPTIONS,
    SCENARIO_PLAN_PROFILES,
} from "@/app/services/navigatorContent";
import { SERVICE_SEO_CONTENT } from "@/app/services/[slug]/seoContent";
import type {
    Service,
    ServiceScenario,
    ServicesUi,
} from "@/domain/services";

// Услуги, сценарии навигатора и его чрома приходят из ncottage-api.
// ISR: ответы кешируются и ревалидируются по тегам services/service:<slug>,
// service-scenarios, settings/settings:services_ui. Если API недоступен — отдаём
// статику, собранную из исходных модулей (services.ts/seoContent.ts/
// navigatorContent.ts), которая и была источником сидов.
const API_URL = process.env.NCOTTAGE_API_URL;
const REVALIDATE = 60;

const SERVICES_FALLBACK: Service[] = SERVICES.map((s, order) => ({
    ...s,
    order,
    detailVariants: s.detailVariants ?? [],
    detailChecks: s.detailChecks ?? [],
    seoContent: SERVICE_SEO_CONTENT[s.slug],
}));

const SCENARIOS_FALLBACK: ServiceScenario[] = SERVICE_SCENARIOS.map(
    (s, order) => ({
        ...s,
        order,
        primaryServiceSlugs: s.primaryServiceSlugs ?? [],
        nextServiceSlugs: s.nextServiceSlugs ?? [],
        optionalServiceSlugs: s.optionalServiceSlugs ?? [],
        plan: SCENARIO_PLAN_PROFILES[s.slug] ?? DEFAULT_PLAN_PROFILE,
    })
);

const SERVICES_UI_FALLBACK: ServicesUi = {
    quiz: {
        objectOptions: QUIZ_OBJECT_OPTIONS,
        timingOptions: QUIZ_TIMING_OPTIONS,
    },
    routeSteps: BUILD_ROUTE_STEPS.map((s) => ({
        title: s.title,
        description: s.description,
        serviceSlug: s.serviceSlug,
    })),
    additionalLinks: ADDITIONAL_SERVICE_LINKS.map((l) => ({
        title: l.title,
        parentSlug: l.parentSlug,
    })),
};

export async function getServices(): Promise<Service[]> {
    if (!API_URL) return SERVICES_FALLBACK;
    try {
        const res = await fetch(`${API_URL}/services`, {
            next: { revalidate: REVALIDATE, tags: ["services"] },
        });
        if (!res.ok) return SERVICES_FALLBACK;
        return (await res.json()) as Service[];
    } catch {
        return SERVICES_FALLBACK;
    }
}

export async function getServiceBySlug(
    slug: string
): Promise<Service | undefined> {
    if (!API_URL) {
        return SERVICES_FALLBACK.find((s) => s.slug === slug);
    }
    try {
        const res = await fetch(
            `${API_URL}/services/${encodeURIComponent(slug)}`,
            {
                next: {
                    revalidate: REVALIDATE,
                    tags: ["services", `service:${slug}`],
                },
            }
        );
        if (res.status === 404) return undefined;
        if (!res.ok) return SERVICES_FALLBACK.find((s) => s.slug === slug);
        return (await res.json()) as Service;
    } catch {
        return SERVICES_FALLBACK.find((s) => s.slug === slug);
    }
}

export async function getServiceScenarios(): Promise<ServiceScenario[]> {
    if (!API_URL) return SCENARIOS_FALLBACK;
    try {
        const res = await fetch(`${API_URL}/service-scenarios`, {
            next: { revalidate: REVALIDATE, tags: ["service-scenarios"] },
        });
        if (!res.ok) return SCENARIOS_FALLBACK;
        return (await res.json()) as ServiceScenario[];
    } catch {
        return SCENARIOS_FALLBACK;
    }
}

export async function getServicesUi(): Promise<ServicesUi> {
    if (!API_URL) return SERVICES_UI_FALLBACK;
    try {
        const res = await fetch(`${API_URL}/settings/services_ui`, {
            next: {
                revalidate: REVALIDATE,
                tags: ["settings", "settings:services_ui"],
            },
        });
        if (!res.ok) return SERVICES_UI_FALLBACK;
        const data = (await res.json()) as { value: ServicesUi };
        return data.value;
    } catch {
        return SERVICES_UI_FALLBACK;
    }
}

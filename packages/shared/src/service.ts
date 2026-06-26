// Доменные типы услуг (эпик E4). Источник правды для backend (ncottage-api) и,
// как fallback-данные, для ncottage-www. Услуги и сценарии навигатора управляются
// как коллекции; чрома навигатора (квиз, route-steps, доп. ссылки) — Setting
// services_ui. Объёмный SEO-контент услуги хранится вложенным JSON (D5).

export interface ServiceDetailVariant {
    title: string;
    description: string;
}

export interface ServiceTimingItem {
    label: string;
    value: string;
    description: string;
}

export interface ServiceExample {
    title: string;
    description: string;
    result: string;
}

export interface ServiceFaqItem {
    question: string;
    answer: string;
}

// SEO-контент услуги (раньше — отдельный SERVICE_SEO_CONTENT по slug). Ровно
// один на услугу, всегда читается/правится вместе с ней → вложенный JSON.
export interface ServiceSeoContent {
    priceNote: string;
    timingLead: string;
    timing: ServiceTimingItem[];
    examplesLead: string;
    examples: ServiceExample[];
    faq: ServiceFaqItem[];
}

export interface Service {
    slug: string;
    order: number;
    title: string;
    shortTitle: string;
    description: string;
    sourceTitle: string;
    eyebrow: string;
    lead: string;
    summary: string;
    image: string;
    cta: string;
    highlights: string[];
    scopes: string[];
    stages: string[];
    advantages: string[];
    fitFor: string[];
    includes: string[];
    notIncluded: string[];
    priceFactors: string[];
    deliverables: string[];
    quickFacts: string[];
    detailPain?: string;
    detailPromise?: string;
    detailVariants: ServiceDetailVariant[];
    detailChecks: string[];
    detailNextStep?: string;
    detailCta?: string;
    // Мягкие ссылки на слаги других услуг/сценариев (без FK, как ProjectRelation).
    relatedSlugs: string[];
    scenarioSlugs: string[];
    seoContent: ServiceSeoContent;
    seoTitle?: string;
    seoDescription?: string;
}

// Копия «персонального маршрута» сценария (раньше — SCENARIO_PLAN_PROFILES по
// slug). Влита в сценарий: 1:1, правится вместе с ним, без рассинхрона слагов.
export interface ServiceScenarioPlan {
    title: string;
    resultLabel: string;
    visualTitle: string;
    visualCaption: string;
    image: string;
    startLabel: string;
    startText?: string;
    nextLabel: string;
    nextText: string;
    optionalLabel: string;
    optionalText: string;
    ctaText: string;
}

export interface ServiceScenario {
    slug: string;
    order: number;
    title: string;
    description: string;
    questionLabel: string;
    pain?: string;
    promise?: string;
    outcome?: string;
    cta?: string;
    nextStep: string;
    serviceSlugs: string[];
    primaryServiceSlugs: string[];
    nextServiceSlugs: string[];
    optionalServiceSlugs: string[];
    plan: ServiceScenarioPlan;
}

// Setting services_ui — глобальная чрома навигатора услуг.
export interface ServicesUiQuiz {
    objectOptions: string[];
    timingOptions: string[];
}

export interface ServicesUiRouteStep {
    title: string;
    description: string;
    serviceSlug: string | null;
}

export interface ServicesUiAdditionalLink {
    title: string;
    parentSlug: string;
}

export interface ServicesUi {
    quiz: ServicesUiQuiz;
    routeSteps: ServicesUiRouteStep[];
    additionalLinks: ServicesUiAdditionalLink[];
}

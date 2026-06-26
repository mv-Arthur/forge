// Доменные типы услуг живут в @forge/shared (общие с backend ncottage-api).
// Реэкспорт даёт стабильный путь `@/domain/services` для www.
export type {
    Service,
    ServiceDetailVariant,
    ServiceTimingItem,
    ServiceExample,
    ServiceFaqItem,
    ServiceSeoContent,
    ServiceScenario,
    ServiceScenarioPlan,
    ServicesUi,
    ServicesUiQuiz,
    ServicesUiRouteStep,
    ServicesUiAdditionalLink,
} from "@forge/shared";

// Слаги услуг и сценариев — свободные строки (управляются в CMS). Узкий union
// (как раньше в app/services/services.ts) больше не нужен.
export type ServiceSlug = string;
export type ServiceScenarioSlug = string;

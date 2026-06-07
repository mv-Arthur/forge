import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import {
    ServicesNavigator,
    type BuildRouteStep,
    type NavigatorScenario,
    type NavigatorService,
} from "./ServicesNavigator";
import * as servicesData from "./services";
import styles from "./services.module.css";

export const metadata: Metadata = {
    title: "Услуги — проектирование и строительство домов | Новый Коттедж",
    description:
        "Услуги компании Новый Коттедж: проектирование, строительство домов, фундаменты, бани, коммерческая недвижимость, отделка, благоустройство, инженерные сети и демонтаж.",
    alternates: { canonical: "/services" },
};

const DEFAULT_SERVICE_SCENARIOS = [
    {
        slug: "plot-start",
        title: "Есть участок",
        description:
            "Нужно понять ограничения, подготовить площадку и выбрать правильную последовательность работ.",
        nextStep:
            "Начните с консультации по участку: проверим вводные, риски и подберём проектный маршрут.",
        serviceSlugs: ["demolition", "design", "engineering", "landscaping"],
    },
    {
        slug: "project-ready",
        title: "Есть проект",
        description:
            "Пора проверить решения, смету, фундамент и комплектацию перед выходом на стройку.",
        nextStep:
            "Покажите проект специалисту — подготовим смету, этапность и список критичных уточнений.",
        serviceSlugs: ["design", "foundations", "construction", "engineering"],
    },
    {
        slug: "build-house",
        title: "Нужно построить дом",
        description:
            "Требуется связать проект, фундамент, коробку, инженерию и отделку в понятный план.",
        nextStep:
            "Соберём маршрут строительства с комплектацией, сроками и точками контроля.",
        serviceSlugs: [
            "design",
            "foundations",
            "construction",
            "engineering",
            "finishing",
        ],
    },
    {
        slug: "box-ready",
        title: "Коробка готова",
        description:
            "Нужно довести дом до комфортной эксплуатации: инженерия, отделка и территория.",
        nextStep:
            "Согласуем инженерные решения, отделочные работы и этапы благоустройства.",
        serviceSlugs: ["engineering", "finishing", "landscaping"],
    },
    {
        slug: "extra-object",
        title: "Баня или доп. объект",
        description:
            "Хотите добавить баню, гостевой домик, коммерческую постройку или подготовить участок.",
        nextStep:
            "Определим назначение объекта, фундамент, подключения и формат строительства.",
        serviceSlugs: ["baths", "commercial", "foundations", "engineering"],
    },
] satisfies NavigatorScenario[];

const DEFAULT_BUILD_ROUTE_STEPS = [
    {
        title: "Участок",
        description:
            "Проверяем вводные, рельеф, демонтаж, подъезды и будущие коммуникации.",
        serviceSlugs: ["demolition", "landscaping"],
    },
    {
        title: "Проект",
        description:
            "Фиксируем планировки, конструктив, инженерные разделы и сметные ориентиры.",
        serviceSlugs: ["design"],
    },
    {
        title: "Фундамент",
        description:
            "Подбираем основание под грунт, нагрузки, технологию дома и бюджет.",
        serviceSlugs: ["foundations"],
    },
    {
        title: "Коробка",
        description:
            "Строим тёплый контур, кровлю и несущие конструкции по согласованной комплектации.",
        serviceSlugs: ["construction", "commercial", "baths"],
    },
    {
        title: "Инженерия",
        description:
            "Прокладываем воду, канализацию, отопление, электрику, вентиляцию и слаботочные системы.",
        serviceSlugs: ["engineering"],
    },
    {
        title: "Отделка",
        description:
            "Доводим дом до нужного уровня готовности внутри и снаружи.",
        serviceSlugs: ["finishing"],
    },
    {
        title: "Благоустройство",
        description:
            "Связываем дом с участком: дорожки, зелень, свет, заборы, дренаж и зоны отдыха.",
        serviceSlugs: ["landscaping"],
    },
] satisfies BuildRouteStep[];

const serviceModule = servicesData as typeof servicesData & {
    SERVICE_SCENARIOS?: NavigatorScenario[];
    BUILD_ROUTE_STEPS?: BuildRouteStep[];
};

export default function ServicesPage() {
    const services = servicesData.SERVICES as NavigatorService[];
    const scenarios = serviceModule.SERVICE_SCENARIOS?.length
        ? serviceModule.SERVICE_SCENARIOS
        : DEFAULT_SERVICE_SCENARIOS;
    const routeSteps = serviceModule.BUILD_ROUTE_STEPS?.length
        ? serviceModule.BUILD_ROUTE_STEPS
        : DEFAULT_BUILD_ROUTE_STEPS;

    return (
        <section className={styles.page}>
            <Container>
                <Breadcrumbs
                    items={[
                        { label: "Главная", href: "/" },
                        { label: "Услуги" },
                    ]}
                />

                <ServicesNavigator
                    services={services}
                    scenarios={scenarios}
                    routeSteps={routeSteps}
                    additionalLinks={servicesData.ADDITIONAL_SERVICE_LINKS}
                />
            </Container>
        </section>
    );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type {
    Service,
    ServiceScenario,
    ServiceSlug,
    ServicesUi,
    ServicesUiAdditionalLink,
    ServicesUiRouteStep,
} from "@/domain/services";
import { DEFAULT_PLAN_PROFILE } from "./navigatorContent";
import styles from "./services.module.css";

// Локальные алиасы сохраняют прежние имена в сигнатурах хелперов ниже.
type NavigatorService = Service;
type NavigatorScenario = ServiceScenario;
type BuildRouteStep = ServicesUiRouteStep;

interface ServicesNavigatorProps {
    services: Service[];
    scenarios: ServiceScenario[];
    quiz: ServicesUi["quiz"];
    routeSteps: ServicesUiRouteStep[];
    additionalLinks: ServicesUiAdditionalLink[];
}

type CSSVariableStyle = CSSProperties & Record<`--${string}`, string>;

interface RouteGraphPoint {
    x: number;
    y: number;
}

const SCENARIO_PLAN_CLASS = styles.planRoute;
const INITIAL_QUIZ_FORM = {
    object: "",
    stage: "",
    timing: "",
    name: "",
    phone: "",
    consent: false,
};
const QUIZ_FOCUSABLE_SELECTOR =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function cn(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function getRouteNodeStyle(
    point: RouteGraphPoint | undefined,
    order: number
): CSSVariableStyle {
    return {
        "--route-x": `${point?.x ?? 50}%`,
        "--route-y": `${point?.y ?? 50}%`,
        "--route-order": `${order}`,
    };
}

function getRouteGraphPoints(count: number): RouteGraphPoint[] {
    if (count <= 0) return [];
    if (count === 1) return [{ x: 50, y: 50 }];

    return Array.from({ length: count }, (_, index) => {
        const progress = index / (count - 1);
        const isEdge = index === 0 || index === count - 1;
        const y = 50 + (index % 2 === 0 ? -10 : 12) + (isEdge ? -4 : 0);

        return {
            x: 10 + progress * 80,
            y,
        };
    });
}

function getRouteGraphPath(points: RouteGraphPoint[]) {
    if (points.length < 2) return "";

    const [firstPoint, ...restPoints] = points;

    return restPoints.reduce((path, point, index) => {
        const previousPoint = points[index];
        const middleX = (previousPoint.x + point.x) / 2;

        return `${path} C ${middleX} ${previousPoint.y} ${middleX} ${point.y} ${point.x} ${point.y}`;
    }, `M ${firstPoint.x} ${firstPoint.y}`);
}

function getServiceMatch(
    service: NavigatorService,
    scenario: NavigatorScenario
) {
    return (
        service.scenarioSlugs?.includes(scenario.slug) ||
        scenario.serviceSlugs?.includes(service.slug) ||
        false
    );
}

function getRelatedServices(
    services: NavigatorService[],
    scenario: NavigatorScenario
) {
    return services.filter((service) => getServiceMatch(service, scenario));
}

function getRouteSlugs(step: BuildRouteStep) {
    return step.serviceSlug ? [step.serviceSlug] : [];
}

function getRouteStageSlugs(step: BuildRouteStep) {
    const slugs = getRouteSlugs(step);

    if (step.title === "Участок") {
        return getUniqueSlugs([...slugs, "demolition", "landscaping"]);
    }

    if (step.title === "Коробка") {
        return getUniqueSlugs([
            ...slugs,
            "construction",
            "commercial",
            "baths",
        ]);
    }

    return slugs;
}

function getServiceList(primary: string[] | undefined, fallback: string[]) {
    return primary?.length ? primary : fallback.slice(0, 2);
}

function getServiceCountLabel(count: number) {
    const lastTwo = count % 100;
    const last = count % 10;

    if (lastTwo >= 11 && lastTwo <= 14) return `${count} услуг`;
    if (last === 1) return `${count} услуга`;
    if (last >= 2 && last <= 4) return `${count} услуги`;

    return `${count} услуг`;
}

function getUniqueSlugs(slugs: Array<ServiceSlug | undefined>) {
    return [...new Set(slugs.filter(Boolean) as ServiceSlug[])];
}

function getPhoneDigits(value: string) {
    return value.replace(/\D/g, "");
}

function formatQuizPhone(value: string) {
    const digits = getPhoneDigits(value);

    if (!digits) return "";

    const normalized = digits.startsWith("8")
        ? `7${digits.slice(1)}`
        : digits.startsWith("7")
          ? digits
          : `7${digits}`;
    const rest = normalized.slice(1, 11);
    const area = rest.slice(0, 3);
    const first = rest.slice(3, 6);
    const second = rest.slice(6, 8);
    const third = rest.slice(8, 10);

    return [
        "+7",
        area,
        first,
        second ? `-${second}` : "",
        third ? `-${third}` : "",
    ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s-/g, "-");
}

function getServicesBySlugs(
    services: NavigatorService[],
    slugs: ServiceSlug[]
) {
    return slugs
        .map((slug) => services.find((service) => service.slug === slug))
        .filter(Boolean) as NavigatorService[];
}

function getScenarioRouteSlugs(scenario: NavigatorScenario | undefined) {
    if (!scenario) return new Set<ServiceSlug>();

    return new Set(
        getUniqueSlugs([
            ...(scenario.serviceSlugs ?? []),
            ...(scenario.primaryServiceSlugs ?? []),
            ...(scenario.nextServiceSlugs ?? []),
            ...(scenario.optionalServiceSlugs ?? []),
        ])
    );
}

function isRouteStepRelevant(
    step: BuildRouteStep,
    routeServices: NavigatorService[],
    scenario: NavigatorScenario | undefined
) {
    if (!scenario) return true;

    const scenarioSlugs = getScenarioRouteSlugs(scenario);

    if (step.title === "Участок") {
        return scenario.slug === "land-plot" || scenarioSlugs.has("demolition");
    }

    return routeServices.some((service) => scenarioSlugs.has(service.slug));
}

function getScenarioServiceGroups(
    services: NavigatorService[],
    scenario: NavigatorScenario | undefined
) {
    if (!scenario) {
        return {
            primary: [] as NavigatorService[],
            next: [] as NavigatorService[],
            optional: [] as NavigatorService[],
        };
    }

    const relatedSlugs = getRelatedServices(services, scenario).map(
        (service) => service.slug
    );
    const primarySlugs = getUniqueSlugs(
        scenario.primaryServiceSlugs?.length
            ? scenario.primaryServiceSlugs
            : relatedSlugs.slice(0, 2)
    );
    const nextSlugs = getUniqueSlugs(
        scenario.nextServiceSlugs?.length
            ? scenario.nextServiceSlugs
            : relatedSlugs
                  .filter((slug) => !primarySlugs.includes(slug))
                  .slice(0, 3)
    );
    const optionalSlugs = getUniqueSlugs(
        scenario.optionalServiceSlugs?.length
            ? scenario.optionalServiceSlugs
            : relatedSlugs.filter(
                  (slug) =>
                      !primarySlugs.includes(slug) && !nextSlugs.includes(slug)
              )
    );

    return {
        primary: getServicesBySlugs(services, primarySlugs),
        next: getServicesBySlugs(services, nextSlugs),
        optional: getServicesBySlugs(services, optionalSlugs),
    };
}

export function ServicesNavigator({
    services,
    scenarios,
    quiz,
    routeSteps,
    additionalLinks,
}: ServicesNavigatorProps) {
    const [selectedSlug, setSelectedSlug] = useState(scenarios[0]?.slug ?? "");
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number | null>(
        null
    );
    const [showAllServices, setShowAllServices] = useState(false);
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [quizStep, setQuizStep] = useState(0);
    const [quizForm, setQuizForm] = useState(INITIAL_QUIZ_FORM);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [showRouteDefault, setShowRouteDefault] = useState(false);
    const [isStickyCtaVisible, setIsStickyCtaVisible] = useState(false);
    const [isScenarioPickerPinned, setIsScenarioPickerPinned] = useState(false);
    const [scenarioPickerStyle, setScenarioPickerStyle] =
        useState<CSSVariableStyle>({});
    const scenarioPickerSlotRef = useRef<HTMLDivElement>(null);
    const routeDetailRef = useRef<HTMLDivElement>(null);
    const quizModalRef = useRef<HTMLDivElement>(null);
    const isScenarioPickerPinnedRef = useRef(false);
    const selectedScenario =
        scenarios.find((scenario) => scenario.slug === selectedSlug) ??
        scenarios[0];
    const planProfile = selectedScenario?.plan ?? DEFAULT_PLAN_PROFILE;
    const planClassName = selectedScenario ? SCENARIO_PLAN_CLASS : undefined;

    const activeServices = useMemo(() => {
        if (!selectedScenario) return new Set<ServiceSlug>();

        return new Set(
            getRelatedServices(services, selectedScenario).map(
                (service) => service.slug
            )
        );
    }, [services, selectedScenario]);

    const routeGraphItems = useMemo(() => {
        return routeSteps
            .map((step, originalIndex) => {
                const routeServices = getServicesBySlugs(
                    services,
                    getRouteStageSlugs(step)
                );

                return {
                    step,
                    originalIndex,
                    routeServices,
                };
            })
            .filter(({ step, routeServices }) =>
                isRouteStepRelevant(step, routeServices, selectedScenario)
            );
    }, [routeSteps, services, selectedScenario]);
    const routeGraphPoints = useMemo(
        () => getRouteGraphPoints(routeGraphItems.length),
        [routeGraphItems.length]
    );
    const routeGraphPath = useMemo(
        () => getRouteGraphPath(routeGraphPoints),
        [routeGraphPoints]
    );
    const selectedRouteItem =
        selectedRouteIndex === null
            ? showRouteDefault
                ? routeGraphItems[0]
                : undefined
            : routeGraphItems.find(
                  (item) => item.originalIndex === selectedRouteIndex
              );
    const selectedRouteStep = selectedRouteItem?.step;
    const routeGraphStyle: CSSVariableStyle = {
        "--route-count": `${routeGraphItems.length}`,
    };

    const serviceGroups = useMemo(
        () => getScenarioServiceGroups(services, selectedScenario),
        [services, selectedScenario]
    );
    const scenarioServiceSlugs = useMemo(() => {
        return new Set(
            [
                ...serviceGroups.primary,
                ...serviceGroups.next,
                ...serviceGroups.optional,
            ].map((service) => service.slug)
        );
    }, [serviceGroups]);
    const otherServices = services.filter(
        (service) => !scenarioServiceSlugs.has(service.slug)
    );
    const selectedRouteSlugs = selectedRouteStep
        ? getRouteStageSlugs(selectedRouteStep)
        : [];
    const selectedRouteServices = getServicesBySlugs(
        services,
        selectedRouteSlugs
    );
    const routeDetailServices = selectedRouteServices.length
        ? selectedRouteServices
        : getServicesBySlugs(
              services,
              selectedRouteStep?.title === "Участок"
                  ? ["demolition", "landscaping"]
                  : []
          );
    const planOutcomeText =
        selectedScenario?.outcome ??
        "Понятный набор работ, очередность этапов и следующий шаг без лишних услуг.";
    const planStageItems = [
        {
            label: planProfile.startLabel,
            text: planProfile.startText ?? selectedScenario?.nextStep,
            services: serviceGroups.primary,
        },
        {
            label: planProfile.nextLabel,
            text: planProfile.nextText,
            services: serviceGroups.next,
        },
        {
            label: planProfile.optionalLabel,
            text: planProfile.optionalText,
            services: serviceGroups.optional,
        },
    ];
    const quizStageOptions = scenarios.map((scenario) => scenario.title);
    const quizPhoneDigits = getPhoneDigits(quizForm.phone);
    const quizPhoneIsReady =
        quizPhoneDigits.length === 11 && quizPhoneDigits.startsWith("7");
    const quizStepIsReady =
        (quizStep === 0 && Boolean(quizForm.object)) ||
        (quizStep === 1 && Boolean(quizForm.stage)) ||
        (quizStep === 2 &&
            Boolean(quizForm.timing) &&
            quizPhoneIsReady &&
            quizForm.consent);

    function openQuiz() {
        setQuizStep(0);
        setQuizSubmitted(false);
        setQuizForm((prev) => ({
            ...prev,
            stage: selectedScenario?.title ?? prev.stage,
        }));
        setIsQuizOpen(true);
    }

    function closeQuiz() {
        setIsQuizOpen(false);
        setQuizStep(0);
        setQuizSubmitted(false);
        setQuizForm(INITIAL_QUIZ_FORM);
    }

    useEffect(() => {
        setSelectedRouteIndex(null);
    }, [selectedSlug]);

    useEffect(() => {
        const media = window.matchMedia("(min-width: 721px)");

        function updateRouteDefault() {
            setShowRouteDefault(media.matches);
        }

        updateRouteDefault();
        media.addEventListener("change", updateRouteDefault);

        return () => media.removeEventListener("change", updateRouteDefault);
    }, []);

    useEffect(() => {
        function updateStickyCtaVisibility() {
            setIsStickyCtaVisible(
                window.innerWidth <= 720 && window.scrollY > 520
            );
        }

        updateStickyCtaVisibility();
        window.addEventListener("scroll", updateStickyCtaVisibility, {
            passive: true,
        });
        window.addEventListener("resize", updateStickyCtaVisibility);

        return () => {
            window.removeEventListener("scroll", updateStickyCtaVisibility);
            window.removeEventListener("resize", updateStickyCtaVisibility);
        };
    }, []);

    useEffect(() => {
        if (!isQuizOpen) return;

        const activeElement = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        const frame = requestAnimationFrame(() => {
            quizModalRef.current
                ?.querySelector<HTMLElement>(QUIZ_FOCUSABLE_SELECTOR)
                ?.focus();
        });

        document.body.style.overflow = "hidden";

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                closeQuiz();
                return;
            }

            if (e.key !== "Tab") return;

            const focusable = Array.from(
                quizModalRef.current?.querySelectorAll<HTMLElement>(
                    QUIZ_FOCUSABLE_SELECTOR
                ) ?? []
            );

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
                return;
            }

            if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            cancelAnimationFrame(frame);
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
            activeElement?.focus?.();
        };
    }, [isQuizOpen]);

    useEffect(() => {
        if (selectedRouteIndex === null) return;
        if (
            routeGraphItems.some(
                (item) => item.originalIndex === selectedRouteIndex
            )
        ) {
            return;
        }

        setSelectedRouteIndex(null);
    }, [routeGraphItems, selectedRouteIndex]);

    useEffect(() => {
        if (selectedRouteIndex === null) return;

        const frame = requestAnimationFrame(() => {
            routeDetailRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        });

        return () => cancelAnimationFrame(frame);
    }, [selectedRouteIndex]);

    useEffect(() => {
        let frame = 0;

        function updateScenarioPickerPosition() {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const slot = scenarioPickerSlotRef.current;

                if (!slot) return;

                const slotRect = slot.getBoundingClientRect();
                const targetTop = window.innerWidth <= 720 ? 72 : 82;
                const targetWidth = Math.min(1180, window.innerWidth - 32);
                const targetLeft = (window.innerWidth - targetWidth) / 2;
                const slotTop = slotRect.top;
                const shouldPin = isScenarioPickerPinnedRef.current
                    ? slotTop <= targetTop + 10
                    : slotTop <= targetTop;

                if (!isScenarioPickerPinnedRef.current) {
                    setScenarioPickerStyle({
                        "--scenario-start-left": `${slotRect.left}px`,
                        "--scenario-start-top": `${slotRect.top}px`,
                        "--scenario-start-width": `${slotRect.width}px`,
                        "--scenario-start-height": `${slotRect.height}px`,
                        "--scenario-target-left": `${targetLeft}px`,
                        "--scenario-target-top": `${targetTop}px`,
                        "--scenario-target-width": `${targetWidth}px`,
                    });
                }

                isScenarioPickerPinnedRef.current = shouldPin;
                setIsScenarioPickerPinned(shouldPin);
            });
        }

        updateScenarioPickerPosition();
        window.addEventListener("scroll", updateScenarioPickerPosition, {
            passive: true,
        });
        window.addEventListener("resize", updateScenarioPickerPosition);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", updateScenarioPickerPosition);
            window.removeEventListener("resize", updateScenarioPickerPosition);
        };
    }, []);

    function renderScenarioPicker(
        className?: string,
        isHidden = false,
        style?: CSSVariableStyle
    ) {
        return (
            <div
                className={cn(styles.heroScenarioPicker, className)}
                aria-hidden={isHidden}
                style={style}
            >
                <span>Выберите ситуацию</span>
                <div className={styles.scenarioButtons}>
                    {scenarios.map((scenario) => (
                        <button
                            key={scenario.slug}
                            type="button"
                            className={cn(
                                styles.scenarioButton,
                                scenario.slug === selectedScenario?.slug &&
                                    styles.scenarioButtonActive
                            )}
                            aria-pressed={
                                scenario.slug === selectedScenario?.slug
                            }
                            tabIndex={isHidden ? -1 : undefined}
                            onClick={() => setSelectedSlug(scenario.slug)}
                        >
                            {scenario.title}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    function renderQuizOptions(
        items: string[],
        selectedItem: string,
        onSelect: (item: string) => void
    ) {
        return (
            <div className={styles.quizOptions}>
                {items.map((item) => (
                    <button
                        key={item}
                        type="button"
                        className={cn(
                            styles.quizOption,
                            selectedItem === item && styles.quizOptionActive
                        )}
                        aria-pressed={selectedItem === item}
                        onClick={() => onSelect(item)}
                    >
                        {item}
                    </button>
                ))}
            </div>
        );
    }

    function handleQuizSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!quizStepIsReady) return;

        if (quizStep < 2) {
            setQuizStep((prev) => Math.min(prev + 1, 2));
            return;
        }

        setQuizSubmitted(true);
    }

    function renderQuizModal() {
        if (!isQuizOpen) return null;

        return (
            <div className={styles.quizBackdrop} onClick={closeQuiz}>
                <div
                    ref={quizModalRef}
                    className={styles.quizModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="services-quiz-title"
                    aria-describedby="services-quiz-description"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        className={styles.quizClose}
                        aria-label="Закрыть"
                        onClick={closeQuiz}
                    >
                        &times;
                    </button>
                    {quizSubmitted ? (
                        <div className={styles.quizSuccess} role="status">
                            <p className={styles.eyebrow}>Прототип маршрута</p>
                            <h3 id="services-quiz-title">
                                Вводные собраны на экране
                            </h3>
                            <p id="services-quiz-description">
                                Сейчас форма никуда не отправляет данные. Когда
                                подключим интеграцию, здесь будет реальная
                                заявка.
                            </p>
                            <button
                                type="button"
                                className={styles.quizNext}
                                onClick={closeQuiz}
                            >
                                Закрыть
                            </button>
                        </div>
                    ) : (
                        <form
                            className={styles.quizForm}
                            onSubmit={handleQuizSubmit}
                        >
                            <p className={styles.eyebrow}>Мини-квиз</p>
                            <h3 id="services-quiz-title">
                                Получите маршрут работ за 15 минут
                            </h3>
                            <p
                                id="services-quiz-description"
                                className={styles.quizNote}
                            >
                                UI-прототип: данные пока никуда не отправляются.
                            </p>
                            <div
                                className={styles.quizProgress}
                                aria-label={`Шаг ${quizStep + 1} из 3`}
                            >
                                {[0, 1, 2].map((step) => (
                                    <span
                                        key={step}
                                        className={cn(
                                            styles.quizProgressDot,
                                            step <= quizStep &&
                                                styles.quizProgressDotActive
                                        )}
                                    />
                                ))}
                            </div>
                            {quizStep === 0 && (
                                <div
                                    className={styles.quizStep}
                                    aria-live="polite"
                                >
                                    <span>Шаг 1</span>
                                    <h4>Что планируете строить?</h4>
                                    {renderQuizOptions(
                                        quiz.objectOptions,
                                        quizForm.object,
                                        (object) =>
                                            setQuizForm((prev) => ({
                                                ...prev,
                                                object,
                                            }))
                                    )}
                                </div>
                            )}
                            {quizStep === 1 && (
                                <div
                                    className={styles.quizStep}
                                    aria-live="polite"
                                >
                                    <span>Шаг 2</span>
                                    <h4>На каком вы этапе?</h4>
                                    {renderQuizOptions(
                                        quizStageOptions,
                                        quizForm.stage,
                                        (stage) =>
                                            setQuizForm((prev) => ({
                                                ...prev,
                                                stage,
                                            }))
                                    )}
                                </div>
                            )}
                            {quizStep === 2 && (
                                <div
                                    className={styles.quizStep}
                                    aria-live="polite"
                                >
                                    <span>Шаг 3</span>
                                    <h4>Когда хотите начать?</h4>
                                    {renderQuizOptions(
                                        quiz.timingOptions,
                                        quizForm.timing,
                                        (timing) =>
                                            setQuizForm((prev) => ({
                                                ...prev,
                                                timing,
                                            }))
                                    )}
                                    <div className={styles.quizFields}>
                                        <label>
                                            <span>Имя</span>
                                            <input
                                                type="text"
                                                autoComplete="name"
                                                placeholder="Как к вам обращаться"
                                                value={quizForm.name}
                                                onChange={(e) =>
                                                    setQuizForm((prev) => ({
                                                        ...prev,
                                                        name: e.target.value,
                                                    }))
                                                }
                                            />
                                        </label>
                                        <label>
                                            <span>Телефон</span>
                                            <input
                                                type="tel"
                                                inputMode="tel"
                                                autoComplete="tel"
                                                placeholder="+7 999 000-00-00"
                                                value={quizForm.phone}
                                                onChange={(e) =>
                                                    setQuizForm((prev) => ({
                                                        ...prev,
                                                        phone: formatQuizPhone(
                                                            e.target.value
                                                        ),
                                                    }))
                                                }
                                                aria-invalid={
                                                    quizForm.phone
                                                        ? !quizPhoneIsReady
                                                        : undefined
                                                }
                                                required
                                            />
                                        </label>
                                    </div>
                                    <label className={styles.quizConsent}>
                                        <input
                                            type="checkbox"
                                            checked={quizForm.consent}
                                            onChange={(e) =>
                                                setQuizForm((prev) => ({
                                                    ...prev,
                                                    consent: e.target.checked,
                                                }))
                                            }
                                            required
                                        />
                                        <span>
                                            Согласен на обработку персональных
                                            данных
                                        </span>
                                    </label>
                                </div>
                            )}
                            <div className={styles.quizActions}>
                                {quizStep > 0 && (
                                    <button
                                        type="button"
                                        className={styles.quizBack}
                                        onClick={() =>
                                            setQuizStep((prev) =>
                                                Math.max(prev - 1, 0)
                                            )
                                        }
                                    >
                                        Назад
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className={styles.quizNext}
                                    disabled={!quizStepIsReady}
                                >
                                    {quizStep < 2
                                        ? "Дальше"
                                        : "Собрать вводные"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    function renderServiceCard(
        service: NavigatorService,
        index: number,
        badge?: string
    ) {
        const isFiltering = activeServices.size > 0;
        const isActive = activeServices.has(service.slug);
        const fitFor = getServiceList(service.fitFor, service.highlights).slice(
            0,
            2
        );
        const deliverables = getServiceList(
            service.deliverables,
            service.scopes
        ).slice(0, 2);
        const quickFact = service.quickFacts?.[0];

        return (
            <article
                key={service.slug}
                className={cn(
                    styles.card,
                    isActive && styles.cardActive,
                    isFiltering && !isActive && styles.cardDimmed
                )}
            >
                <div className={styles.cardHeader}>
                    <span className={styles.cardIndex}>
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    {(badge || isActive) && (
                        <span className={styles.cardBadge}>
                            {badge ?? "Подходит"}
                        </span>
                    )}
                </div>
                <div
                    className={styles.cardSketch}
                    data-sketch={service.slug}
                    aria-hidden="true"
                >
                    <span />
                    <span />
                    <span />
                </div>
                <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{service.shortTitle}</h3>
                    <p className={styles.cardText}>{service.description}</p>
                    {quickFact && (
                        <ul className={styles.quickFacts}>
                            <li>{quickFact}</li>
                        </ul>
                    )}
                </div>
                <div className={styles.cardMeta}>
                    <div>
                        <span>Подходит, если:</span>
                        <ul>
                            {fitFor.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.cardMetaSecondary}>
                        <span>На выходе:</span>
                        <ul>
                            {deliverables.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className={styles.cardFooter}>
                    <Link
                        href={`/services/${service.slug}`}
                        className={styles.cardButton}
                    >
                        Рассчитать этап
                    </Link>
                </div>
            </article>
        );
    }

    function renderServiceGroup(
        number: string,
        title: string,
        groupServices: NavigatorService[],
        badge: string,
        description: string,
        className?: string,
        hint?: React.ReactNode
    ) {
        const visibleServices = groupServices.slice(0, 2);
        const hiddenServices = groupServices.slice(2);

        const renderCards = (items: NavigatorService[], offset = 0) =>
            items.map((service, index) =>
                renderServiceCard(service, offset + index, badge)
            );

        return (
            <div className={cn(styles.serviceGroup, className)}>
                <div className={styles.serviceGroupHeader}>
                    <span>{number}</span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <small>{getServiceCountLabel(groupServices.length)}</small>
                </div>
                <div className={styles.serviceGroupContent}>
                    <div className={styles.grid}>
                        {renderCards(visibleServices)}
                        {!hiddenServices.length && hint}
                    </div>
                    {hiddenServices.length > 0 && (
                        <details className={styles.serviceGroupMore}>
                            <summary>
                                Показать ещё {hiddenServices.length}
                            </summary>
                            <div className={styles.grid}>
                                {renderCards(
                                    hiddenServices,
                                    visibleServices.length
                                )}
                                {hint}
                            </div>
                        </details>
                    )}
                </div>
            </div>
        );
    }

    return (
        <>
            <section className={styles.hero}>
                <div className={styles.heroText}>
                    <p className={styles.eyebrow}>Навигатор услуг</p>
                    <h1 className={styles.title}>
                        Подберите работы <br className={styles.mobileBreak} />
                        под ваш <br className={styles.mobileBreak} />
                        <span className={styles.titleAccent}>
                            дом, участок <br className={styles.mobileBreak} />
                            или проект
                        </span>
                    </h1>
                    <p className={styles.lead}>
                        Выберите этап — покажем <strong>нужные услуги</strong>,{" "}
                        <span className={styles.leadNext}>
                            <strong>следующий шаг</strong> и понятный маршрут
                            работ.
                        </span>
                    </p>
                    <ul
                        className={styles.heroFacts}
                        aria-label="Быстрые переходы по странице услуг"
                    >
                        <li>
                            <a href="#services-list">
                                <span>I</span>
                                <strong>Отдельные работы</strong>
                                <small>или комплекс под ключ</small>
                                <em>Смотреть услуги</em>
                            </a>
                        </li>
                        <li>
                            <a href="#service-plan">
                                <span>II</span>
                                <strong>Смета и этапность</strong>
                                <small>понятный договор до старта</small>
                                <em>Собрать маршрут</em>
                            </a>
                        </li>
                        <li>
                            <a href="#build-route">
                                <span>III</span>
                                <strong>Связка этапов</strong>
                                <small>
                                    проект, стройка, инженерия и участок
                                </small>
                                <em>Открыть карту</em>
                            </a>
                        </li>
                    </ul>
                </div>

                <aside
                    className={styles.heroPanel}
                    aria-labelledby="services-stage-title"
                >
                    <span className={styles.panelLabel}>Подбор</span>
                    <h2 id="services-stage-title">На каком вы этапе?</h2>
                    <p>
                        Выберите ситуацию — ниже обновим услуги и покажем первый
                        практический шаг.
                    </p>
                    <div
                        ref={scenarioPickerSlotRef}
                        className={styles.heroScenarioPickerSlot}
                    >
                        {renderScenarioPicker(
                            isScenarioPickerPinned
                                ? styles.heroScenarioPickerHidden
                                : undefined,
                            isScenarioPickerPinned
                        )}
                    </div>
                    {renderScenarioPicker(
                        cn(
                            styles.heroScenarioPickerPinned,
                            !isScenarioPickerPinned &&
                                styles.heroScenarioPickerFloatingHidden
                        ),
                        !isScenarioPickerPinned,
                        scenarioPickerStyle
                    )}
                    {selectedScenario && (
                        <div className={styles.nextStep}>
                            <div
                                key={selectedScenario.slug}
                                className={styles.nextStepContent}
                            >
                                <span>{selectedScenario.title}</span>
                                <strong>{selectedScenario.nextStep}</strong>
                                <p>
                                    {selectedScenario.promise ??
                                        selectedScenario.description}
                                </p>
                            </div>
                        </div>
                    )}
                </aside>
            </section>

            <section className={styles.section} id="service-plan">
                <div className={cn(styles.plan, planClassName)}>
                    <div className={styles.planScene} aria-hidden="true">
                        <Image
                            src={planProfile.image}
                            alt=""
                            fill
                            sizes="(max-width: 860px) 100vw, 52vw"
                            className={styles.planImage}
                        />
                    </div>
                    <div className={styles.planIntro}>
                        <span className={styles.eyebrow}>
                            Персональный маршрут
                        </span>
                        <h2>{planProfile.title}</h2>
                        <p>
                            {selectedScenario?.pain ??
                                selectedScenario?.description}
                        </p>
                    </div>
                    <div className={styles.planSummary}>
                        <details className={styles.planBrief}>
                            <summary>
                                <span>Контекст</span>
                                <strong>{planProfile.visualTitle}</strong>
                                <small className={styles.planDisclosurePreview}>
                                    {planProfile.visualCaption}
                                </small>
                            </summary>
                            <p>{planProfile.visualCaption}</p>
                        </details>
                        <details className={styles.planBrief}>
                            <summary>
                                <span>Результат</span>
                                <strong>{planProfile.resultLabel}</strong>
                                <small className={styles.planDisclosurePreview}>
                                    {planOutcomeText}
                                </small>
                            </summary>
                            <p>{planOutcomeText}</p>
                        </details>
                    </div>
                    <div className={styles.planColumns}>
                        {planStageItems.map((stage, index) => (
                            <details
                                key={`${selectedScenario?.slug}-${stage.label}`}
                                className={styles.planStep}
                            >
                                <summary className={styles.planStepSummary}>
                                    <span>Этап {index + 1}</span>
                                    <h3>{stage.label}</h3>
                                    <small
                                        className={styles.planDisclosurePreview}
                                    >
                                        {stage.text}
                                    </small>
                                </summary>
                                <p>{stage.text}</p>
                                <div className={styles.planLinks}>
                                    {stage.services.map((service) => (
                                        <Link
                                            key={service.slug}
                                            href={`/services/${service.slug}`}
                                        >
                                            {service.shortTitle}
                                        </Link>
                                    ))}
                                </div>
                            </details>
                        ))}
                    </div>
                    <div className={styles.planCta}>
                        <p>{planProfile.ctaText}</p>
                        <button type="button" onClick={openQuiz}>
                            {selectedScenario?.cta ?? "Получить маршрут работ"}
                        </button>
                    </div>
                </div>
            </section>

            <section className={styles.section} id="services-list">
                <SectionHeading
                    eyebrow="Услуги"
                    title="Работы под выбранный сценарий"
                    lead="Сначала — ближайшие работы. Остальные направления не мешают выбрать следующий шаг."
                    align="left"
                />
                <div className={styles.serviceGroups}>
                    {serviceGroups.primary.length > 0 && (
                        <>
                            {renderServiceGroup(
                                "01",
                                "Рекомендуем начать",
                                serviceGroups.primary,
                                "Старт",
                                "Сначала закрываем решения, без которых смета и сроки быстро плывут."
                            )}
                        </>
                    )}
                    {serviceGroups.next.length > 0 && (
                        <>
                            {renderServiceGroup(
                                "02",
                                "Следующий этап",
                                serviceGroups.next,
                                "Далее",
                                "Подключаем после первого решения, чтобы не возвращаться к переделкам."
                            )}
                        </>
                    )}
                    {serviceGroups.optional.length > 0 && (
                        <>
                            {renderServiceGroup(
                                "03",
                                "Можно запланировать позже",
                                serviceGroups.optional,
                                "Позже",
                                "Держим в маршруте, но не перегружаем старт лишними покупками.",
                                styles.serviceGroupOptional,
                                <div className={styles.serviceGroupHint}>
                                    <span>Планирование</span>
                                    <p>
                                        Зафиксируем в маршруте сейчас, а запуск
                                        привяжем к готовности участка, инженерии
                                        и бюджета.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                    {otherServices.length > 0 && (
                        <div className={styles.otherServices}>
                            {showAllServices ? (
                                <>
                                    <div className={styles.serviceGroupHeader}>
                                        <span>+</span>
                                        <h3>Остальные услуги</h3>
                                    </div>
                                    <div className={styles.grid}>
                                        {otherServices.map((service, index) =>
                                            renderServiceCard(service, index)
                                        )}
                                    </div>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.showMoreServices}
                                    onClick={() => setShowAllServices(true)}
                                >
                                    <span>Показать все направления</span>
                                    <small>
                                        Ещё{" "}
                                        {getServiceCountLabel(
                                            otherServices.length
                                        )}
                                        : технологии, инженерия и участок
                                    </small>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.section} id="build-route">
                <SectionHeading
                    eyebrow="Маршрут"
                    title="Интерактивная дорожная карта"
                    lead="Показывает, как выбранные работы связываются в этапы."
                    align="left"
                />
                <div className={styles.routeGraph} style={routeGraphStyle}>
                    <div className={styles.routeHint}>
                        <span>Как пользоваться</span>
                        <p>
                            Нажмите точку на карте — ниже появятся работы,
                            которые закрывает выбранный этап.
                        </p>
                    </div>
                    <div className={styles.routeGuide}>
                        <button
                            type="button"
                            className={styles.routeGuideButton}
                            aria-label="Как читать карту"
                            aria-describedby="route-guide-tooltip"
                        >
                            ?
                        </button>
                        <div
                            id="route-guide-tooltip"
                            className={styles.routeGuidePanel}
                            role="tooltip"
                        >
                            <strong>Подсказки по графу</strong>
                            <ol>
                                <li>
                                    <span>01</span>
                                    Сценарий оставляет только актуальные этапы.
                                </li>
                                <li>
                                    <span>02</span>
                                    Нажмите точку, чтобы раскрыть задачу этапа.
                                </li>
                                <li>
                                    <span>03</span>
                                    Теги под карточкой ведут к связанным
                                    услугам.
                                </li>
                            </ol>
                        </div>
                    </div>
                    <svg
                        key={selectedScenario?.slug}
                        className={styles.routeGraphPath}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        focusable="false"
                    >
                        <path
                            className={styles.routeGraphShadow}
                            d={routeGraphPath}
                        />
                        <path
                            className={styles.routeGraphLine}
                            d={routeGraphPath}
                        />
                    </svg>
                    <ol className={styles.route}>
                        {routeGraphItems.map((item, index) => {
                            const { step, originalIndex, routeServices } = item;
                            const isSelected =
                                originalIndex ===
                                selectedRouteItem?.originalIndex;

                            return (
                                <li
                                    key={`${selectedScenario?.slug}-${step.title}`}
                                    className={cn(
                                        styles.routeStep,
                                        styles.routeStepActive,
                                        isSelected && styles.routeStepSelected
                                    )}
                                    style={getRouteNodeStyle(
                                        routeGraphPoints[index],
                                        index
                                    )}
                                >
                                    <button
                                        type="button"
                                        className={styles.routeStepButton}
                                        aria-pressed={isSelected}
                                        title={step.title}
                                        onClick={() =>
                                            setSelectedRouteIndex(originalIndex)
                                        }
                                    >
                                        <span className={styles.routeIndex}>
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        <div className={styles.routeCopy}>
                                            <h3>{step.title}</h3>
                                            {step.description && (
                                                <p>{step.description}</p>
                                            )}
                                        </div>
                                    </button>
                                    {routeServices.length > 0 && (
                                        <div className={styles.routeLinks}>
                                            {routeServices.map((service) => (
                                                <Link
                                                    key={service.slug}
                                                    href={`/services/${service.slug}`}
                                                >
                                                    {service.shortTitle}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </div>
                {selectedRouteItem && selectedRouteStep && (
                    <div className={styles.routeDetail} ref={routeDetailRef}>
                        <div>
                            <span className={styles.eyebrow}>Этап</span>
                            <h3>{selectedRouteStep.title}</h3>
                            <p>{selectedRouteStep.description}</p>
                        </div>
                        <div>
                            <span>Что закрываем</span>
                            {routeDetailServices.length > 0 ? (
                                <ul>
                                    {routeDetailServices.map((service) => (
                                        <li key={service.slug}>
                                            <Link
                                                href={`/services/${service.slug}`}
                                            >
                                                {service.shortTitle}
                                            </Link>
                                            <p>{service.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>
                                    На этом этапе фиксируем ограничения и
                                    последовательность работ, чтобы не покупать
                                    лишние решения.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </section>

            <section className={cn(styles.section, styles.secondarySection)}>
                <SectionHeading
                    eyebrow="Ещё направления"
                    title="Дополнительные направления"
                    lead="Компактные переходы к технологиям и инженерным подразделам."
                    align="left"
                />
                <div className={styles.tagsGrid}>
                    {additionalLinks.map((item) => (
                        <Link
                            key={item.title}
                            href={`/services/${item.parentSlug}`}
                            className={styles.tagCard}
                        >
                            <span>{item.title}</span>
                            <small>внутри основного раздела</small>
                        </Link>
                    ))}
                </div>
            </section>

            <section className={styles.cta}>
                <div>
                    <p className={styles.eyebrow}>Маршрут за 15 минут</p>
                    <h2>Получите понятный план работ до покупки этапа</h2>
                    <p>
                        Уточним вводные, риски и желаемый результат — затем
                        предложим последовательность работ, которую можно
                        покупать по шагам или собрать в комплекс.
                    </p>
                    <ul className={styles.ctaList}>
                        <li>этапы и ближайший шаг</li>
                        <li>риски участка или проекта</li>
                        <li>ориентир по бюджету</li>
                    </ul>
                </div>
                <div className={styles.ctaAction}>
                    <button
                        type="button"
                        className={styles.ctaButton}
                        onClick={openQuiz}
                    >
                        Получить маршрут за 15 минут
                    </button>
                    <small>Без обязательств и выезда на участок</small>
                </div>
                <ul className={styles.trustStrip}>
                    <li>
                        <span>Договор и акты</span>
                        <p>
                            Фиксируем состав работ и сдаём этапы документально.
                        </p>
                    </li>
                    <li>
                        <span>Смета до старта</span>
                        <p>Покажем бюджетный ориентир до покупки этапа.</p>
                    </li>
                    <li>
                        <span>Можно начать с одного этапа</span>
                        <p>Не нужно покупать весь комплекс сразу.</p>
                    </li>
                </ul>
            </section>
            <div
                className={cn(
                    styles.stickyCta,
                    isStickyCtaVisible && styles.stickyCtaVisible
                )}
            >
                <div>
                    <span>Маршрут за 15 минут</span>
                    <small>3 вопроса — и понятный следующий шаг</small>
                </div>
                <button type="button" onClick={openQuiz}>
                    Получить
                </button>
            </div>
            {renderQuizModal()}
        </>
    );
}

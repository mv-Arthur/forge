"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { MergedProject, Technology } from "@/lib/types";
import {
    matchAreaBucket,
    matchBudgetBucket,
} from "@/lib/data";
import {
    formatArea,
    formatFloorsShort,
    formatMillions,
    formatPrice,
    formatTechnologyBrand,
    projectsWord,
} from "@/lib/format";
import { LeadForm } from "./LeadForm";
import {
    ArrowRightIcon,
    CheckIcon,
    HouseIcon,
    LightningIcon,
    ShieldIcon,
    TargetIcon,
} from "./Icons";

type StepKey =
    | "purpose"
    | "area"
    | "budget"
    | "floors"
    | "bedrooms"
    | "material";

interface StepConfig {
    key: StepKey;
    title: string;
    hint: string;
    options: Array<{ value: string; label: string; hint?: string; icon?: string }>;
    multi?: boolean;
}

const STEPS: StepConfig[] = [
    {
        key: "purpose",
        title: "Для чего будет дом?",
        hint: "Определяет теплоизоляцию, коммуникации, планировку",
        options: [
            {
                value: "permanent",
                label: "ПМЖ, живём круглый год",
                hint: "утепление до нормы, полная инженерка",
                icon: "🏡",
            },
            {
                value: "seasonal",
                label: "Дача, тёплый сезон",
                hint: "экономичнее — не для морозов",
                icon: "☀️",
            },
            {
                value: "guest",
                label: "Гостевой дом",
                hint: "компактно, второй дом на участке",
                icon: "🛖",
            },
        ],
    },
    {
        key: "area",
        title: "Какая площадь подходит?",
        hint: "Считайте только жилую — без террас и гаража",
        options: [
            {
                value: "lt120",
                label: "до 120 м²",
                hint: "компакт для 2–3 человек",
            },
            {
                value: "120-180",
                label: "120–180 м²",
                hint: "оптимум для 3–4 человек",
            },
            {
                value: "180-250",
                label: "180–250 м²",
                hint: "просторно, 2 этажа",
            },
            {
                value: "250-350",
                label: "250–350 м²",
                hint: "большая семья, гостевые",
            },
            {
                value: "gt350",
                label: "от 350 м²",
                hint: "статусный, без ограничений",
            },
        ],
    },
    {
        key: "budget",
        title: "На какой бюджет ориентируетесь?",
        hint: "«Под ключ» — стены + кровля + окна + инженерка",
        options: [
            { value: "lt5", label: "до 5 млн ₽", hint: "СИП, каркас" },
            { value: "5-8", label: "5–8 млн ₽", hint: "каркас, газобетон" },
            { value: "8-12", label: "8–12 млн ₽", hint: "оптимум, любой материал" },
            { value: "12-20", label: "12–20 млн ₽", hint: "кирпич, комплектация комфорт" },
            { value: "gt20", label: "от 20 млн ₽", hint: "премиум, авторская отделка" },
        ],
    },
    {
        key: "floors",
        title: "Сколько этажей нужно?",
        hint: "Можно выбрать несколько — покажем всё подходящее",
        multi: true,
        options: [
            { value: "1", label: "1 этаж", hint: "проще, дешевле, без лестниц" },
            { value: "1.5", label: "1,5 этажа", hint: "с мансардой, компромисс" },
            { value: "2", label: "2 этажа", hint: "меньше пятно застройки" },
            { value: "mansard", label: "мансардный", hint: "чердачное пространство" },
        ],
    },
    {
        key: "bedrooms",
        title: "Сколько спален?",
        hint: "«От» — покажем от этого значения и больше",
        options: [
            { value: "1", label: "от 1" },
            { value: "2", label: "от 2" },
            { value: "3", label: "от 3" },
            { value: "4", label: "от 4" },
            { value: "5", label: "от 5" },
        ],
    },
    {
        key: "material",
        title: "Материал стен",
        hint: "Опционально — если нет предпочтений, подберём по остальному",
        options: [
            { value: "any", label: "Не принципиально" },
            {
                value: "gas_concrete",
                label: "Газобетон",
                hint: "тёплый, для ПМЖ",
            },
            { value: "brick", label: "Кирпич", hint: "премиум, «на века»" },
            { value: "frame", label: "Каркас", hint: "быстро, бюджетно" },
            { value: "sip", label: "СИП", hint: "сборка за 5 дней" },
        ],
    },
];

type Answers = Partial<Record<StepKey, string | string[]>>;

interface Props {
    projects: MergedProject[];
}

export function Quiz({ projects }: Props) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    const [done, setDone] = useState(false);

    const current = STEPS[step];
    const progress = Math.round(
        ((step + (done ? 1 : 0)) / STEPS.length) * 100,
    );

    const setAnswer = (val: string) => {
        const key = current.key;
        setAnswers((s) => {
            if (current.multi) {
                const arr = (s[key] as string[] | undefined) ?? [];
                const next = arr.includes(val)
                    ? arr.filter((x) => x !== val)
                    : [...arr, val];
                return { ...s, [key]: next };
            }
            return { ...s, [key]: val };
        });
    };

    const canNext = () => {
        const val = answers[current.key];
        if (current.multi) return Array.isArray(val) && val.length > 0;
        return typeof val === "string" && val.length > 0;
    };

    const goNext = () => {
        if (step < STEPS.length - 1) {
            setStep((s) => s + 1);
        } else {
            setDone(true);
        }
    };

    const goBack = () => {
        if (done) {
            setDone(false);
            return;
        }
        if (step > 0) setStep((s) => s - 1);
    };

    const currentPreview = useMemo(
        () => filterByAnswers(projects, answers).length,
        [projects, answers],
    );

    const matches = useMemo<MergedProject[]>(() => {
        if (!done) return [];
        return filterByAnswers(projects, answers).slice(0, 5);
    }, [projects, answers, done]);

    const priceRange = useMemo(() => {
        if (matches.length === 0) return null;
        const prices = matches.map((p) => p.priceFrom).filter(Boolean);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
        };
    }, [matches]);

    if (done) {
        return (
            <ResultsView
                matches={matches}
                priceRange={priceRange}
                answers={answers}
                onReset={() => {
                    setStep(0);
                    setDone(false);
                    setAnswers({});
                }}
                onBack={goBack}
            />
        );
    }

    return (
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-3xl border border-ink-150 bg-white p-6 md:p-8">
                <div className="mb-5 flex items-center justify-between">
                    <div className="eyebrow">
                        Шаг {step + 1} из {STEPS.length}
                    </div>
                    <div className="text-[13px] text-ink-500">
                        {progress}%
                    </div>
                </div>
                <div className="mb-6 flex gap-1">
                    {STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                                i < step
                                    ? "bg-ink-950"
                                    : i === step
                                        ? "bg-accent"
                                        : "bg-ink-150"
                            }`}
                        />
                    ))}
                </div>

                <h2 className="font-display text-h1 text-ink-950">
                    {current.title}
                </h2>
                <p className="mt-2 text-ink-500">{current.hint}</p>

                <div
                    className={`mt-6 grid gap-3 ${
                        current.options.length > 3
                            ? "sm:grid-cols-2"
                            : "sm:grid-cols-3"
                    }`}
                >
                    {current.options.map((opt) => {
                        const active = isActive(
                            answers[current.key],
                            opt.value,
                        );
                        return (
                            <button
                                type="button"
                                key={opt.value}
                                onClick={() => setAnswer(opt.value)}
                                className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
                                    active
                                        ? "border-ink-950 bg-ink-950 text-white shadow-lift"
                                        : "border-ink-150 bg-white text-ink-900 hover:border-ink-400"
                                }`}
                            >
                                {opt.icon ? (
                                    <span className="text-2xl">{opt.icon}</span>
                                ) : (
                                    <div
                                        className={`mt-0.5 grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border-2 ${
                                            active
                                                ? "border-accent bg-accent text-white"
                                                : "border-ink-200"
                                        }`}
                                    >
                                        {active ? (
                                            <CheckIcon className="h-3 w-3" />
                                        ) : null}
                                    </div>
                                )}
                                <div>
                                    <div className="font-semibold">
                                        {opt.label}
                                    </div>
                                    {opt.hint ? (
                                        <div
                                            className={`mt-0.5 text-[12px] ${
                                                active
                                                    ? "text-white/70"
                                                    : "text-ink-500"
                                            }`}
                                        >
                                            {opt.hint}
                                        </div>
                                    ) : null}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={goBack}
                        disabled={step === 0}
                        className="btn btn-ghost disabled:opacity-40"
                    >
                        ← Назад
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        disabled={!canNext()}
                        className="btn btn-primary btn-lg disabled:opacity-40"
                    >
                        {step === STEPS.length - 1
                            ? "Показать подборку"
                            : "Дальше"}
                        <ArrowRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <aside className="hidden lg:block">
                <div className="sticky top-20 space-y-3">
                    <div className="rounded-3xl border border-ink-150 bg-ink-950 p-6 text-white">
                        <div className="eyebrow text-accent-onDark">
                            Пока подходит
                        </div>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-display text-5xl font-extrabold">
                                {currentPreview}
                            </span>
                            <span className="text-[15px] text-white/60">
                                {projectsWord(currentPreview)}
                            </span>
                        </div>
                        <p className="mt-3 text-[13px] text-white/70">
                            Число обновляется на каждом шаге. К концу
                            останется 3-5 самых точных.
                        </p>
                        <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-[13px]">
                            <TrustDark text="Реальные проекты из каталога" />
                            <TrustDark text="Не «звоните — уточним»" />
                            <TrustDark text="PDF со сметой в мессенджер" />
                        </div>
                    </div>
                    <QuizAnswersSummary answers={answers} step={step} />
                </div>
            </aside>
        </div>
    );
}

function TrustDark({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-2 text-white/85">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
            <span>{text}</span>
        </div>
    );
}

function QuizAnswersSummary({
    answers,
    step,
}: {
    answers: Answers;
    step: number;
}) {
    const filled = STEPS.slice(0, step + 1).filter(
        (s) => answers[s.key] !== undefined,
    );
    if (filled.length === 0) return null;
    return (
        <div className="rounded-3xl border border-ink-150 bg-white p-5">
            <div className="eyebrow">Ваши ответы</div>
            <ul className="mt-3 space-y-2 text-[13px]">
                {filled.map((s) => {
                    const val = answers[s.key];
                    const label = Array.isArray(val)
                        ? val.map((v) => labelOf(s.key, v)).join(", ")
                        : labelOf(s.key, val as string);
                    return (
                        <li
                            key={s.key}
                            className="flex items-start justify-between gap-3 border-b border-ink-150 pb-2 last:border-b-0"
                        >
                            <span className="text-ink-500">
                                {stepTitleShort(s.key)}
                            </span>
                            <span className="text-right font-semibold text-ink-950">
                                {label}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function stepTitleShort(key: StepKey): string {
    switch (key) {
        case "purpose":
            return "Назначение";
        case "area":
            return "Площадь";
        case "budget":
            return "Бюджет";
        case "floors":
            return "Этажи";
        case "bedrooms":
            return "Спальни";
        case "material":
            return "Материал";
    }
}

function isActive(
    value: string | string[] | undefined,
    option: string,
): boolean {
    if (Array.isArray(value)) return value.includes(option);
    return value === option;
}

function filterByAnswers(
    projects: MergedProject[],
    a: Answers,
): MergedProject[] {
    const material = (a.material as string | undefined) ?? "any";
    const floors = (a.floors as string[] | undefined) ?? [];
    const bedrooms = a.bedrooms ? parseInt(a.bedrooms as string) : 0;
    const area = a.area as string | undefined;
    const budget = a.budget as string | undefined;

    return projects
        .filter((p) => {
            if (
                material !== "any" &&
                !p.technologies.includes(material as Technology)
            )
                return false;
            if (
                floors.length > 0 &&
                p.floors &&
                !floors.includes(p.floors)
            )
                return false;
            if (bedrooms > 0 && (p.bedrooms ?? 0) < bedrooms) return false;
            if (area && p.area && !matchAreaBucket(area, p.area)) return false;
            if (budget && !matchBudgetBucket(budget, p.priceFrom)) return false;
            return true;
        })
        .sort((a, b) => b.builtCount - a.builtCount);
}

function ResultsView({
    matches,
    priceRange,
    answers,
    onReset,
    onBack,
}: {
    matches: MergedProject[];
    priceRange: { min: number; max: number } | null;
    answers: Answers;
    onReset: () => void;
    onBack: () => void;
}) {
    return (
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <div className="eyebrow">Готово</div>
                    <button
                        type="button"
                        onClick={onReset}
                        className="btn btn-ghost text-sm"
                    >
                        Начать заново ↺
                    </button>
                </div>
                <h2 className="font-display text-display-2">
                    Нашли {matches.length} {projectsWord(matches.length)}
                </h2>
                {priceRange ? (
                    <div className="mt-4 flex items-baseline gap-3 rounded-2xl border border-ink-150 bg-white p-5">
                        <TargetIcon className="h-6 w-6 text-accent" />
                        <div>
                            <div className="eyebrow">Вилка «под ключ»</div>
                            <div className="mt-1 font-display text-2xl font-extrabold text-ink-950">
                                {formatMillions(priceRange.min)} —{" "}
                                {formatMillions(priceRange.max)}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 rounded-2xl border border-accent/30 bg-accent-soft/40 p-5 text-[14px] text-ink-700">
                        По этим параметрам ничего не нашли — попробуйте
                        ослабить требования, или оставьте заявку — подберём
                        вручную.
                    </div>
                )}

                <div className="mt-6 space-y-4">
                    {matches.map((p) => (
                        <QuizResultCard key={p.slug} project={p} />
                    ))}
                </div>

                <button
                    type="button"
                    onClick={onBack}
                    className="btn btn-ghost mt-6 text-sm"
                >
                    ← Изменить ответы
                </button>
            </div>
            <aside>
                <div className="sticky top-20 space-y-3">
                    <div className="rounded-3xl border border-ink-150 bg-ink-950 p-6 text-white shadow-lift">
                        <div className="eyebrow text-accent-onDark">
                            Отправить подборку
                        </div>
                        <h3 className="mt-1 font-display text-h2 text-white">
                            Пришлём PDF со сметой и планировками
                        </h3>
                        <p className="mt-2 text-[13px] text-white/70">
                            В мессенджер за 15 минут. Без спам-рассылок.
                        </p>
                        <div className="mt-5">
                            <LeadForm
                                source="quiz"
                                prefill={buildQuizPrefill(answers)}
                                variant="dark"
                                ctaLabel="Получить подборку"
                            />
                        </div>
                    </div>
                    <div className="rounded-2xl border border-ink-150 bg-white p-5 text-[13px] text-ink-700">
                        <div className="font-semibold text-ink-950">
                            Что дальше?
                        </div>
                        <ul className="mt-3 space-y-2">
                            <li className="flex items-start gap-2">
                                <ShieldIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                                Обсудим детали — планировка, участок, бюджет
                            </li>
                            <li className="flex items-start gap-2">
                                <HouseIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                                Приедете посмотреть построенный дом
                            </li>
                            <li className="flex items-start gap-2">
                                <LightningIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                                Зафиксируем цену в договоре
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
        </div>
    );
}

function QuizResultCard({ project }: { project: MergedProject }) {
    return (
        <Link
            href={`/projects/${project.slug}`}
            className="card card-hover flex gap-4 overflow-hidden"
        >
            <div className="relative aspect-square w-40 flex-shrink-0 overflow-hidden bg-ink-100">
                {project.heroImage ? (
                    <Image
                        src={project.heroImage}
                        alt=""
                        fill
                        sizes="160px"
                        className="object-cover"
                    />
                ) : null}
                {project.isFeatured ? (
                    <span className="badge badge-hit absolute left-2 top-2">
                        Хит
                    </span>
                ) : null}
            </div>
            <div className="flex flex-1 flex-col py-3 pr-4">
                <div className="font-display text-lg font-extrabold text-ink-950">
                    {project.displayName}
                </div>
                <div className="mt-0.5 text-[12px] text-ink-500">
                    {project.subtitle}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                    <span className="chip !text-[11px]">
                        {formatArea(project.area || 150)}
                    </span>
                    <span className="chip !text-[11px]">
                        {formatFloorsShort(project.floors || "1")}
                    </span>
                    {project.bedrooms ? (
                        <span className="chip !text-[11px]">
                            {project.bedrooms} сп
                        </span>
                    ) : null}
                    {project.technologies.length > 0 ? (
                        <span className="chip !text-[11px]">
                            {project.technologies
                                .map(formatTechnologyBrand)
                                .join(" / ")}
                        </span>
                    ) : null}
                </div>
                <div className="mt-auto flex items-baseline justify-between gap-3 pt-3">
                    <div>
                        <div className="text-[11px] uppercase tracking-wider text-ink-500">
                            Под ключ от
                        </div>
                        <div className="font-display text-xl font-extrabold text-ink-950">
                            {formatPrice(project.priceFrom)}
                        </div>
                    </div>
                    <span className="text-[13px] font-semibold text-accent">
                        Смотреть →
                    </span>
                </div>
            </div>
        </Link>
    );
}

function buildQuizPrefill(a: Answers): string {
    const parts = [
        "Квиз-подбор",
        a.purpose ? `цель: ${labelOf("purpose", a.purpose as string)}` : null,
        a.area ? `площадь: ${labelOf("area", a.area as string)}` : null,
        a.budget ? `бюджет: ${labelOf("budget", a.budget as string)}` : null,
        Array.isArray(a.floors) ? `этажи: ${a.floors.join("/")}` : null,
        a.bedrooms ? `спален от: ${a.bedrooms}` : null,
        a.material && a.material !== "any"
            ? `материал: ${labelOf("material", a.material as string)}`
            : null,
    ].filter(Boolean);
    return parts.join(" · ");
}

function labelOf(key: StepKey, value: string): string {
    const step = STEPS.find((s) => s.key === key);
    if (!step) return value;
    return step.options.find((o) => o.value === value)?.label ?? value;
}

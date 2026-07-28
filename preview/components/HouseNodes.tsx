"use client";

import { useMemo, useState, type ComponentType } from "react";
import { PlaceholderMedia } from "./PlaceholderMedia";
import {
    LayersIcon,
    HouseIcon,
    ShieldIcon,
    RulerIcon,
    LightningIcon,
    ClockIcon,
} from "./Icons";

type NodeKey =
    | "foundation"
    | "walls"
    | "roof"
    | "windows"
    | "engineering"
    | "process";

type PkgKey = "base" | "standard" | "comfort";

interface HouseNode {
    key: NodeKey;
    tab: string;
    title: (wall: string) => string;
    Icon: ComponentType<{ className?: string }>;
    topics: string[];
    shot: { w: number; h: number; label: string };
}

interface EngRow {
    system: string;
    points: number;
    note: string;
}

const NODES: HouseNode[] = [
    {
        key: "foundation",
        tab: "Фундамент",
        title: () => "Фундамент",
        Icon: LayersIcon,
        topics: [
            "Инженерно-геологические изыскания участка",
            "Конструкторский расчёт основания",
            "Вынос осей и пятна застройки, акт кадастрового инженера",
            "Выемка грунта и обратная засыпка",
            "Тип основания, марка бетона, класс прочности",
            "Схема армирования и шаг стержней",
            "Гидроизоляция и утепление подошвы",
        ],
        shot: { w: 1200, h: 900, label: "Разрез фундамента, схема армирования" },
    },
    {
        key: "walls",
        tab: "Стены",
        title: (wall) => `Стены: ${wall.toLowerCase()}`,
        Icon: HouseIcon,
        topics: [
            "Материал и толщина несущих стен",
            "Кладочный или крепёжный узел",
            "Перемычки и армопояс",
            "Утепление и паробарьер",
            "Внутренние перегородки",
            "Подготовка под чистовую отделку",
        ],
        shot: { w: 1200, h: 900, label: "Узел стены в разрезе" },
    },
    {
        key: "roof",
        tab: "Крыша",
        title: () => "Кровля",
        Icon: ShieldIcon,
        topics: [
            "Стропильная система: сечение и шаг",
            "Утепление и толщина слоя",
            "Пароизоляция и гидроветрозащита",
            "Контробрешётка и вентзазор",
            "Кровельное покрытие",
            "Водосточная система и снегозадержание",
        ],
        shot: { w: 1200, h: 900, label: "Кровельный пирог, слои" },
    },
    {
        key: "windows",
        tab: "Окна",
        title: () => "Окна и двери",
        Icon: RulerIcon,
        topics: [
            "Профиль и число камер стеклопакета",
            "Энергосберегающее стекло",
            "Конфигурация открывания створок",
            "Отливы, откосы, подоконники",
            "Входная группа",
        ],
        shot: { w: 1200, h: 900, label: "Узел примыкания окна к стене" },
    },
    {
        key: "engineering",
        tab: "Инженерные коммуникации",
        title: () => "Инженерные коммуникации",
        Icon: LightningIcon,
        topics: [],
        shot: { w: 1200, h: 900, label: "Котельная, узел разводки" },
    },
    {
        key: "process",
        tab: "Ход работ и оплата",
        title: () => "Ход работ и оплата",
        Icon: ClockIcon,
        topics: [],
        shot: { w: 1200, h: 900, label: "График этапов и платежей" },
    },
];

const PKG_TABS: { key: PkgKey; label: string }[] = [
    { key: "base", label: "Базовая" },
    { key: "standard", label: "Стандарт" },
    { key: "comfort", label: "Комфорт" },
];

/** Числа-заглушки: растут с комплектацией. На проде — из техрегламента. */
const ENG_BY_PKG: Record<PkgKey, EngRow[]> = {
    base: [
        { system: "Электрика", points: 55, note: "щит 36 механизмов, УЗО" },
        { system: "Отопление", points: 12, note: "котёл 2-контурный Buderus" },
        { system: "Водоснабжение", points: 12, note: "ХВС / ГВС раздельно" },
        { system: "Канализация", points: 7, note: "внутренняя + септик Топас" },
        {
            system: "Вентиляция",
            points: 6,
            note: "естественная + принудительная в с/у",
        },
    ],
    standard: [
        {
            system: "Электрика",
            points: 72,
            note: "щит 48 механизмов · тёплые полы в с/у · кабель-каналы",
        },
        {
            system: "Отопление",
            points: 16,
            note: "Buderus + радиаторы по комнатам · контуры тёплого пола",
        },
        {
            system: "Водоснабжение",
            points: 16,
            note: "ХВС / ГВС · коллекторная разводка · фильтр грубой очистки",
        },
        {
            system: "Канализация",
            points: 8,
            note: "внутренняя + септик Топас · точка под стиральную",
        },
        {
            system: "Вентиляция",
            points: 8,
            note: "принудительная в с/у и кухне · притоки в жилых",
        },
    ],
    comfort: [
        {
            system: "Электрика",
            points: 95,
            note: "щит 60+ · диммеры · подготовка под умный дом",
        },
        {
            system: "Отопление",
            points: 20,
            note: "погода-зависимая автоматика · тёплые полы в жилых зонах",
        },
        {
            system: "Водоснабжение",
            points: 18,
            note: "коллекторы · магистральный фильтр · редуктор давления",
        },
        {
            system: "Канализация",
            points: 9,
            note: "Топас + жироуловитель · точки под посудомойку и стиральную",
        },
        {
            system: "Вентиляция",
            points: 10,
            note: "приточно-вытяжная с рекуперацией · вытяжки на кухне и с/у",
        },
    ],
};

const STAGES = [
    { name: "Проект и согласование", from: 1, to: 3 },
    { name: "Производство домокомплекта", from: 3, to: 5 },
    { name: "Фундамент", from: 5, to: 8 },
    { name: "Стены и перекрытия", from: 8, to: 14 },
    { name: "Кровля", from: 12, to: 17 },
    { name: "Окна и двери", from: 15, to: 19 },
    { name: "Фасад и водосток", from: 17, to: 22 },
    { name: "Черновая инженерка", from: 20, to: 26 },
    { name: "Финиш и сдача", from: 24, to: 32 },
];

export function HouseNodes({
    wallMaterial,
    buildTime = "6–8 мес",
}: {
    wallMaterial: string;
    buildTime?: string;
}) {
    const [active, setActive] = useState<NodeKey>("foundation");
    const [pkg, setPkg] = useState<PkgKey>("base");
    const node = NODES.find((n) => n.key === active) ?? NODES[0];

    const engRows = ENG_BY_PKG[pkg];
    const pkgLabel = PKG_TABS.find((t) => t.key === pkg)?.label ?? "Базовая";
    const totalPoints = useMemo(
        () => engRows.reduce((s, r) => s + r.points, 0),
        [engRows],
    );
    const maxWeek = STAGES[STAGES.length - 1].to;

    return (
        <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {NODES.map((n) => {
                    const isActive = n.key === active;
                    return (
                        <button
                            key={n.key}
                            type="button"
                            onClick={() => setActive(n.key)}
                            aria-pressed={isActive}
                            className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center transition-colors ${
                                isActive
                                    ? "border-accent bg-accent text-accent-ink"
                                    : "border-ink-150 bg-white text-ink-700 hover:border-ink-900 hover:text-ink-950"
                            }`}
                        >
                            <n.Icon className="h-7 w-7" />
                            <span className="text-[12px] font-semibold uppercase leading-tight tracking-wider">
                                {n.tab}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div
                id={
                    active === "engineering"
                        ? "inzhenerka"
                        : active === "process"
                          ? "etapy"
                          : undefined
                }
                className="mt-4 scroll-mt-28 rounded-2xl border border-ink-150 bg-white p-5 md:p-8"
            >
                {active === "engineering" ? (
                    <EngineeringPanel
                        pkg={pkg}
                        setPkg={setPkg}
                        pkgLabel={pkgLabel}
                        rows={engRows}
                        totalPoints={totalPoints}
                    />
                ) : active === "process" ? (
                    <TimelinePanel buildTime={buildTime} maxWeek={maxWeek} />
                ) : (
                    <>
                        <h3 className="font-display text-h2 text-ink-950">
                            {node.title(wallMaterial)}
                        </h3>

                        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-10">
                            <PlaceholderMedia
                                width={node.shot.w}
                                height={node.shot.h}
                                label={node.shot.label}
                                className="aspect-[4/3]"
                            />

                            <div>
                                <ul className="space-y-3">
                                    {node.topics.map((t) => (
                                        <li
                                            key={t}
                                            className="flex gap-3 text-[15px] text-ink-700"
                                        >
                                            <span
                                                aria-hidden
                                                className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                                            />
                                            <span>{t}</span>
                                        </li>
                                    ))}
                                </ul>

                                <p className="mt-6 rounded-xl border border-dashed border-line-strong bg-ink-50 p-3 text-[13px] leading-relaxed text-ink-500">
                                    Перечислены рубрики состава работ.
                                    Конкретику — марки материалов, сечения,
                                    допуски и ссылки на нормативы — подставим из
                                    вашего техрегламента.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function EngineeringPanel({
    pkg,
    setPkg,
    pkgLabel,
    rows,
    totalPoints,
}: {
    pkg: PkgKey;
    setPkg: (k: PkgKey) => void;
    pkgLabel: string;
    rows: EngRow[];
    totalPoints: number;
}) {
    return (
        <div>
            <div className="mb-4">
                <div className="eyebrow">Инженерка</div>
                <h3 className="mt-1 font-display text-h2 text-ink-950">
                    Число точек · {pkgLabel}
                </h3>
                <p className="mt-1 max-w-2xl text-[13px] text-ink-500">
                    Не «инженерка от N ₽/м²», а сколько розеток и радиаторов
                    входит в выбранную комплектацию. Цифры-заглушки —
                    подставим из техрегламента.
                </p>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-1.5">
                {PKG_TABS.map((t) => {
                    const on = t.key === pkg;
                    return (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setPkg(t.key)}
                            className={`chip chip-btn ${on ? "chip-active" : ""}`}
                        >
                            {t.label}
                        </button>
                    );
                })}
                <span className="ml-auto self-center text-[12px] tabular-nums text-ink-500">
                    итого {totalPoints} точек
                </span>
            </div>

            <div className="divide-y divide-ink-150">
                {rows.map((row) => (
                    <div
                        key={row.system}
                        className="grid grid-cols-[auto_60px_1fr] items-center gap-3 py-3"
                    >
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-ink-950 text-white">
                            <LightningIcon className="h-4 w-4" />
                        </div>
                        <div className="text-right">
                            <div className="font-display text-lg font-extrabold tabular-nums text-ink-950">
                                {row.points}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-ink-500">
                                точек
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold text-ink-950">
                                {row.system}
                            </div>
                            <div className="text-[12px] text-ink-500">
                                {row.note}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TimelinePanel({
    buildTime,
    maxWeek,
}: {
    buildTime: string;
    maxWeek: number;
}) {
    return (
        <div>
            <div className="mb-5">
                <div className="eyebrow">Этапы стройки</div>
                <h3 className="mt-1 font-display text-h2 text-ink-950">
                    Таймлайн по неделям
                </h3>
                <p className="mt-1 max-w-2xl text-[13px] text-ink-500">
                    Общий срок — {buildTime}. По каждому этапу получаете
                    фотоотчёт и акт сдачи-приёмки.
                </p>
            </div>
            <div className="space-y-2.5">
                {STAGES.map((s) => {
                    const left = (s.from / maxWeek) * 100;
                    const width = ((s.to - s.from) / maxWeek) * 100;
                    return (
                        <div
                            key={s.name}
                            className="grid grid-cols-[1.4fr_2fr] items-center gap-3"
                        >
                            <div className="text-[13px]">
                                <div className="font-semibold text-ink-950">
                                    {s.name}
                                </div>
                                <div className="text-[11px] text-ink-500">
                                    нед. {s.from}–{s.to}
                                </div>
                            </div>
                            <div className="relative h-4 rounded-full bg-ink-100">
                                <div
                                    className="absolute inset-y-0 rounded-full bg-ink-950"
                                    style={{
                                        left: `${left}%`,
                                        width: `${width}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-ink-150 pt-3 text-[12px]">
                <span className="text-ink-500">
                    Онлайн-камера на стройплощадке
                </span>
                <span className="rounded-md bg-accent-soft px-2 py-0.5 font-semibold text-accent">
                    включена в договор
                </span>
            </div>
        </div>
    );
}

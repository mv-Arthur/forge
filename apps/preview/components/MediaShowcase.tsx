"use client";

import {
    useCallback,
    useEffect,
    useState,
    type ComponentType,
} from "react";
import { PlaceholderMedia } from "./PlaceholderMedia";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CloseIcon,
    ExpandIcon,
    HouseIcon,
    LayersIcon,
    LightningIcon,
    TargetIcon,
} from "./Icons";

type SectionKey = "houses" | "interiors" | "engineering" | "tour";

/** Раскладка как у APS: крупный 2×2 + два справа + три внизу = 3×3 квадрат. */
type TileRole = "hero" | "side" | "cell";

interface Shot {
    w: number;
    h: number;
    label: string;
    role: TileRole;
}

interface Section {
    key: SectionKey;
    title: string;
    note: string;
    Icon: ComponentType<{ className?: string }>;
    shots: Shot[];
}

const ROLE_CYCLE: TileRole[] = [
    "hero",
    "side",
    "side",
    "cell",
    "cell",
    "cell",
];

const ROLE_SIZE: Record<TileRole, { w: number; h: number }> = {
    hero: { w: 1600, h: 1600 },
    side: { w: 800, h: 800 },
    cell: { w: 800, h: 800 },
};

const shots = (labels: string[]): Shot[] =>
    labels.map((label, i) => {
        const role = ROLE_CYCLE[i % ROLE_CYCLE.length];
        const { w, h } = ROLE_SIZE[role];
        return { w, h, label, role };
    });

function tileClass(role: TileRole): string {
    if (role === "hero") {
        return "col-span-2 aspect-[16/10] sm:row-span-2 sm:aspect-auto";
    }
    return "col-span-1 aspect-square sm:aspect-auto";
}

const SECTIONS: Section[] = [
    {
        key: "houses",
        title: "Галерея домов",
        note: "Фасады и ракурсы дома.",
        Icon: HouseIcon,
        shots: shots([
            "Фасад, главный ракурс",
            "Фасад с угла",
            "Входная группа",
            "Терраса",
            "Дом в вечернем свете",
            "Участок и подъезд",
        ]),
    },
    {
        key: "interiors",
        title: "Интерьеры",
        note: "Готовые комнаты после чистовой отделки.",
        Icon: LayersIcon,
        shots: shots([
            "Гостиная со вторым светом",
            "Кухня-столовая",
            "Лестница",
            "Спальня",
            "Санузел",
            "Прихожая",
        ]),
    },
    {
        key: "engineering",
        title: "Инженерка и отделка",
        note: "Узлы, которые обычно прячут: котельная, щит, разводка.",
        Icon: LightningIcon,
        shots: shots([
            "Котельная целиком",
            "Коллекторный шкаф",
            "Электрощит",
            "Разводка тёплого пола",
            "Стояки и гребёнка",
            "Вентиляция",
        ]),
    },
    {
        key: "tour",
        title: "3D-тур",
        note: "Панорама с переходами по комнатам.",
        Icon: TargetIcon,
        shots: [],
    },
];

export function MediaShowcase() {
    const [active, setActive] = useState<SectionKey>("houses");
    const [lightbox, setLightbox] = useState<number | null>(null);

    const section = SECTIONS.find((s) => s.key === active) ?? SECTIONS[0];
    const total = section.shots.length;

    const next = useCallback(
        () => setLightbox((i) => (i === null ? i : (i + 1) % total)),
        [total],
    );
    const prev = useCallback(
        () => setLightbox((i) => (i === null ? i : (i - 1 + total) % total)),
        [total],
    );

    useEffect(() => {
        if (lightbox === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightbox(null);
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [lightbox, next, prev]);

    const shot = lightbox === null ? null : section.shots[lightbox];

    return (
        <div className="grid gap-4 lg:grid-cols-[240px_1fr] lg:items-start">
            <div className="flex gap-2 overflow-x-auto scroll-hide lg:flex-col lg:overflow-visible">
                {SECTIONS.map((s) => {
                    const isActive = s.key === active;
                    return (
                        <button
                            key={s.key}
                            type="button"
                            onClick={() => {
                                setActive(s.key);
                                setLightbox(null);
                            }}
                            aria-pressed={isActive}
                            className={`flex flex-shrink-0 items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-colors lg:flex-shrink ${
                                isActive
                                    ? "border-accent bg-accent text-accent-ink"
                                    : "border-ink-150 bg-white text-ink-700 hover:border-ink-900 hover:text-ink-950"
                            }`}
                        >
                            <s.Icon className="h-6 w-6 flex-shrink-0" />
                            <span>
                                <span className="block text-[14px] font-semibold uppercase leading-tight tracking-wider">
                                    {s.title}
                                </span>
                                <span
                                    className={`mt-1 hidden text-[12px] leading-snug lg:block ${
                                        isActive
                                            ? "text-accent-ink/80"
                                            : "text-ink-500"
                                    }`}
                                >
                                    {s.key === "tour"
                                        ? "Панорама по комнатам"
                                        : `${s.shots.length} кадров`}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="min-w-0">
                <p className="mb-3 text-[14px] text-ink-500">{section.note}</p>

                {section.key === "tour" ? (
                    <div className="grid aspect-square max-w-xl place-items-center rounded-2xl border border-dashed border-line-strong bg-ink-100 p-6 text-center sm:aspect-[16/9] sm:max-w-none">
                        <div>
                            <TargetIcon className="mx-auto h-10 w-10 text-ink-400" />
                            <div className="mt-3 font-display text-h3 text-ink-950">
                                3D-тур после съёмки
                            </div>
                            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-ink-500">
                                Панорама сданного дома с переходами по комнатам.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-[920px] sm:aspect-square">
                        <div className="grid grid-cols-2 gap-1 sm:h-full sm:grid-cols-3 sm:grid-rows-3 sm:gap-1.5">
                            {section.shots.map((s, i) => (
                                <button
                                    key={s.label}
                                    type="button"
                                    onClick={() => setLightbox(i)}
                                    className={`group relative min-h-0 min-w-0 cursor-zoom-in overflow-hidden rounded-md sm:rounded-lg ${tileClass(s.role)}`}
                                    aria-label={`Открыть: ${s.label}`}
                                >
                                    <PlaceholderMedia
                                        width={s.w}
                                        height={s.h}
                                        label={s.label}
                                        className="absolute inset-0 h-full w-full !rounded-md !border-ink-200 sm:!rounded-lg transition group-hover:!border-ink-900"
                                    />
                                    <span className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink-900 opacity-0 shadow transition group-hover:opacity-100">
                                        <ExpandIcon className="h-4 w-4" />
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {shot ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        type="button"
                        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightbox(null);
                        }}
                        aria-label="Закрыть"
                    >
                        <CloseIcon className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            prev();
                        }}
                        className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        aria-label="Предыдущий кадр"
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            next();
                        }}
                        className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                        aria-label="Следующий кадр"
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </button>
                    <div
                        className="w-full max-w-3xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <PlaceholderMedia
                            width={shot.w}
                            height={shot.h}
                            label={shot.label}
                            dark
                            className="aspect-square w-full"
                        />
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-white/10 px-3 py-1 text-sm text-white backdrop-blur">
                        {lightbox! + 1} / {total} · {shot.label}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

"use client";

import { useState } from "react";
import { Gallery } from "./Gallery";
import type { EnrichedBuiltObject } from "@/lib/types";
import { photosWord } from "@/lib/format";

interface Stage {
    key: keyof EnrichedBuiltObject["photosByStage"];
    label: string;
    hint: string;
}

const STAGES: Stage[] = [
    {
        key: "foundation",
        label: "Фундамент",
        hint: "котлован, армирование, заливка, гидроизоляция",
    },
    {
        key: "walls",
        label: "Стены",
        hint: "коробка, перекрытия, армопояс, проёмы",
    },
    {
        key: "roof",
        label: "Кровля",
        hint: "стропила, покрытие, водосток, софиты",
    },
    {
        key: "facade",
        label: "Фасад",
        hint: "утепление, окна, двери, отделка снаружи",
    },
    {
        key: "interior",
        label: "Интерьер",
        hint: "инженерка, санузлы, финиш, сдача",
    },
];

export function PhotoChronicle({ object }: { object: EnrichedBuiltObject }) {
    const available = STAGES.filter(
        (s) => object.photosByStage[s.key].length > 0,
    );
    const [active, setActive] = useState(available[0]?.key ?? "foundation");
    const photos = object.photosByStage[active];
    const meta = STAGES.find((s) => s.key === active);
    const total = object.gallery.length;

    if (total === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/40 p-8 text-center text-ink-500">
                Фотохроника пока не загружена
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-ink-150 bg-white p-4 md:p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <div className="eyebrow">Фотохроника</div>
                    <h2 className="mt-1 font-display text-h2">
                        Стройка по этапам
                    </h2>
                    <p className="mt-1 text-[13px] text-ink-500">
                        {total} {photosWord(total)} · переключайте этап — ниже
                        только кадры этого этапа
                    </p>
                </div>
                {object.status === "in-progress" ? (
                    <span className="badge badge-progress">
                        готовность {object.progress}%
                    </span>
                ) : (
                    <span className="badge badge-built">сдан</span>
                )}
            </div>

            <div
                className="scroll-hide mb-4 flex gap-1 overflow-x-auto border-b border-ink-150 pb-1"
                role="tablist"
                aria-label="Этапы стройки"
            >
                {STAGES.map((s) => {
                    const count = object.photosByStage[s.key].length;
                    const on = active === s.key;
                    const enabled = count > 0;
                    return (
                        <button
                            key={s.key}
                            type="button"
                            role="tab"
                            aria-selected={on}
                            disabled={!enabled}
                            onClick={() => setActive(s.key)}
                            className={`flex-shrink-0 rounded-t-lg px-3.5 py-2.5 text-left transition ${
                                on
                                    ? "bg-ink-950 text-white"
                                    : enabled
                                      ? "text-ink-700 hover:bg-ink-50 hover:text-ink-950"
                                      : "cursor-not-allowed text-ink-300"
                            }`}
                        >
                            <div className="text-[13px] font-semibold">
                                {s.label}
                            </div>
                            <div
                                className={`text-[11px] ${
                                    on ? "text-white/70" : "text-ink-500"
                                }`}
                            >
                                {enabled ? `${count} фото` : "—"}
                            </div>
                        </button>
                    );
                })}
            </div>

            {meta ? (
                <p className="mb-3 text-[13px] text-ink-500">
                    <span className="font-semibold text-ink-900">
                        {meta.label}:
                    </span>{" "}
                    {meta.hint}
                    {object.stageCaptions[active]
                        ? ` · ${object.stageCaptions[active]}`
                        : null}
                </p>
            ) : null}

            <Gallery
                images={photos}
                alt={`${object.displayTitle} · ${meta?.label ?? ""}`}
                aspectClass="aspect-[16/10]"
                priority
            />
        </div>
    );
}

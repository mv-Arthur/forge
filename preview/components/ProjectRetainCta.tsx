"use client";

import { useState } from "react";
import type { MergedProject } from "@/lib/types";
import {
    formatPrice,
    formatTechnologyBrand,
    timesWord,
} from "@/lib/format";
import { CheckIcon } from "./Icons";
import { LeadModal, type LeadIntent } from "./LeadModal";

interface Props {
    project: MergedProject;
}

/**
 * Перед «Похожими» — маркетинговый блок, чтобы удержать клиента на заявке.
 */
export function ProjectRetainCta({ project }: Props) {
    const [leadOpen, setLeadOpen] = useState(false);
    const [leadIntent, setLeadIntent] = useState<LeadIntent>("presentation");
    const prefill = `Проект ${project.displayName} (${project.code})`;
    const tech = formatTechnologyBrand(project.technologies[0]);

    function openLead(intent: LeadIntent) {
        setLeadIntent(intent);
        setLeadOpen(true);
    }

    return (
        <section className="overflow-hidden rounded-3xl border border-ink-150 bg-white">
            <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
                <div className="bg-ink-950 px-6 py-8 text-white md:px-10 md:py-10">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                        Перед тем как уйти
                    </div>
                    <h2 className="mt-3 font-display text-h1 text-white">
                        Не уходите без расчёта
                        <br className="hidden sm:block" /> по «
                        {project.displayName}»
                    </h2>
                    <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">
                        Пришлём PDF: полная смета, планировки и состав пакетов.
                        Или созвонимся за 15 минут — разберём участок,
                        комплектацию и ипотеку под ваш бюджет.
                    </p>
                    <ul className="mt-6 space-y-2.5 text-[14px] text-white/85">
                        <Trust
                            text={`Под ключ от ${formatPrice(project.priceFrom)} · ${tech}`}
                        />
                        {project.builtCount > 0 ? (
                            <Trust
                                text={`Уже построен ${project.builtCount} ${timesWord(project.builtCount)} — можно посмотреть вживую`}
                            />
                        ) : project.buildingCount > 0 ? (
                            <Trust text="Сейчас строится по этому проекту — можно приехать на площадку" />
                        ) : (
                            <Trust text="Планировку адаптируем бесплатно под ваш участок" />
                        )}
                        <Trust text="Гарантия по договору · фотоотчёты каждую неделю" />
                    </ul>
                    <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                        <button
                            type="button"
                            onClick={() => openLead("presentation")}
                            className="btn btn-primary btn-lg"
                        >
                            Получить презентацию
                        </button>
                        <button
                            type="button"
                            onClick={() => openLead("consultation")}
                            className="btn btn-lg border border-white/25 bg-white/10 text-white hover:bg-white/15"
                        >
                            Консультация
                        </button>
                    </div>
                </div>

                <div className="flex flex-col justify-center border-t border-ink-150 px-6 py-8 md:px-10 md:py-10 lg:border-l lg:border-t-0">
                    <div className="eyebrow text-accent">Что внутри PDF</div>
                    <h3 className="mt-2 font-display text-h2 text-ink-950">
                        Всё по проекту — в одном файле
                    </h3>
                    <ol className="mt-5 space-y-4">
                        {[
                            {
                                n: "01",
                                t: "Смета под ключ",
                                d: "Позиции работ и материалов без «от» в переписке.",
                            },
                            {
                                n: "02",
                                t: "Планировки этажей",
                                d: "Чистые планы и габариты — можно сразу показать семье.",
                            },
                            {
                                n: "03",
                                t: "Состав пакетов",
                                d: "Что входит в базовый, комфорт и премиум.",
                            },
                        ].map((item) => (
                            <li key={item.n} className="flex gap-4">
                                <span className="font-mono text-[13px] font-semibold text-accent">
                                    {item.n}
                                </span>
                                <div>
                                    <div className="font-semibold text-ink-950">
                                        {item.t}
                                    </div>
                                    <p className="mt-0.5 text-[13px] leading-relaxed text-ink-500">
                                        {item.d}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <LeadModal
                open={leadOpen}
                onClose={() => setLeadOpen(false)}
                intent={leadIntent}
                projectName={project.displayName}
                prefill={prefill}
                source="project-retain"
            />
        </section>
    );
}

function Trust({ text }: { text: string }) {
    return (
        <li className="flex items-start gap-2.5">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
            <span>{text}</span>
        </li>
    );
}

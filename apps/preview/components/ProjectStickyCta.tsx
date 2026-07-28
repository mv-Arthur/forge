"use client";

import { useMemo, useState } from "react";
import type { MergedProject, Technology } from "@/lib/types";
import {
    formatMonthlyShort,
    formatPrice,
    formatTechnologyBrand,
    timesWord,
} from "@/lib/format";
import { settings, telegramLink, whatsappLink } from "@/lib/settings";
import {
    ArrowRightIcon,
    CheckIcon,
    PhoneIcon,
    ShieldIcon,
    TelegramIcon,
    WhatsappIcon,
} from "./Icons";
import { LeadModal, type LeadIntent } from "./LeadModal";

function useVariantPrice(project: MergedProject) {
    const [tech, setTech] = useState<Technology>(
        project.variants[0]?.technology ?? "gas_concrete",
    );
    const variant = useMemo(
        () =>
            project.variants.find((v) => v.technology === tech) ??
            project.variants[0],
        [project.variants, tech],
    );
    const price = variant?.priceFrom ?? project.priceFrom;
    const prefill = `Проект ${project.displayName} (${project.code}) · ${formatTechnologyBrand(tech)}`;
    return { tech, setTech, price, prefill };
}

export function ProjectStickyAside({ project }: { project: MergedProject }) {
    const { tech, setTech, price, prefill } = useVariantPrice(project);
    const [leadOpen, setLeadOpen] = useState(false);
    const [leadIntent, setLeadIntent] = useState<LeadIntent>("presentation");

    function openLead(intent: LeadIntent) {
        setLeadIntent(intent);
        setLeadOpen(true);
    }

    return (
        <aside className="hidden min-w-0 lg:block">
            <div
                className="sticky z-20 space-y-4"
                style={{
                    top: "calc(var(--site-header-height, 72px) + 12px)",
                }}
            >
                <div className="rounded-2xl border border-ink-150 bg-white p-5 shadow-lift sm:p-6">
                    <div className="text-[11px] uppercase tracking-wider text-ink-500">
                        Под ключ от
                    </div>
                    <div className="mt-1 flex flex-wrap items-baseline gap-3">
                        <span className="font-display text-3xl font-extrabold tabular-nums text-ink-950 xl:text-4xl">
                            {formatPrice(price)}
                        </span>
                        {project.oldPrice ? (
                            <span className="text-[15px] price-strike">
                                {formatPrice(project.oldPrice)}
                            </span>
                        ) : null}
                    </div>
                    <div className="mt-1 text-[13px] text-ink-500">
                        Ипотека от {formatMonthlyShort(price)}
                    </div>

                    {project.variants.length > 1 ? (
                        <div className="mt-4">
                            <div className="mb-2 text-[11px] uppercase tracking-wider text-ink-500">
                                Материал
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {project.variants.map((v) => {
                                    const active = v.technology === tech;
                                    return (
                                        <button
                                            key={v.technology}
                                            type="button"
                                            onClick={() => setTech(v.technology)}
                                            className={`chip chip-btn !py-1 text-[12px] ${
                                                active ? "chip-active" : ""
                                            }`}
                                        >
                                            {formatTechnologyBrand(v.technology)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : null}

                    {project.priceValidAt ? (
                        <div className="mt-3 flex items-center gap-2 rounded-lg bg-accent-soft p-3 text-[12px]">
                            <ShieldIcon className="h-4 w-4 text-accent" />
                            <span>
                                <strong className="text-ink-950">
                                    {project.discountLabel}
                                </strong>
                                <br />
                                Цена действует до {project.priceValidAt}
                            </span>
                        </div>
                    ) : null}

                    <div className="mt-5 space-y-2">
                        <button
                            type="button"
                            onClick={() => openLead("presentation")}
                            className="btn btn-primary btn-lg w-full"
                        >
                            Получить презентацию
                        </button>
                        <button
                            type="button"
                            onClick={() => openLead("consultation")}
                            className="btn btn-light w-full"
                        >
                            Консультация
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                            <a
                                href={telegramLink(prefill)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-tg btn-sm"
                            >
                                <TelegramIcon className="h-4 w-4" /> Telegram
                            </a>
                            <a
                                href={whatsappLink(prefill)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-wa btn-sm"
                            >
                                <WhatsappIcon className="h-4 w-4" /> WhatsApp
                            </a>
                        </div>
                        <a
                            href={`tel:${settings.phoneClean}`}
                            className="btn btn-light w-full"
                        >
                            <PhoneIcon className="h-4 w-4" /> {settings.phone}
                        </a>
                    </div>

                    <div className="mt-5 space-y-2 border-t border-ink-150 pt-4 text-[13px]">
                        {project.builtCount > 0 ? (
                            <TrustRow
                                text={`Построен ${project.builtCount} ${timesWord(project.builtCount)}`}
                            />
                        ) : project.buildingCount > 0 ? (
                            <TrustRow text="Сейчас строится — можно приехать на объект" />
                        ) : null}
                        <TrustRow
                            text={`Гарантия ${project.warranty} лет по договору`}
                        />
                        <TrustRow text="Планировку меняем бесплатно" />
                        <TrustRow text="Фотоотчёты каждую неделю в Telegram" />
                        <TrustRow text="Онлайн-камера на стройплощадке" />
                    </div>
                </div>
            </div>

            <LeadModal
                open={leadOpen}
                onClose={() => setLeadOpen(false)}
                intent={leadIntent}
                projectName={project.displayName}
                prefill={prefill}
                source="project-aside"
            />
        </aside>
    );
}

export function ProjectMobileCta({ project }: { project: MergedProject }) {
    const { price, prefill } = useVariantPrice(project);
    const [leadOpen, setLeadOpen] = useState(false);

    return (
        <>
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-150 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-sticky backdrop-blur lg:hidden">
                <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                        <div className="text-[10px] uppercase tracking-wider text-ink-500">
                            Под ключ от
                        </div>
                        <div className="truncate font-display text-base font-extrabold tabular-nums text-ink-950">
                            {formatPrice(price)}
                        </div>
                        <div className="truncate text-[11px] text-ink-500">
                            {formatMonthlyShort(price)}
                        </div>
                    </div>
                    <a
                        href={telegramLink(prefill)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-tg btn-icon h-11 w-11 flex-shrink-0"
                        aria-label="Telegram"
                    >
                        <TelegramIcon className="h-4 w-4" />
                    </a>
                    <button
                        type="button"
                        onClick={() => setLeadOpen(true)}
                        className="btn btn-primary h-11 flex-shrink-0 px-4 text-[13px]"
                    >
                        Заявка
                        <ArrowRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <LeadModal
                open={leadOpen}
                onClose={() => setLeadOpen(false)}
                intent="presentation"
                projectName={project.displayName}
                prefill={prefill}
                source="project-mobile-bar"
            />
        </>
    );
}

function TrustRow({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-2 text-ink-700">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
            <span>{text}</span>
        </div>
    );
}

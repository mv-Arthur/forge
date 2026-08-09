"use client";

import { useState } from "react";
import type { MergedProject } from "@/lib/types";
import {
    bathroomsWord,
    bedroomsWord,
    formatArea,
    formatFloors,
    formatMonthlyShort,
    formatPrice,
} from "@/lib/format";
import { settings, telegramLink, whatsappLink } from "@/lib/settings";
import {
    BathIcon,
    BedIcon,
    HouseIcon,
    RulerIcon,
    StairsIcon,
    TelegramIcon,
    WhatsappIcon,
} from "./Icons";
import { LeadModal, type LeadIntent } from "./LeadModal";

interface Props {
    project: MergedProject;
}

/**
 * Сводка под hero: факты | цена+CTA (fixture-backed only).
 */
export function ProjectSummaryBar({ project }: Props) {
    const [leadOpen, setLeadOpen] = useState(false);
    const [leadIntent, setLeadIntent] = useState<LeadIntent>("presentation");

    function openLead(intent: LeadIntent) {
        setLeadIntent(intent);
        setLeadOpen(true);
    }

    const price = project.priceFrom != null && project.priceFrom > 0
        ? project.priceFrom
        : null;
    const prefill = `Проект ${project.displayName}`;

    const stats = [
        {
            key: "area",
            icon: <RulerIcon className="h-4 w-4" />,
            value: formatArea(project.area),
        },
        {
            key: "floors",
            icon: <StairsIcon className="h-4 w-4" />,
            value: formatFloors(project.floors),
        },
        {
            key: "beds",
            icon: <BedIcon className="h-4 w-4" />,
            value: project.bedrooms
                ? `${project.bedrooms} ${bedroomsWord(project.bedrooms)}`
                : "—",
        },
        {
            key: "baths",
            icon: <BathIcon className="h-4 w-4" />,
            value: project.bathrooms
                ? `${project.bathrooms} ${bathroomsWord(project.bathrooms)}`
                : "—",
        },
        {
            key: "size",
            icon: <HouseIcon className="h-4 w-4" />,
            value: project.dimensions
                ? project.dimensions.replace(/x/gi, "×") + " м"
                : "—",
        },
    ];

    return (
        <div className="rounded-2xl border border-ink-150 bg-white p-5 md:p-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:gap-10">
                <div className="min-w-0 space-y-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {project.subtitle ? (
                            <span className="badge badge-outline">
                                {project.subtitle}
                            </span>
                        ) : null}
                        {project.hasTerrace ? (
                            <span className="badge badge-outline">Терраса</span>
                        ) : null}
                    </div>

                    <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        {stats.map((s) => (
                            <li
                                key={s.key}
                                className="flex items-center gap-2 text-ink-950"
                            >
                                <span className="text-ink-400">{s.icon}</span>
                                <span className="font-display text-base font-extrabold tabular-nums">
                                    {s.value}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col justify-between gap-4 border-t border-ink-150 pt-5 lg:min-w-[280px] lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                    <div>
                        <div className="text-xs uppercase tracking-wider text-ink-500">
                            Под ключ от
                        </div>
                        <div className="mt-1 font-display text-price font-extrabold tabular-nums leading-none text-ink-950">
                            {formatPrice(price)}
                        </div>
                        {price != null ? (
                            <div className="mt-1.5 text-sm text-ink-500">
                                Ипотека от {formatMonthlyShort(price)}
                            </div>
                        ) : null}
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => openLead("presentation")}
                                className="btn btn-primary btn-sm flex-1"
                            >
                                Получить презентацию
                            </button>
                            <button
                                type="button"
                                onClick={() => openLead("consultation")}
                                className="btn btn-light btn-sm flex-1"
                            >
                                Консультация
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={telegramLink(prefill)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-tg btn-sm btn-icon h-9 w-9"
                                aria-label="Telegram"
                            >
                                <TelegramIcon className="h-4 w-4" />
                            </a>
                            <a
                                href={whatsappLink(prefill)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-wa btn-sm btn-icon h-9 w-9"
                                aria-label="WhatsApp"
                            >
                                <WhatsappIcon className="h-4 w-4" />
                            </a>
                            <a
                                href={`tel:${settings.phoneClean}`}
                                className="text-sm font-semibold text-ink-700 hover:text-ink-950"
                            >
                                {settings.phone}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <LeadModal
                open={leadOpen}
                onClose={() => setLeadOpen(false)}
                intent={leadIntent}
                projectName={project.displayName}
                prefill={prefill}
            />
        </div>
    );
}

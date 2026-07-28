"use client";

import { useEffect, useId } from "react";
import { LeadForm } from "./LeadForm";

export type LeadIntent = "presentation" | "consultation" | "visit";

interface LeadModalProps {
    open: boolean;
    onClose: () => void;
    intent?: LeadIntent;
    projectName?: string;
    prefill?: string;
    source?: string;
}

const COPY: Record<
    LeadIntent,
    {
        title: string;
        description: (name?: string) => string;
        cta: string;
        withDate?: boolean;
    }
> = {
    presentation: {
        title: "Пришлём PDF-презентацию",
        description: (name) =>
            name
                ? `Полная смета, планировки, состав пакетов по «${name}».`
                : "Полная смета, планировки, состав пакетов.",
        cta: "Получить PDF",
    },
    consultation: {
        title: "Консультация по проекту",
        description: (name) =>
            name
                ? `Перезвоним за 15 минут и разберём «${name}»: цена, комплектация, участок.`
                : "Перезвоним за 15 минут — цена, комплектация, участок.",
        cta: "Жду звонка",
    },
    visit: {
        title: "Запись на просмотр",
        description: (name) =>
            name
                ? `Слот ~1 час. Покажем «${name}» и ответим по срокам и смете.`
                : "Слот ~1 час. Покажем объект и ответим по срокам и смете.",
        cta: "Записаться",
        withDate: true,
    },
};

const DEFAULT_SOURCE: Record<LeadIntent, string> = {
    presentation: "project-pdf-modal",
    consultation: "project-consult-modal",
    visit: "object-visit-modal",
};

export function LeadModal({
    open,
    onClose,
    intent = "presentation",
    projectName,
    prefill,
    source,
}: LeadModalProps) {
    const titleId = useId();
    const copy = COPY[intent];
    const formSource = source ?? DEFAULT_SOURCE[intent];

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
        >
            <button
                type="button"
                className="absolute inset-0 bg-ink-950/50 backdrop-blur-[2px]"
                aria-label="Закрыть"
                onClick={onClose}
            />
            <div className="relative z-10 w-full max-w-md rounded-t-2xl border border-ink-150 bg-white p-6 shadow-lift sm:rounded-2xl md:p-8">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h2
                            id={titleId}
                            className="font-display text-2xl font-bold text-ink-950"
                        >
                            {copy.title}
                        </h2>
                        <p className="mt-1 text-sm text-ink-500">
                            {copy.description(projectName)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full border border-ink-150 text-ink-600 hover:border-ink-900 hover:text-ink-950"
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>
                <LeadForm
                    source={formSource}
                    prefill={prefill}
                    ctaLabel={copy.cta}
                    withDate={copy.withDate}
                />
            </div>
        </div>
    );
}

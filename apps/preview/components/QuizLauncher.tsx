"use client";

import { useEffect, useId, useState } from "react";
import type { MergedProject } from "@/lib/types";
import { Quiz } from "./Quiz";
import { CloseIcon } from "./Icons";

interface Props {
    projects: MergedProject[];
    /** Render the header CTA button. */
    buttonClassName?: string;
    buttonLabel?: string;
}

export function QuizLauncher({
    projects,
    buttonClassName = "btn btn-primary btn-lg",
    buttonLabel = "Подобрать за 2 минуты",
}: Props) {
    const [open, setOpen] = useState(false);
    const titleId = useId();

    // Deep-link: /projects#quiz or ?quiz=1
    useEffect(() => {
        if (typeof window === "undefined") return;
        const openFromUrl = () => {
            const hash = window.location.hash.replace(/^#/, "");
            const q = new URLSearchParams(window.location.search).get("quiz");
            if (hash === "quiz" || q === "1") setOpen(true);
        };
        openFromUrl();
        window.addEventListener("hashchange", openFromUrl);
        return () => window.removeEventListener("hashchange", openFromUrl);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open]);

    const close = () => {
        setOpen(false);
        if (typeof window !== "undefined" && window.location.hash === "#quiz") {
            history.replaceState(null, "", window.location.pathname + window.location.search);
        }
    };

    return (
        <>
            <button
                type="button"
                className={buttonClassName}
                onClick={() => setOpen(true)}
            >
                {buttonLabel}
            </button>

            {open ? (
                <div
                    className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4 md:p-6"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                >
                    <button
                        type="button"
                        className="absolute inset-0 bg-ink-950/55 backdrop-blur-[2px]"
                        aria-label="Закрыть"
                        onClick={close}
                    />
                    <div className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl border border-ink-150 bg-paper shadow-lift sm:rounded-2xl">
                        <div className="flex flex-shrink-0 items-start justify-between gap-4 border-b border-ink-150 bg-white px-5 py-4 md:px-6">
                            <div className="min-w-0">
                                <div className="eyebrow text-accent">
                                    Слишком много вариантов
                                </div>
                                <h2
                                    id={titleId}
                                    className="mt-1 font-display text-h2 text-ink-950 md:text-h1"
                                >
                                    Сузим до 3–5 проектов за 2 минуты
                                </h2>
                                <p className="mt-1 text-[13px] text-ink-500 md:text-[14px]">
                                    6 вопросов — подборка и вилка цены под
                                    бюджет.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={close}
                                className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border border-ink-150 text-ink-600 transition hover:border-ink-900 hover:text-ink-950"
                                aria-label="Закрыть"
                            >
                                <CloseIcon className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
                            {/* key resets wizard each open */}
                            <Quiz key={String(open)} projects={projects} />
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

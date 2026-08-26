"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { GwdLeadForm } from "./GwdLeadForm";

interface Props {
    open: boolean;
    onClose: () => void;
}

export function CallbackModal({ open, onClose }: Props) {
    const titleId = useId();

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

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!open || !mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[80]"
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
            <div className="pointer-events-none relative flex h-full items-center justify-center p-4">
            <div className="pointer-events-auto relative z-10 w-full max-w-md rounded-2xl border border-ink-150 bg-white p-6 shadow-lift">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h2
                            id={titleId}
                            className="font-display text-2xl font-bold text-ink-950"
                        >
                            Заказать звонок
                        </h2>
                        <p className="mt-1 text-sm text-ink-500">
                            Оставьте телефон — перезвоним в рабочие часы.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid h-9 w-9 place-items-center rounded-full border border-ink-150 text-ink-600 hover:border-ink-900 hover:text-ink-950"
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>
                <GwdLeadForm source="callback" />
            </div>
            </div>
        </div>,
        document.body,
    );
}

export function useCallbackModal() {
    const [open, setOpen] = useState(false);
    return {
        open,
        openModal: () => setOpen(true),
        closeModal: () => setOpen(false),
    };
}

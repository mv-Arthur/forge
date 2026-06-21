"use client";

import type { ReactNode } from "react";
import { useCallbackModal } from "@/lib/callback";

interface CallbackButtonProps {
    children: ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    "aria-label"?: string;
}

export function CallbackButton({
    children,
    className,
    title,
    subtitle,
    "aria-label": ariaLabel,
}: CallbackButtonProps) {
    const { openCallback } = useCallbackModal();
    return (
        <button
            type="button"
            className={className}
            aria-label={ariaLabel}
            onClick={() => openCallback({ title, subtitle })}
        >
            {children}
        </button>
    );
}

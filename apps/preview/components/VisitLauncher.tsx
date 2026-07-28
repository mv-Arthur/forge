"use client";

import { useState } from "react";
import { LeadModal } from "./LeadModal";

export function VisitLauncher({
    buttonClassName = "btn btn-primary btn-lg",
    buttonLabel = "Записаться на просмотр",
}: {
    buttonClassName?: string;
    buttonLabel?: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={buttonClassName}
            >
                {buttonLabel}
            </button>
            <LeadModal
                open={open}
                onClose={() => setOpen(false)}
                intent="visit"
                projectName="портфолио"
                prefill="Запись на просмотр объекта"
                source="works-catalog-visit"
            />
        </>
    );
}

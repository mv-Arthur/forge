"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ShowcaseHeatCalc } from "@/types/catalog";
import { HeatCalc } from "@/widgets/heat-calc/heat-calc";
import { ProjectDetailCalc } from "./project-detail-calc";

export function ProjectDetailCalcContainer({
    projectName,
    envelope,
}: {
    projectName: string;
    envelope: ShowcaseHeatCalc;
}) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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

    return (
        <div>
            <ProjectDetailCalc onCta={() => setOpen(true)} />
            {open && mounted
                ? createPortal(
                      <HeatCalc
                          layout="dialog"
                          projectName={projectName}
                          envelope={envelope}
                          onClose={() => setOpen(false)}
                      />,
                      document.body,
                  )
                : null}
        </div>
    );
}

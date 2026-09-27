"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { HeatEnvelope } from "@/lib/heat-calc";
import { HeatCalc } from "@/widgets/heat-calc/heat-calc";
import styles from "../technology-hub.module.css";

export function TechnologyHubCalc({
    heading,
    lead,
    cta,
    envelope,
    projectName,
}: {
    heading: string;
    lead: string;
    cta: string;
    envelope: HeatEnvelope;
    projectName: string;
}) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const syncHash = () => {
            if (window.location.hash === "#heat-calc") setOpen(true);
        };
        syncHash();
        window.addEventListener("hashchange", syncHash);
        return () => window.removeEventListener("hashchange", syncHash);
    }, []);

    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
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
        <section
            id="heat-calc"
            data-section="technology-calc"
            className={styles.block}
        >
            <button
                type="button"
                className={styles.calc}
                onClick={() => setOpen(true)}
            >
                <span>
                    <span className={styles.calcTitle}>{heading}</span>
                    <span className={styles.calcLead}>{lead}</span>
                </span>
                <span className={styles.calcBtn}>{cta}</span>
            </button>
            {open && mounted
                ? createPortal(
                      <HeatCalc
                          projectName={projectName}
                          envelope={envelope}
                          onClose={() => setOpen(false)}
                      />,
                      document.body,
                  )
                : null}
        </section>
    );
}

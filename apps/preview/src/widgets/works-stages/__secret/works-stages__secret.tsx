"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon, VideoIcon } from "@/ui/icons";
import { WORKS_STAGES_CLOSE, WORKS_STAGES_SECRETS } from "@/lib/copy";
import type { WorksStagesSecretProps } from "../works-stages.types";
import styles from "./secret.module.css";

export function WorksStagesSecret({ src }: WorksStagesSecretProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                type="button"
                className={styles.button}
                onClick={() => setOpen(true)}
            >
                <span>{WORKS_STAGES_SECRETS}</span>
                <VideoIcon />
            </button>
            {open ? (
                <SecretDialog src={src} onClose={() => setOpen(false)} />
            ) : null}
        </>
    );
}

function SecretDialog({ src, onClose }: { src: string; onClose: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [host, setHost] = useState<HTMLElement | null>(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        setHost(document.body);
    }, []);

    useEffect(() => {
        const el = dialog.current;
        if (!el || !host) return;
        if (!el.open) el.showModal();
        const onCancel = (e: Event) => {
            e.preventDefault();
            onCloseRef.current();
        };
        el.addEventListener("cancel", onCancel);
        return () => {
            el.removeEventListener("cancel", onCancel);
            if (el.open) el.close();
        };
    }, [host]);

    if (!host) return null;

    return createPortal(
        <dialog
            ref={dialog}
            className={styles.dialog}
            aria-label={WORKS_STAGES_SECRETS}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <button
                type="button"
                className={styles.close}
                aria-label={WORKS_STAGES_CLOSE}
                onClick={onClose}
            >
                <CloseIcon />
            </button>
            <div className={styles.frame}>
                <video
                    className={styles.player}
                    src={src}
                    controls
                    autoPlay
                    playsInline
                />
            </div>
        </dialog>,
        host,
    );
}

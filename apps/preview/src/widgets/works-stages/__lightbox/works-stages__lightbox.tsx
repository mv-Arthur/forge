"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/ui/icons";
import {
    WORKS_STAGES_CLOSE,
    WORKS_STAGES_NEXT,
    WORKS_STAGES_PREV,
} from "@/lib/copy";
import type { WorksStagesLightboxProps } from "../works-stages.types";
import styles from "./lightbox.module.css";

export function WorksStagesLightbox({
    photos,
    index,
    caption,
    onIndex,
    onClose,
}: WorksStagesLightboxProps) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [host, setHost] = useState<HTMLElement | null>(null);
    const n = photos.length;
    const safeIndex = n > 0 ? Math.min(index, n - 1) : 0;
    const src = photos[safeIndex] || "";

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

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "ArrowRight" && n > 1) {
                e.preventDefault();
                onIndex((index + 1) % n);
            }
            if (e.key === "ArrowLeft" && n > 1) {
                e.preventDefault();
                onIndex((index - 1 + n) % n);
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [index, n, onIndex]);

    if (!host) return null;

    return createPortal(
        <dialog
            ref={dialog}
            className={styles.dialog}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={styles.bar}>
                {n > 0 ? (
                    <span className={styles.count}>
                        {safeIndex + 1} / {n}
                    </span>
                ) : null}
                <button
                    type="button"
                    className={styles.close}
                    aria-label={WORKS_STAGES_CLOSE}
                    onClick={onClose}
                >
                    <CloseIcon />
                </button>
            </div>
            {n > 1 ? (
                <>
                    <button
                        type="button"
                        className={`${styles.arrow} ${styles.prev}`}
                        aria-label={WORKS_STAGES_PREV}
                        onClick={() => onIndex((index - 1 + n) % n)}
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        type="button"
                        className={`${styles.arrow} ${styles.next}`}
                        aria-label={WORKS_STAGES_NEXT}
                        onClick={() => onIndex((index + 1) % n)}
                    >
                        <ChevronRightIcon />
                    </button>
                </>
            ) : null}
            {src ? (
                <div className={styles.photoWrap}>
                    <Image
                        src={src}
                        alt={caption}
                        fill
                        unoptimized
                        priority
                        className={styles.photo}
                        sizes="100vw"
                    />
                </div>
            ) : null}
            {caption ? <p className={styles.caption}>{caption}</p> : null}
        </dialog>,
        host,
    );
}

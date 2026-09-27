"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
    AreaIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CloseIcon,
    SizeIcon,
} from "@/ui/icons";
import { formatArea, formatTechnologyBrand } from "@/lib/format";
import { stillPhotos } from "../lib/photos";
import type { WorksCatalogLightboxProps } from "../works-catalog.types";
import styles from "./works-catalog__lightbox.module.css";

export function WorksCatalogLightbox({
    object,
    index,
    onIndex,
    onClose,
}: WorksCatalogLightboxProps) {
    const dialog = useRef<HTMLDialogElement>(null);
    const [host, setHost] = useState<HTMLElement | null>(null);
    const photos = stillPhotos(object);
    const n = photos.length;
    const safeIndex = n > 0 ? Math.min(index, n - 1) : 0;
    const src = photos[safeIndex] || photos[0] || "";
    const techLabel = object.technology
        ? formatTechnologyBrand(object.technology)
        : null;

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
            if (e.key === "ArrowRight") {
                e.preventDefault();
                if (n > 1) onIndex((index + 1) % n);
            }
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                if (n > 1) onIndex((index - 1 + n) % n);
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
            <div className={styles.layout}>
                <div className={styles.stage}>
                    <button
                        type="button"
                        className={styles.close}
                        aria-label="Закрыть"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </button>
                    {n > 1 ? (
                        <>
                            <button
                                type="button"
                                className={`${styles.arrow} ${styles.prev}`}
                                aria-label="Предыдущее фото"
                                onClick={() => onIndex((index - 1 + n) % n)}
                            >
                                <ChevronLeftIcon />
                            </button>
                            <button
                                type="button"
                                className={`${styles.arrow} ${styles.next}`}
                                aria-label="Следующее фото"
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
                                alt={object.displayTitle}
                                fill
                                unoptimized
                                priority
                                className={styles.photo}
                                sizes="100vw"
                            />
                        </div>
                    ) : null}
                </div>
                <aside className={styles.rail}>
                    <div className={styles.head}>
                        <h2 className={styles.title}>{object.displayTitle}</h2>
                        <div className={styles.attrs}>
                            {object.area != null ? (
                                <span className={styles.attr}>
                                    <AreaIcon className={styles.attrIcon} />
                                    {formatArea(object.area)}
                                </span>
                            ) : null}
                            {techLabel && techLabel !== "—" ? (
                                <span className={styles.attr}>
                                    <SizeIcon className={styles.attrIcon} />
                                    {techLabel}
                                </span>
                            ) : null}
                        </div>
                    </div>
                    {n > 1 ? (
                        <div className={styles.thumbs}>
                            {photos.map((photo, i) => (
                                <button
                                    key={photo}
                                    type="button"
                                    className={`${styles.thumb} ${
                                        i === safeIndex ? styles.thumbOn : ""
                                    }`}
                                    onClick={() => onIndex(i)}
                                    aria-label={`Фото ${i + 1}`}
                                    aria-current={i === index}
                                >
                                    <Image
                                        src={photo}
                                        alt=""
                                        fill
                                        unoptimized={photo.startsWith(
                                            "/media/",
                                        )}
                                        className={styles.thumbImg}
                                        sizes="120px"
                                    />
                                </button>
                            ))}
                        </div>
                    ) : null}
                </aside>
            </div>
        </dialog>,
        host,
    );
}

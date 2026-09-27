"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { ShowcaseDecorItem } from "@/types/catalog";
import {
    DETAIL_DECOR_CLOSE,
    DETAIL_DECOR_EXPAND,
    DETAIL_DECOR_FLOOR_1,
    DETAIL_DECOR_FLOOR_2,
    DETAIL_DECOR_HEADING,
    DETAIL_DECOR_NEXT,
    DETAIL_DECOR_PREV,
} from "@/lib/copy";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CloseIcon,
    MaximizeIcon,
} from "@/ui/icons";
import styles from "./project-detail__decor.module.css";

const FLOORS = [
    { id: "1" as const, label: DETAIL_DECOR_FLOOR_1 },
    { id: "2" as const, label: DETAIL_DECOR_FLOOR_2 },
];

function isSlider(items: ShowcaseDecorItem[]) {
    return items.some((item) => item.floor);
}

export function ProjectDetailDecor({ items }: { items: ShowcaseDecorItem[] }) {
    if (items.length === 0) return null;
    if (!isSlider(items)) {
        return (
            <div className={styles.grid}>
                {items.map((item) => (
                    <article key={item.id}>
                        <div className={styles.media}>
                            <Image
                                src={item.src}
                                alt=""
                                fill
                                unoptimized
                                className={styles.cardImg}
                                sizes="(min-width:1024px) 30vw, 100vw"
                            />
                        </div>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        {item.text ? (
                            <p className={styles.cardText}>{item.text}</p>
                        ) : null}
                    </article>
                ))}
            </div>
        );
    }
    return <DecorSlider items={items} />;
}

function DecorSlider({ items }: { items: ShowcaseDecorItem[] }) {
    const floors = FLOORS.filter((f) => items.some((i) => i.floor === f.id));
    const [floor, setFloor] = useState(floors[0]?.id ?? "1");
    const slides = useMemo(
        () => items.filter((i) => i.floor === floor),
        [items, floor],
    );
    const [index, setIndex] = useState(0);
    const [open, setOpen] = useState(false);
    const [cursor, setCursor] = useState<{
        x: number;
        y: number;
        dir: -1 | 1;
    } | null>(null);
    const drag = useRef<{ x: number; live: boolean } | null>(null);
    const n = slides.length;
    const current = slides[index] ?? slides[0];

    useEffect(() => {
        setIndex(0);
    }, [floor]);

    useEffect(() => {
        if (index >= n) setIndex(0);
    }, [index, n]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                setIndex((i) => (i - 1 + n) % n);
            }
            if (e.key === "ArrowRight") {
                setIndex((i) => (i + 1) % n);
            }
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [n]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    if (!current) return null;

    const go = (dir: -1 | 1) => {
        if (n < 2) return;
        setIndex((i) => (i + dir + n) % n);
    };

    const onHitMove = (dir: -1 | 1) => (e: React.MouseEvent) => {
        if (window.matchMedia("(pointer: coarse)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }
        setCursor({ x: e.clientX, y: e.clientY, dir });
    };

    const onHitLeave = () => setCursor(null);

    const onPointerDown = (e: React.PointerEvent) => {
        if (n < 2 || e.button !== 0) return;
        drag.current = { x: e.clientX, live: false };
    };

    const onPointerUp = (e: React.PointerEvent, dir: -1 | 1) => {
        const d = drag.current;
        drag.current = null;
        if (!d) return;
        const dx = e.clientX - d.x;
        if (Math.abs(dx) > 40) {
            go(dx < 0 ? 1 : -1);
            return;
        }
        go(dir);
    };

    const frame = (expanded: boolean) => (
        <div className={expanded ? styles.viewer : styles.root}>
            <Image
                src={current.src}
                alt={current.title}
                fill
                unoptimized={current.src.startsWith("/media/")}
                className={styles.photo}
                sizes="100vw"
                priority={index === 0 && !expanded}
            />
            <div className={styles.veil} />
            {n > 1 ? (
                <>
                    <button
                        type="button"
                        className={`${styles.hit} ${styles.prev}`}
                        aria-label={DETAIL_DECOR_PREV}
                        onMouseMove={onHitMove(-1)}
                        onMouseLeave={onHitLeave}
                        onPointerDown={onPointerDown}
                        onPointerUp={(e) => onPointerUp(e, -1)}
                    />
                    <button
                        type="button"
                        className={`${styles.hit} ${styles.next}`}
                        aria-label={DETAIL_DECOR_NEXT}
                        onMouseMove={onHitMove(1)}
                        onMouseLeave={onHitLeave}
                        onPointerDown={onPointerDown}
                        onPointerUp={(e) => onPointerUp(e, 1)}
                    />
                </>
            ) : null}
            <div className={styles.overlay}>
                <h2 className={styles.heading}>{DETAIL_DECOR_HEADING}</h2>
                <p className={styles.room}>{current.title}</p>
                {floors.length > 1 ? (
                    <div className={styles.floors} role="tablist">
                        {floors.map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                role="tab"
                                className={styles.floor}
                                aria-selected={f.id === floor}
                                onClick={() => setFloor(f.id)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>
            {n > 1 ? (
                <div className={styles.dots}>
                    {slides.map((slide, i) => (
                        <button
                            key={slide.id}
                            type="button"
                            className={styles.dot}
                            aria-label={slide.title}
                            aria-current={i === index}
                            onClick={() => setIndex(i)}
                        />
                    ))}
                </div>
            ) : null}
            {expanded ? (
                <button
                    type="button"
                    className={styles.close}
                    aria-label={DETAIL_DECOR_CLOSE}
                    onClick={() => setOpen(false)}
                >
                    <CloseIcon className={styles.toolIcon} />
                </button>
            ) : (
                <button
                    type="button"
                    className={styles.expand}
                    aria-label={DETAIL_DECOR_EXPAND}
                    onClick={() => setOpen(true)}
                >
                    <MaximizeIcon className={styles.toolIcon} />
                </button>
            )}
            {cursor ? (
                <div
                    className={styles.cursor}
                    style={{ left: cursor.x, top: cursor.y }}
                    aria-hidden
                >
                    {cursor.dir < 0 ? (
                        <ChevronLeftIcon />
                    ) : (
                        <ChevronRightIcon />
                    )}
                </div>
            ) : null}
        </div>
    );

    const dialog =
        open && typeof document !== "undefined"
            ? createPortal(
                  <div
                      className={styles.dialog}
                      role="dialog"
                      aria-modal="true"
                      aria-label={DETAIL_DECOR_HEADING}
                  >
                      {frame(true)}
                  </div>,
                  document.body,
              )
            : null;

    return (
        <>
            {frame(false)}
            {dialog}
        </>
    );
}

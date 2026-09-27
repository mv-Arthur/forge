"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { EnrichedBuiltObject } from "@/types/catalog";
import {
    DETAIL_BUILT_CLOSE,
    DETAIL_BUILT_HEADING,
    DETAIL_BUILT_NEXT,
    DETAIL_BUILT_PHOTOS,
    DETAIL_BUILT_PREV,
} from "@/lib/copy";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/ui/icons";
import styles from "./project-detail__built.module.css";

const TOP = 3;
const BOTTOM = 4;
const VISIBLE = TOP + BOTTOM;

function moreCount(total: number) {
    const rest = total - (VISIBLE - 1);
    if (rest < 2) return null;
    return rest >= 6 ? "10+" : `${rest}+`;
}

export function ProjectDetailBuilt({
    objects,
    photos,
}: {
    objects: EnrichedBuiltObject[];
    photos?: string[] | null;
}) {
    const object =
        objects.find((o) => o.status === "built" && o.gallery.length >= 7) ??
        objects[0];
    const curated = (photos ?? []).filter(Boolean);
    const fromObject = object?.gallery.filter(Boolean) ?? [];
    const gallery = curated.length >= VISIBLE ? curated : fromObject;
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const n = gallery.length;

    useEffect(() => {
        if (openIndex === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenIndex(null);
            if (n < 2) return;
            if (e.key === "ArrowLeft") {
                setOpenIndex((i) => (i === null ? i : (i - 1 + n) % n));
            }
            if (e.key === "ArrowRight") {
                setOpenIndex((i) => (i === null ? i : (i + 1) % n));
            }
        };
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [openIndex, n]);

    if (gallery.length === 0) return null;
    const shown =
        curated.length >= VISIBLE
            ? gallery.slice(0, VISIBLE)
            : gallery.length > VISIBLE
              ? gallery.slice(-VISIBLE)
              : gallery;
    const top = shown.slice(0, TOP);
    const bottom = shown.slice(TOP, VISIBLE);
    const more = gallery.length >= VISIBLE ? moreCount(gallery.length) : null;
    const alt = DETAIL_BUILT_HEADING;
    const current = openIndex !== null ? gallery[openIndex] : null;

    const viewer =
        current && openIndex !== null && typeof document !== "undefined"
            ? createPortal(
                  <div
                      className={styles.viewer}
                      role="dialog"
                      aria-modal="true"
                      aria-label={DETAIL_BUILT_HEADING}
                  >
                      <button
                          type="button"
                          className={styles.backdrop}
                          aria-label={DETAIL_BUILT_CLOSE}
                          onClick={() => setOpenIndex(null)}
                      />
                      <div className={styles.counter}>
                          {openIndex + 1} / {n}
                      </div>
                      <button
                          type="button"
                          className={styles.close}
                          aria-label={DETAIL_BUILT_CLOSE}
                          onClick={() => setOpenIndex(null)}
                      >
                          <CloseIcon className={styles.closeIcon} />
                      </button>
                      {n > 1 ? (
                          <>
                              <button
                                  type="button"
                                  className={`${styles.navBtn} ${styles.prev}`}
                                  aria-label={DETAIL_BUILT_PREV}
                                  onClick={() =>
                                      setOpenIndex((openIndex - 1 + n) % n)
                                  }
                              >
                                  <ChevronLeftIcon className={styles.navIcon} />
                              </button>
                              <button
                                  type="button"
                                  className={`${styles.navBtn} ${styles.next}`}
                                  aria-label={DETAIL_BUILT_NEXT}
                                  onClick={() =>
                                      setOpenIndex((openIndex + 1) % n)
                                  }
                              >
                                  <ChevronRightIcon
                                      className={styles.navIcon}
                                  />
                              </button>
                          </>
                      ) : null}
                      <div className={styles.stage}>
                          <Image
                              src={current}
                              alt={alt}
                              fill
                              unoptimized={current.startsWith("/media/")}
                              className={styles.viewerImg}
                              sizes="80vw"
                          />
                      </div>
                  </div>,
                  document.body,
              )
            : null;

    return (
        <div>
            <h2 className={styles.heading}>{DETAIL_BUILT_HEADING}</h2>
            <div className={styles.mosaic}>
                <div className={styles.top}>
                    {top.map((src, i) => (
                        <Tile
                            key={src + i}
                            src={src}
                            alt={alt}
                            priority={i === 0}
                            onOpen={() => setOpenIndex(i)}
                        />
                    ))}
                </div>
                {bottom.length > 0 ? (
                    <div className={styles.bottom}>
                        {bottom.map((src, i) => {
                            const index = TOP + i;
                            const last = i === bottom.length - 1 && more;
                            return (
                                <Tile
                                    key={src + i}
                                    src={src}
                                    alt={alt}
                                    overlay={last ? more : null}
                                    onOpen={() => setOpenIndex(index)}
                                />
                            );
                        })}
                    </div>
                ) : null}
            </div>
            {viewer}
        </div>
    );
}

function Tile({
    src,
    alt,
    overlay,
    priority = false,
    onOpen,
}: {
    src: string;
    alt: string;
    overlay?: string | null;
    priority?: boolean;
    onOpen: () => void;
}) {
    return (
        <button type="button" className={styles.tile} onClick={onOpen}>
            <Image
                src={src}
                alt={alt}
                fill
                unoptimized={src.startsWith("/media/")}
                className={styles.img}
                sizes="(min-width:992px) 30vw, 100vw"
                priority={priority}
            />
            {overlay ? (
                <span className={styles.badge}>
                    <span className={styles.overlayCount}>{overlay}</span>
                    <span className={styles.overlayWord}>
                        {DETAIL_BUILT_PHOTOS}
                    </span>
                </span>
            ) : null}
        </button>
    );
}

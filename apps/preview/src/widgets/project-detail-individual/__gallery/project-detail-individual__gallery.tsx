"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
    DETAIL_GALLERY_CLOSE,
    DETAIL_GALLERY_NEXT,
    DETAIL_GALLERY_PREV,
} from "@/lib/copy";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/ui/icons";
import styles from "./individual-gallery.module.css";

export function ProjectDetailIndividualGallery({
    images,
    name,
}: {
    images: string[];
    name: string;
}) {
    const [open, setOpen] = useState<number | null>(null);
    const dialog = useRef<HTMLDialogElement>(null);
    const [host, setHost] = useState<HTMLElement | null>(null);
    const n = images.length;
    const i = open == null ? 0 : Math.min(open, Math.max(n - 1, 0));
    const src = images[i] ?? "";

    useEffect(() => {
        setHost(document.body);
    }, []);

    useEffect(() => {
        const el = dialog.current;
        if (!el || open == null) return;
        if (!el.open) el.showModal();
        const onCancel = (e: Event) => {
            e.preventDefault();
            setOpen(null);
        };
        el.addEventListener("cancel", onCancel);
        return () => {
            el.removeEventListener("cancel", onCancel);
            if (el.open) el.close();
        };
    }, [open, host]);

    useEffect(() => {
        if (open == null || n < 2) return;
        function onKey(e: KeyboardEvent) {
            if (e.key === "ArrowRight") {
                e.preventDefault();
                setOpen((x) => (x == null ? 0 : (x + 1) % n));
            }
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                setOpen((x) => (x == null ? 0 : (x - 1 + n) % n));
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, n]);

    if (n === 0) return null;

    const lightbox =
        open != null && host
            ? createPortal(
                  <dialog
                      ref={dialog}
                      className={styles.dialog}
                      onClick={(e) => {
                          if (e.target === e.currentTarget) setOpen(null);
                      }}
                  >
                      <button
                          type="button"
                          className={styles.close}
                          aria-label={DETAIL_GALLERY_CLOSE}
                          onClick={() => setOpen(null)}
                      >
                          <CloseIcon />
                      </button>
                      {n > 1 ? (
                          <>
                              <button
                                  type="button"
                                  className={`${styles.arrow} ${styles.prev}`}
                                  aria-label={DETAIL_GALLERY_PREV}
                                  onClick={() => setOpen((i - 1 + n) % n)}
                              >
                                  <ChevronLeftIcon />
                              </button>
                              <button
                                  type="button"
                                  className={`${styles.arrow} ${styles.next}`}
                                  aria-label={DETAIL_GALLERY_NEXT}
                                  onClick={() => setOpen((i + 1) % n)}
                              >
                                  <ChevronRightIcon />
                              </button>
                          </>
                      ) : null}
                      <Image
                          src={src}
                          alt={`${name} - ${i + 1}`}
                          width={1600}
                          height={1000}
                          unoptimized={src.startsWith("/media/")}
                          className={styles.shot}
                          sizes="92vw"
                          onClick={(e) => e.stopPropagation()}
                      />
                  </dialog>,
                  host,
              )
            : null;

    return (
        <section data-section="detail-gallery" className={styles.root}>
            <div className={styles.grid}>
                {images.map((item, idx) => (
                    <button
                        key={item + idx}
                        type="button"
                        className={styles.item}
                        onClick={() => setOpen(idx)}
                    >
                        <Image
                            src={item}
                            alt={`${name} - ${idx + 1}`}
                            width={1200}
                            height={800}
                            unoptimized={item.startsWith("/media/")}
                            sizes="(min-width: 768px) 50vw, 100vw"
                        />
                    </button>
                ))}
            </div>
            {lightbox}
        </section>
    );
}

"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { GalleryItem } from "@/types/common";
import styles from "./GallerySection.module.css";

interface GallerySectionProps {
    items: GalleryItem[];
}

export function GallerySection({ items }: GallerySectionProps) {
    const [lightbox, setLightbox] = useState<number | null>(null);

    function closeLightbox() {
        setLightbox(null);
    }

    function goPrev() {
        setLightbox((i) => (i !== null && i > 0 ? i - 1 : i));
    }

    function goNext() {
        setLightbox((i) =>
            i !== null && i < items.length - 1 ? i + 1 : i
        );
    }

    return (
        <section className={styles.section}>
            <Container>
                <SectionHeading
                    label="Галерея"
                    title="Наши построенные объекты"
                />
                <div className={styles.grid}>
                    {items.map((item, index) => (
                        <button
                            key={item.id}
                            className={styles.card}
                            onClick={() => setLightbox(index)}
                        >
                            <div
                                className={styles.image}
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                }}
                            />
                            <div className={styles.overlay}>
                                <span className={styles.title}>
                                    {item.title}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </Container>

            {lightbox !== null && (
                <div className={styles.lightbox} onClick={closeLightbox}>
                    <div
                        className={styles.lightboxContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.lightboxClose}
                            onClick={closeLightbox}
                            aria-label="Закрыть"
                        >
                            &times;
                        </button>
                        <button
                            className={`${styles.lightboxArrow} ${styles.lightboxPrev}`}
                            onClick={goPrev}
                            disabled={lightbox === 0}
                            aria-label="Назад"
                        >
                            &#8592;
                        </button>
                        <div
                            className={styles.lightboxImage}
                            style={{
                                backgroundImage: `url(${items[lightbox].image})`,
                            }}
                        />
                        <button
                            className={`${styles.lightboxArrow} ${styles.lightboxNext}`}
                            onClick={goNext}
                            disabled={lightbox === items.length - 1}
                            aria-label="Вперёд"
                        >
                            &#8594;
                        </button>
                        <p className={styles.lightboxCaption}>
                            {items[lightbox].title}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}

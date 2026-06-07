"use client";

import { useCarouselScroll } from "./useCarouselScroll";
import styles from "./Carousel.module.css";

interface CarouselProps {
    children: React.ReactNode;
    renderHeader: (controls: React.ReactNode) => React.ReactNode;
    prevLabel: string;
    nextLabel: string;
    scrollStep?: number;
}

const DEFAULT_SCROLL_STEP = 420;

export function Carousel({
    children,
    renderHeader,
    prevLabel,
    nextLabel,
    scrollStep = DEFAULT_SCROLL_STEP,
}: CarouselProps) {
    const { trackRef, atStart, atEnd, scrollBy } =
        useCarouselScroll(scrollStep);

    const controls = (
        <>
            <button
                type="button"
                className={styles.navBtn}
                onClick={() => scrollBy(-1)}
                disabled={atStart}
                aria-label={prevLabel}
            >
                ←
            </button>
            <button
                type="button"
                className={styles.navBtn}
                onClick={() => scrollBy(1)}
                disabled={atEnd}
                aria-label={nextLabel}
            >
                →
            </button>
        </>
    );

    return (
        <>
            {renderHeader(controls)}
            <div className={styles.track} ref={trackRef}>
                <div className={styles.trackInner} data-carousel-inner>
                    {children}
                </div>
            </div>
        </>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { ReviewsSectionContent } from "@/lib/constants";
import type { Review } from "@/types/review";
import styles from "./ReviewsSection.module.css";

interface ReviewsSectionProps {
    title: ReviewsSectionContent["title"];
    showMoreLabel: ReviewsSectionContent["showMoreLabel"];
    prevLabel: ReviewsSectionContent["prevLabel"];
    nextLabel: ReviewsSectionContent["nextLabel"];
    reviews: Review[];
}

const SCROLL_STEP = 415;

export function ReviewsSection({
    title,
    showMoreLabel,
    prevLabel,
    nextLabel,
    reviews,
}: ReviewsSectionProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    useEffect(() => {
        const node = trackRef.current;
        if (!node) return;
        function update() {
            if (!node) return;
            setAtStart(node.scrollLeft <= 1);
            setAtEnd(
                node.scrollLeft + node.clientWidth >= node.scrollWidth - 1
            );
        }
        update();
        node.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            node.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    function scrollBy(direction: 1 | -1) {
        trackRef.current?.scrollBy({
            left: direction * SCROLL_STEP,
            behavior: "smooth",
        });
    }

    function toggleExpand(id: string) {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    return (
        <section className={styles.section}>
            <div className={styles.wrapper}>
                <div className={styles.title}>{title}</div>
                <div className={styles.content}>
                    <div className={styles.track} ref={trackRef}>
                        {reviews.map((review) => {
                            const isExpanded = expanded[review.id] ?? false;
                            const descriptionClassName = isExpanded
                                ? styles.description
                                : `${styles.description} ${styles.descriptionHide}`;
                            return (
                                <div key={review.id} className={styles.cell}>
                                    <article className={styles.card}>
                                        {review.videoUrl ? (
                                            <div className={styles.media}>
                                                <iframe
                                                    className={styles.iframe}
                                                    src={review.videoUrl}
                                                    title={`Отзыв ${review.author}`}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        ) : review.image ? (
                                            <img
                                                className={styles.image}
                                                src={review.image}
                                                alt={`Отзыв ${review.author}`}
                                                decoding="async"
                                            />
                                        ) : null}
                                        <div className={styles.heading}>
                                            <h4 className={styles.headingTitle}>
                                                {review.author}
                                            </h4>
                                            <time
                                                className={styles.headingTime}
                                            >
                                                {review.date}
                                            </time>
                                        </div>
                                        <div className={descriptionClassName}>
                                            <p>{review.text}</p>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.showmore}
                                            onClick={() =>
                                                toggleExpand(review.id)
                                            }
                                        >
                                            {showMoreLabel}
                                        </button>
                                    </article>
                                </div>
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        className={`${styles.nav} ${styles.navPrev}${atStart ? ` ${styles.navDisabled}` : ""}`}
                        onClick={() => scrollBy(-1)}
                        disabled={atStart}
                        aria-label={prevLabel}
                    />
                    <button
                        type="button"
                        className={`${styles.nav} ${styles.navNext}${atEnd ? ` ${styles.navDisabled}` : ""}`}
                        onClick={() => scrollBy(1)}
                        disabled={atEnd}
                        aria-label={nextLabel}
                    />
                </div>
            </div>
        </section>
    );
}

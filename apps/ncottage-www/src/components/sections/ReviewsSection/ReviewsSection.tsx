"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ReviewsSectionContent } from "@/content/home";
import styles from "./ReviewsSection.module.css";

interface ReviewsSectionProps {
    eyebrow: ReviewsSectionContent["eyebrow"];
    title: ReviewsSectionContent["title"];
    titleAccent?: ReviewsSectionContent["titleAccent"];
    lead?: ReviewsSectionContent["lead"];
    showMoreLabel: ReviewsSectionContent["showMoreLabel"];
    prevLabel: ReviewsSectionContent["prevLabel"];
    nextLabel: ReviewsSectionContent["nextLabel"];
    reviews: ReviewsSectionContent["reviews"];
}

const SCROLL_STEP = 420;

export function ReviewsSection({
    eyebrow,
    title,
    titleAccent,
    lead,
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
            <Container>
                <SectionHeading
                    eyebrow={eyebrow}
                    title={title}
                    titleAccent={titleAccent}
                    lead={lead}
                    align="left"
                    className={styles.head}
                    actions={
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
                    }
                />
            </Container>

            <div className={styles.track} ref={trackRef}>
                <div className={styles.trackInner}>
                    {reviews.map((review) => {
                        const isExpanded = expanded[review.id] ?? false;
                        return (
                            <article key={review.id} className={styles.card}>
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
                                    <div className={styles.media}>
                                        <img
                                            className={styles.image}
                                            src={review.image}
                                            alt={`Отзыв ${review.author}`}
                                            decoding="async"
                                            loading="lazy"
                                        />
                                    </div>
                                ) : null}
                                <div className={styles.cardBody}>
                                    <div className={styles.cardHead}>
                                        <h3 className={styles.author}>
                                            {review.author}
                                        </h3>
                                        <time className={styles.date}>
                                            {review.date}
                                        </time>
                                    </div>
                                    <p
                                        className={`${styles.text} ${isExpanded ? styles.textExpanded : ""}`}
                                    >
                                        {review.text}
                                    </p>
                                    <button
                                        type="button"
                                        className={styles.expand}
                                        onClick={() => toggleExpand(review.id)}
                                    >
                                        {isExpanded ? "Свернуть" : showMoreLabel}
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

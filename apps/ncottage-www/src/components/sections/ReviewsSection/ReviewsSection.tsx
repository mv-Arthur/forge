"use client";

import { useState } from "react";
import { Carousel } from "@/components/ui/Carousel";
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
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    function toggleExpand(id: string) {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    return (
        <section className={styles.section}>
            <Carousel
                prevLabel={prevLabel}
                nextLabel={nextLabel}
                renderHeader={(controls) => (
                    <Container>
                        <SectionHeading
                            eyebrow={eyebrow}
                            title={title}
                            titleAccent={titleAccent}
                            lead={lead}
                            align="left"
                            className={styles.head}
                            actions={controls}
                        />
                    </Container>
                )}
            >
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
            </Carousel>
        </section>
    );
}

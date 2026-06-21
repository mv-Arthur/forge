"use client";

import Image from "next/image";
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

function getYoutubeId(url: string): string | null {
    const match = url.match(
        /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/
    );
    return match ? match[1] : null;
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
    const [playing, setPlaying] = useState<Record<string, boolean>>({});

    function toggleExpand(id: string) {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    function playVideo(id: string) {
        setPlaying((prev) => ({ ...prev, [id]: true }));
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
                                    {playing[review.id] ? (
                                        <iframe
                                            className={styles.iframe}
                                            src={`${review.videoUrl}?autoplay=1`}
                                            title={`Отзыв ${review.author}`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <button
                                            type="button"
                                            className={styles.videoFacade}
                                            onClick={() => playVideo(review.id)}
                                            aria-label={`Смотреть видеоотзыв: ${review.author}`}
                                            style={
                                                getYoutubeId(review.videoUrl)
                                                    ? {
                                                          backgroundImage: `url(https://img.youtube.com/vi/${getYoutubeId(
                                                              review.videoUrl
                                                          )}/hqdefault.jpg)`,
                                                      }
                                                    : undefined
                                            }
                                        >
                                            <span
                                                className={styles.playIcon}
                                                aria-hidden="true"
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    width="28"
                                                    height="28"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M8 5v14l11-7z"
                                                    />
                                                </svg>
                                            </span>
                                        </button>
                                    )}
                                </div>
                            ) : review.image ? (
                                <div className={styles.media}>
                                    <Image
                                        className={styles.image}
                                        src={review.image}
                                        alt={`Отзыв ${review.author}`}
                                        fill
                                        sizes="(max-width: 640px) 80vw, 360px"
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

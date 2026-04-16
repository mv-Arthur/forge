"use client";

import { useState } from "react";
import type { Review } from "@/types/review";
import styles from "./ReviewsSection.module.css";

interface ReviewsSectionProps {
    reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
    const [current, setCurrent] = useState(0);
    const visible = 3;
    const maxIndex = Math.max(0, reviews.length - visible);

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Отзывы о нашей работе:</h2>
                <div className={styles.arrows}>
                    <button
                        className={styles.arrow}
                        onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                        disabled={current === 0}
                        aria-label="Назад"
                    >
                        &#8592;
                    </button>
                    <button
                        className={styles.arrow}
                        onClick={() =>
                            setCurrent((c) => Math.min(maxIndex, c + 1))
                        }
                        disabled={current >= maxIndex}
                        aria-label="Вперёд"
                    >
                        &#8594;
                    </button>
                </div>
            </div>
            <div className={styles.track}>
                <div
                    className={styles.slider}
                    style={{
                        transform: `translateX(-${current * (100 / visible)}%)`,
                    }}
                >
                    {reviews.map((review) => (
                        <div key={review.id} className={styles.card}>
                            <p className={styles.text}>{review.text}</p>
                            <div className={styles.author}>
                                <div className={styles.avatar}>
                                    {review.author[0]}
                                </div>
                                <div>
                                    <p className={styles.authorName}>
                                        {review.author}
                                    </p>
                                    <p className={styles.project}>
                                        {review.date}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { CallbackModal } from "@/components/shared/CallbackModal";
import type { CategoriesSectionContent } from "@/lib/constants";
import type { Category } from "@/types/common";
import styles from "./CategoriesSection.module.css";

interface CategoriesSectionProps {
    title: CategoriesSectionContent["title"];
    categories: Category[];
    cta: CategoriesSectionContent["cta"];
}

function ArrowIcon() {
    return (
        <svg
            width="19"
            height="14"
            viewBox="0 0 19 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.03 6.46997C18.1705 6.6106 18.2493 6.80122 18.2493 6.99997C18.2493 7.19872 18.1705 7.38934 18.03 7.52997L12.03 13.53C11.8887 13.6665 11.6994 13.742 11.5029 13.7403C11.3064 13.7386 11.1184 13.6598 10.9795 13.5208C10.8406 13.3819 10.7617 13.1939 10.76 12.9974C10.7583 12.8009 10.8338 12.6116 10.9703 12.4703L15.6903 7.74997H1.49997C1.30106 7.74997 1.11029 7.67095 0.969638 7.5303C0.828986 7.38965 0.749969 7.19888 0.749969 6.99997C0.749969 6.80106 0.828986 6.61029 0.969638 6.46964C1.11029 6.32899 1.30106 6.24997 1.49997 6.24997H15.6903L10.9703 1.52997C10.8338 1.38869 10.7583 1.19937 10.76 1.00287C10.7617 0.806368 10.8406 0.61838 10.9795 0.479457C11.1184 0.340535 11.3064 0.261643 11.5029 0.259959C11.6994 0.258274 11.8887 0.333932 12.03 0.47047L18.03 6.47047V6.46997Z"
                fill="white"
            />
        </svg>
    );
}

export function CategoriesSection({
    title,
    categories,
    cta,
}: CategoriesSectionProps) {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <section className={styles.section}>
            <Container>
                <h2 className={styles.title}>{title}</h2>
                <div className={styles.grid}>
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/projects?tech=${category.technology}`}
                            className={styles.card}
                        >
                            <img
                                src={category.image}
                                alt={category.title}
                                className={styles.cardImage}
                            />
                            <span className={styles.badge}>
                                {category.count}&nbsp;проектов
                            </span>
                            <div className={styles.cardBottom}>
                                <h3 className={styles.cardTitle}>
                                    {category.title}
                                </h3>
                            </div>
                            <div
                                className={styles.arrow}
                                aria-hidden="true"
                            >
                                <ArrowIcon />
                            </div>
                        </Link>
                    ))}
                    <div className={styles.ctaBlock}>
                        <h3 className={styles.ctaTitle}>{cta.title}</h3>
                        <p className={styles.ctaText}>{cta.text}</p>
                        <button
                            type="button"
                            className={styles.ctaBtn}
                            onClick={() => setModalOpen(true)}
                        >
                            {cta.ctaLabel}
                        </button>
                    </div>
                </div>
            </Container>
            <CallbackModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </section>
    );
}

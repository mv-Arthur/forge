"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FaqSectionContent } from "@/content/home";
import styles from "./FaqSection.module.css";

interface FaqSectionProps {
    eyebrow: FaqSectionContent["eyebrow"];
    title: FaqSectionContent["title"];
    titleAccent?: FaqSectionContent["titleAccent"];
    lead?: FaqSectionContent["lead"];
    items: FaqSectionContent["items"];
}

export function FaqSection({
    eyebrow,
    title,
    titleAccent,
    lead,
    items,
}: FaqSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className={styles.section}>
            <Container className={styles.container}>
                <SectionHeading
                    eyebrow={eyebrow}
                    title={title}
                    titleAccent={titleAccent}
                    lead={lead}
                    align="left"
                    className={styles.head}
                />

                <ul className={styles.list}>
                    {items.map((item, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <li
                                key={item.question}
                                className={`${styles.item} ${isOpen ? styles.itemOpen : ""}`}
                            >
                                <button
                                    type="button"
                                    className={styles.toggle}
                                    aria-expanded={isOpen}
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : idx)
                                    }
                                >
                                    <span className={styles.question}>
                                        {item.question}
                                    </span>
                                    <span
                                        className={styles.chevron}
                                        aria-hidden="true"
                                    />
                                </button>
                                <div className={styles.panel}>
                                    <p className={styles.answer}>
                                        {item.answer}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </Container>
        </section>
    );
}

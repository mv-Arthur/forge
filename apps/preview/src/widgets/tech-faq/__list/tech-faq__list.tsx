"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/ui/icons";
import { faqColumns } from "../lib/content";
import type { TechFaqItem } from "../tech-faq.types";
import styles from "./list.module.css";

function Column({
    items,
    openId,
    onToggle,
}: {
    items: TechFaqItem[];
    openId: string | null;
    onToggle: (id: string) => void;
}) {
    return (
        <div className={styles.col}>
            {items.map((item) => {
                const open = openId === item.id;
                const panelId = `tech-faq-${item.id}`;
                return (
                    <article
                        key={item.id}
                        className={`${styles.card} ${open ? styles.cardOpen : ""}`}
                    >
                        <h2 className={styles.heading}>
                            <button
                                type="button"
                                className={styles.head}
                                aria-expanded={open}
                                aria-controls={panelId}
                                onClick={() => onToggle(item.id)}
                            >
                                <span className={styles.question}>{item.question}</span>
                                <span className={styles.chevron} aria-hidden>
                                    <ChevronDownIcon className={styles.icon} />
                                </span>
                            </button>
                        </h2>
                        <div id={panelId} className={styles.body} hidden={!open}>
                            {item.answer.map((paragraph) => (
                                <p key={paragraph} className={styles.p}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

export function TechFaqList({ items }: { items: TechFaqItem[] }) {
    const [left, right] = faqColumns(items);
    const [openLeft, setOpenLeft] = useState<string | null>(null);
    const [openRight, setOpenRight] = useState<string | null>(null);

    return (
        <section data-section="tech-faq-list" className={styles.root}>
            <Column
                items={left}
                openId={openLeft}
                onToggle={(id) => setOpenLeft((cur) => (cur === id ? null : id))}
            />
            <Column
                items={right}
                openId={openRight}
                onToggle={(id) => setOpenRight((cur) => (cur === id ? null : id))}
            />
        </section>
    );
}

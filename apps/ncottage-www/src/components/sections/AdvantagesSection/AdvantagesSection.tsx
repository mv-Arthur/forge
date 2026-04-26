"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import type { AdvantagesSectionContent } from "@/lib/constants";
import styles from "./AdvantagesSection.module.css";

interface AdvantagesSectionProps {
    title: AdvantagesSectionContent["title"];
    text: AdvantagesSectionContent["text"];
    background: AdvantagesSectionContent["background"];
    items: AdvantagesSectionContent["items"];
}

export function AdvantagesSection({
    title,
    text,
    background,
    items,
}: AdvantagesSectionProps) {
    const gridRef = useRef<HTMLUListElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = gridRef.current;
        if (!node) return;
        if (typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                        break;
                    }
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            className={styles.section}
            style={{ backgroundImage: `url(${background})` }}
        >
            <Container className={styles.container}>
                <header className={styles.header}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.text}>{text}</p>
                </header>
                <ul
                    ref={gridRef}
                    className={`${styles.grid} ${visible ? styles.gridVisible : ""}`}
                >
                    {items.map((item, index) => (
                        <li
                            key={item.title}
                            className={styles.item}
                            style={{ "--i": index } as React.CSSProperties}
                        >
                            <div className={styles.iconWrap}>
                                <img
                                    src={item.icon}
                                    alt=""
                                    className={styles.icon}
                                />
                            </div>
                            <div className={styles.body}>
                                <h3 className={styles.itemTitle}>
                                    {item.title}
                                </h3>
                                <p className={styles.itemText}>{item.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}

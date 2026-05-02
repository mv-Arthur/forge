"use client";

import { useEffect, useRef, useState } from "react";

interface RevealOnScrollProps {
    as?: React.ElementType;
    className?: string;
    revealedClassName?: string;
    threshold?: number;
    style?: React.CSSProperties;
    children: React.ReactNode;
}

export function RevealOnScroll({
    as: Tag = "div",
    className,
    revealedClassName,
    threshold = 0.15,
    style,
    children,
}: RevealOnScrollProps) {
    const ref = useRef<HTMLElement | null>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        if (typeof IntersectionObserver === "undefined") {
            setRevealed(true);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setRevealed(true);
                        observer.disconnect();
                        break;
                    }
                }
            },
            { threshold }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold]);

    const composed = [className, revealed && revealedClassName]
        .filter(Boolean)
        .join(" ");

    return (
        <Tag ref={ref} className={composed} style={style}>
            {children}
        </Tag>
    );
}

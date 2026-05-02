"use client";

import { useEffect, useState } from "react";

interface ScrollToTopProps {
    className: string;
    visibleClassName: string;
    showAfter?: number;
    label: string;
    children: React.ReactNode;
}

export function ScrollToTop({
    className,
    visibleClassName,
    showAfter = 600,
    label,
    children,
}: ScrollToTopProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const update = () => setVisible(window.scrollY > showAfter);
        update();
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, [showAfter]);

    return (
        <button
            type="button"
            className={`${className} ${visible ? visibleClassName : ""}`}
            onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
            aria-label={label}
        >
            {children}
        </button>
    );
}

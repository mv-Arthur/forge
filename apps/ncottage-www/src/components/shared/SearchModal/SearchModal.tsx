"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import styles from "./SearchModal.module.css";

interface SearchModalProps {
    open: boolean;
    onClose: () => void;
    placeholder?: string;
}

export function SearchModal({
    open,
    onClose,
    placeholder = "Найти проект",
}: SearchModalProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!open) return;
        inputRef.current?.focus();
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className={styles.overlay}
            role="dialog"
            aria-label="Поиск"
            aria-modal="true"
        >
            <div className={styles.backdrop} onClick={onClose} />
            <Container className={styles.inner}>
                <input
                    ref={inputRef}
                    type="search"
                    className={styles.input}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    className={styles.closeBtn}
                    aria-label="Закрыть поиск"
                    onClick={onClose}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M6 6l12 12M18 6L6 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </Container>
        </div>
    );
}

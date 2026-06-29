"use client";

import { useState } from "react";
import { useLeadForm } from "@/lib/useLeadForm";
import styles from "./page.module.css";

interface PromoLeadFormProps {
    buttonLabel: string;
    messagePlaceholder: string;
    // Список технологий для select (страница списка акций).
    options?: string[];
    // Зафиксированная акция (страница акции).
    promoTitle?: string;
}

export function PromoLeadForm({
    buttonLabel,
    messagePlaceholder,
    options,
    promoTitle,
}: PromoLeadFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [technology, setTechnology] = useState("");
    const [message, setMessage] = useState("");
    const { submit, error, isSubmitting, isSuccess } = useLeadForm();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!phone.trim() || isSubmitting) return;
        const context = promoTitle ?? technology;
        const comment = [
            context ? `Акция/технология: ${context}` : "",
            message.trim(),
        ]
            .filter(Boolean)
            .join(". ");
        void submit({
            source: "callback",
            name: name.trim() || undefined,
            phone: phone.trim(),
            project: promoTitle || undefined,
            comment: comment || undefined,
            consent: true,
        });
    }

    if (isSuccess) {
        return (
            <div className={styles.form} role="status">
                <p>
                    Заявка отправлена — менеджер свяжется с вами в ближайшее
                    время.
                </p>
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <input
                name="name"
                type="text"
                aria-label="Имя"
                placeholder="Ваше имя"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <input
                name="phone"
                type="tel"
                aria-label="Телефон"
                placeholder="Телефон *"
                autoComplete="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
            />
            {options && (
                <select
                    name="technology"
                    aria-label="Интересующая технология"
                    value={technology}
                    onChange={(event) => setTechnology(event.target.value)}
                >
                    <option value="" disabled>
                        Интересующая технология
                    </option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            )}
            <textarea
                name="message"
                rows={4}
                aria-label="Сообщение"
                placeholder={messagePlaceholder}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
            />
            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Отправляем…" : buttonLabel}
            </button>
            <p>
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
            </p>
        </form>
    );
}

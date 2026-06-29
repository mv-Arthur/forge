"use client";

import { useState } from "react";
import { useLeadForm } from "@/lib/useLeadForm";
import styles from "./finance.module.css";

interface FinanceLeadFormProps {
    buttonLabel: string;
    // Название программы (Ипотека/Кредит/…) для контекста заявки.
    program: string;
}

export function FinanceLeadForm({ buttonLabel, program }: FinanceLeadFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const { submit, error, isSubmitting, isSuccess } = useLeadForm();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!phone.trim() || isSubmitting) return;
        const comment = [`Программа: ${program}`, message.trim()]
            .filter(Boolean)
            .join(". ");
        void submit({
            source: "callback",
            name: name.trim() || undefined,
            phone: phone.trim(),
            comment,
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
            <textarea
                name="message"
                rows={4}
                aria-label="Сообщение"
                placeholder="Коротко опишите проект, участок или вопрос"
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
                Нажимая на кнопку, вы соглашаетесь с обработкой персональных
                данных.
            </p>
        </form>
    );
}

"use client";

import { useState } from "react";
import { useLeadForm } from "@/lib/useLeadForm";
import styles from "./works.module.css";

export function WorksVisitForm({ submitLabel }: { submitLabel: string }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const { submit, error, isSubmitting, isSuccess } = useLeadForm();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!phone.trim() || isSubmitting) return;
        void submit({
            source: "works",
            name: name.trim() || undefined,
            phone: phone.trim(),
            comment: message.trim() || undefined,
            consent: true,
        });
    }

    if (isSuccess) {
        return (
            <div className={styles.visitSuccess} role="status">
                <h3 className={styles.visitSuccessTitle}>Заявка отправлена</h3>
                <p className={styles.visitSuccessText}>
                    Мы свяжемся с вами и предложим несколько объектов для
                    просмотра.
                </p>
            </div>
        );
    }

    return (
        <form className={styles.visitForm} onSubmit={handleSubmit} noValidate>
            <input
                className={styles.input}
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Ваше имя"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <input
                className={styles.input}
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="Телефон"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                required
            />
            <textarea
                className={styles.textarea}
                name="message"
                rows={3}
                placeholder="Какие объекты хотите посмотреть"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
            />
            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}
            <button
                className={styles.submit}
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Отправляем…" : submitLabel}
            </button>
            <p className={styles.privacy}>
                Нажимая кнопку, вы соглашаетесь с обработкой персональных
                данных.
            </p>
        </form>
    );
}

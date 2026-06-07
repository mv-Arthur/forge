"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import styles from "./CallbackModal.module.css";

interface CallbackModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
}

interface CallbackFormState {
    name: string;
    phone: string;
    preferredTime: string;
    comment: string;
    consent: boolean;
}

const INITIAL_FORM_STATE: CallbackFormState = {
    name: "",
    phone: "",
    preferredTime: "",
    comment: "",
    consent: false,
};

const MOCK_SUBMIT_DELAY_MS = 650;

export function CallbackModal({
    open,
    onClose,
    title = "Заказать звонок",
    subtitle = "Оставьте контакты — мы свяжемся и уточним детали.",
}: CallbackModalProps) {
    const [form, setForm] = useState<CallbackFormState>(INITIAL_FORM_STATE);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (submitTimerRef.current) clearTimeout(submitTimerRef.current);
        };
    }, []);

    useEffect(() => {
        if (open) return;
        if (submitTimerRef.current) {
            clearTimeout(submitTimerRef.current);
            submitTimerRef.current = null;
        }
        setSubmitted(false);
        setIsSubmitting(false);
        setForm(INITIAL_FORM_STATE);
    }, [open]);

    if (!open) return null;

    function clearSubmitTimer() {
        if (!submitTimerRef.current) return;
        clearTimeout(submitTimerRef.current);
        submitTimerRef.current = null;
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (
            isSubmitting ||
            !form.name.trim() ||
            !form.phone.trim() ||
            !form.preferredTime ||
            !form.consent
        ) {
            return;
        }

        const payload = {
            name: form.name.trim(),
            phone: form.phone.trim(),
            preferredTime: form.preferredTime,
            comment: form.comment.trim() || undefined,
            consent: form.consent,
        };

        setIsSubmitting(true);
        submitTimerRef.current = setTimeout(() => {
            console.info("Mock callback request:", payload);
            setIsSubmitting(false);
            setSubmitted(true);
            submitTimerRef.current = null;
        }, MOCK_SUBMIT_DELAY_MS);
    }

    function handleClose() {
        clearSubmitTimer();
        setSubmitted(false);
        setIsSubmitting(false);
        setForm(INITIAL_FORM_STATE);
        onClose();
    }

    return (
        <div className={styles.backdrop} onClick={handleClose}>
            <div
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="callback-title"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className={styles.close}
                    onClick={handleClose}
                    aria-label="Закрыть"
                >
                    &times;
                </button>

                {submitted ? (
                    <div className={styles.success}>
                        <p id="callback-title" className={styles.successTitle}>
                            Спасибо!
                        </p>
                        <p className={styles.successText}>
                            Мы получили заявку и перезвоним вам в ближайшее
                            время.
                        </p>
                        <button
                            type="button"
                            className={styles.submit}
                            onClick={handleClose}
                        >
                            Закрыть
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 id="callback-title" className={styles.title}>
                            {title}
                        </h3>
                        <p
                            id="callback-description"
                            className={styles.subtitle}
                        >
                            {subtitle}
                        </p>
                        <form
                            className={styles.form}
                            onSubmit={handleSubmit}
                            aria-describedby="callback-description"
                        >
                            <label className={styles.field}>
                                <span className={styles.fieldLabel}>Имя</span>
                                <input
                                    className={styles.input}
                                    type="text"
                                    name="name"
                                    autoComplete="name"
                                    placeholder="Ваше имя"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </label>
                            <label className={styles.field}>
                                <span className={styles.fieldLabel}>
                                    Телефон
                                </span>
                                <input
                                    className={styles.input}
                                    type="tel"
                                    name="phone"
                                    inputMode="tel"
                                    autoComplete="tel"
                                    placeholder="+7 999 000-00-00"
                                    value={form.phone}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            phone: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </label>
                            <label className={styles.field}>
                                <span className={styles.fieldLabel}>
                                    Удобное время
                                </span>
                                <select
                                    className={styles.input}
                                    name="preferredTime"
                                    value={form.preferredTime}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            preferredTime: e.target.value,
                                        }))
                                    }
                                    required
                                >
                                    <option value="">Выберите время</option>
                                    <option value="asap">
                                        Как можно скорее
                                    </option>
                                    <option value="today">Сегодня</option>
                                    <option value="tomorrow">Завтра</option>
                                    <option value="weekday-morning">
                                        Будний день 10:00–14:00
                                    </option>
                                    <option value="weekday-afternoon">
                                        Будний день 14:00–18:00
                                    </option>
                                    <option value="evening">
                                        Вечером 18:00–21:00
                                    </option>
                                </select>
                            </label>
                            <label className={styles.field}>
                                <span className={styles.fieldLabel}>
                                    Комментарий
                                </span>
                                <textarea
                                    className={`${styles.input} ${styles.textarea}`}
                                    name="comment"
                                    placeholder="Например, интересует проект дома 120 м²"
                                    value={form.comment}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            comment: e.target.value,
                                        }))
                                    }
                                />
                            </label>
                            <label className={styles.checkboxRow}>
                                <input
                                    className={styles.checkbox}
                                    type="checkbox"
                                    checked={form.consent}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            consent: e.target.checked,
                                        }))
                                    }
                                    required
                                />
                                <span>
                                    Согласен на обработку персональных данных
                                </span>
                            </label>
                            <button
                                type="submit"
                                className={styles.submit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Отправляем..." : "Отправить"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

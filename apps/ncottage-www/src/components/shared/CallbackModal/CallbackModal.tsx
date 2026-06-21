"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useLeadForm } from "@/lib/useLeadForm";
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

export function CallbackModal({
    open,
    onClose,
    title = "Заказать звонок",
    subtitle = "Оставьте контакты — мы свяжемся и уточним детали.",
}: CallbackModalProps) {
    const [form, setForm] = useState<CallbackFormState>(INITIAL_FORM_STATE);
    const { submit, error, isSubmitting, isSuccess, reset } = useLeadForm();
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClose = useCallback(() => {
        setForm(INITIAL_FORM_STATE);
        reset();
        onClose();
    }, [onClose, reset]);

    useEffect(() => {
        if (open) return;
        setForm(INITIAL_FORM_STATE);
        reset();
    }, [open, reset]);

    useEffect(() => {
        if (!open) return;
        const node = modalRef.current;
        if (!node) return;

        const getFocusable = () =>
            Array.from(
                node.querySelectorAll<HTMLElement>(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )
            ).filter((el) => !el.hasAttribute("disabled"));

        getFocusable()[0]?.focus();

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleClose();
                return;
            }
            if (event.key !== "Tab") return;
            const focusable = getFocusable();
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, handleClose]);

    if (!open) return null;

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

        void submit({
            source: "callback",
            name: form.name.trim(),
            phone: form.phone.trim(),
            preferredTime: form.preferredTime,
            comment: form.comment.trim() || undefined,
            consent: form.consent,
        });
    }

    return (
        <div className={styles.backdrop} onClick={handleClose}>
            <div
                ref={modalRef}
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

                {isSuccess ? (
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
                            {error && (
                                <p className={styles.error} role="alert">
                                    {error}
                                </p>
                            )}
                            <button
                                type="submit"
                                className={styles.submit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Отправляем…" : "Отправить"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

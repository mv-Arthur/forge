"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./CallbackModal.module.css";

interface CallbackModalProps {
    open: boolean;
    onClose: () => void;
}

export function CallbackModal({ open, onClose }: CallbackModalProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [submitted, setSubmitted] = useState(false);

    if (!open) return null;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) return;
        console.log("Callback request:", { name, phone });
        setSubmitted(true);
    }

    function handleClose() {
        setSubmitted(false);
        setName("");
        setPhone("");
        onClose();
    }

    return (
        <div className={styles.backdrop} onClick={handleClose}>
            <div
                className={styles.modal}
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
                        <p className={styles.successTitle}>Спасибо!</p>
                        <p className={styles.successText}>
                            Мы перезвоним вам в ближайшее время.
                        </p>
                        <Button onClick={handleClose}>Закрыть</Button>
                    </div>
                ) : (
                    <>
                        <h3 className={styles.title}>Заказать звонок</h3>
                        <p className={styles.subtitle}>
                            Оставьте номер и мы перезвоним в течение 30 минут.
                        </p>
                        <form
                            className={styles.form}
                            onSubmit={handleSubmit}
                        >
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Ваше имя"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <input
                                className={styles.input}
                                type="tel"
                                placeholder="Телефон"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                            <Button type="submit" size="lg">
                                Перезвоните мне
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

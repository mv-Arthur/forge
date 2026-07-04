"use client";

import Link from "next/link";
import { useState } from "react";
import { useLeadForm } from "@/lib/useLeadForm";
import styles from "./page.module.css";

export function GuaranteeClaimForm({ buttonLabel }: { buttonLabel: string }) {
    const [contract, setContract] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const { submit, error, isSubmitting, isSuccess } = useLeadForm();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!phone.trim() || isSubmitting) return;
        const comment = [
            contract.trim() ? `Договор: ${contract.trim()}` : "",
            message.trim(),
        ]
            .filter(Boolean)
            .join(". ");
        void submit({
            source: "callback",
            name: name.trim() || undefined,
            phone: phone.trim(),
            comment: comment || undefined,
            consent: true,
        });
    }

    if (isSuccess) {
        return (
            <div className={styles.form} role="status">
                <p>
                    Обращение принято — специалист по гарантии свяжется с вами в
                    ближайшее время.
                </p>
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label>
                <span>Номер договора</span>
                <input
                    name="contract"
                    placeholder="Например, НК-2026-001"
                    value={contract}
                    onChange={(event) => setContract(event.target.value)}
                />
            </label>
            <label>
                <span>Ваше имя</span>
                <input
                    name="name"
                    placeholder="Как к вам обращаться"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </label>
            <label>
                <span>Телефон</span>
                <input
                    name="phone"
                    placeholder="+7"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                />
            </label>
            <label>
                <span>Описание проблемы</span>
                <textarea
                    name="message"
                    placeholder="Что произошло и когда заметили проблему"
                    rows={5}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                />
            </label>
            {error && (
                <p className={styles.privacy} role="alert">
                    {error}
                </p>
            )}
            <button
                className={styles.cta}
                type="submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Отправляем…" : buttonLabel}
            </button>
            <p className={styles.privacy}>
                Нажимая кнопку, вы соглашаетесь с{" "}
                <Link href="/privacy">политикой конфиденциальности</Link>.
            </p>
        </form>
    );
}

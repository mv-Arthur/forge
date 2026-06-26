"use client";

import { useState } from "react";
import { EMAIL } from "@/content/contacts";
import { useLeadForm } from "@/lib/useLeadForm";
import styles from "./page.module.css";

export function ContactRequestForm({
    eyebrow,
    title,
    lead,
    button,
}: {
    eyebrow: string;
    title: string;
    lead: string;
    button: string;
}) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const { submit, error, isSubmitting, isSuccess } = useLeadForm();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!phone.trim() || isSubmitting) return;
        void submit({
            source: "contacts",
            name: name.trim() || undefined,
            phone: phone.trim(),
            comment: message.trim() || undefined,
        });
    }

    if (isSuccess) {
        return (
            <div className={styles.success} role="status">
                <p className={styles.successEyebrow}>Заявка принята</p>
                <h2 className={styles.successTitle}>Мы свяжемся с вами</h2>
                <p className={styles.successText}>
                    Специалист уточнит удобное время встречи в офисе или
                    экскурсии на производство.
                </p>
            </div>
        );
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formHeader}>
                <p className={styles.cardKicker}>{eyebrow}</p>
                <h2 className={styles.formTitle}>{title}</h2>
                <p className={styles.formLead}>{lead}</p>
            </div>

            <label className={styles.field}>
                <span className={styles.fieldLabel}>Имя</span>
                <input
                    className={styles.input}
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Как к вам обращаться"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
            </label>

            <label className={styles.field}>
                <span className={styles.fieldLabel}>Телефон</span>
                <input
                    className={styles.input}
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="+7 000 000-00-00"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                />
            </label>

            <label className={styles.field}>
                <span className={styles.fieldLabel}>Комментарий</span>
                <textarea
                    className={styles.textarea}
                    name="message"
                    rows={4}
                    placeholder="Например: хочу записаться на экскурсию"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                />
            </label>

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
                {isSubmitting ? "Отправляем…" : button}
            </button>

            <p className={styles.privacy}>
                Нажимая на кнопку, вы соглашаетесь на обработку персональных
                данных. Также можно написать напрямую на{" "}
                <a className={styles.inlineLink} href={`mailto:${EMAIL}`}>
                    {EMAIL}
                </a>
                .
            </p>
        </form>
    );
}

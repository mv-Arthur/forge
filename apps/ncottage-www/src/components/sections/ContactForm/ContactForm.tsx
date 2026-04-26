"use client";

import { useState } from "react";
import type { ContactFormContent } from "@/lib/constants";
import styles from "./ContactForm.module.css";

interface ContactFormProps {
    title: ContactFormContent["title"];
    subtitle: ContactFormContent["subtitle"];
    nameLabel: ContactFormContent["nameLabel"];
    namePlaceholder: ContactFormContent["namePlaceholder"];
    phoneLabel: ContactFormContent["phoneLabel"];
    phonePlaceholder: ContactFormContent["phonePlaceholder"];
    messageLabel: ContactFormContent["messageLabel"];
    messagePlaceholder: ContactFormContent["messagePlaceholder"];
    submitLabel: ContactFormContent["submitLabel"];
    privacy: ContactFormContent["privacy"];
    image: ContactFormContent["image"];
    successTitle: ContactFormContent["successTitle"];
    successText: ContactFormContent["successText"];
}

export function ContactForm({
    title,
    subtitle,
    nameLabel,
    namePlaceholder,
    phoneLabel,
    phonePlaceholder,
    messageLabel,
    messagePlaceholder,
    submitLabel,
    privacy,
    image,
    successTitle,
    successText,
}: ContactFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!phone.trim()) return;
        console.log("ContactForm submit:", { name, phone, message });
        setSubmitted(true);
    }

    return (
        <section className={styles.section}>
            <div className={styles.wrapper}>
                <div className={styles.photo}>
                    <img
                        className={styles.photoImg}
                        src={image.src}
                        alt={image.alt}
                        decoding="async"
                    />
                </div>
                <div className={styles.formWrapper}>
                    {submitted ? (
                        <div className={styles.success} role="status">
                            <p className={styles.successTitle}>
                                {successTitle}
                            </p>
                            <p className={styles.successText}>{successText}</p>
                        </div>
                    ) : (
                        <form
                            className={styles.form}
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <div className={styles.formTitle}>{title}</div>
                            <div className={styles.formSubtitle}>
                                {subtitle}
                            </div>
                            <div className={styles.formGrid}>
                                <div className={styles.rows}>
                                    <label className={styles.field}>
                                        <span className={styles.srOnly}>
                                            {nameLabel}
                                        </span>
                                        <input
                                            className={styles.input}
                                            type="text"
                                            name="name"
                                            autoComplete="name"
                                            placeholder={namePlaceholder}
                                            value={name}
                                            onChange={(event) =>
                                                setName(event.target.value)
                                            }
                                        />
                                    </label>
                                    <label className={styles.field}>
                                        <span className={styles.srOnly}>
                                            {phoneLabel}
                                        </span>
                                        <input
                                            className={styles.input}
                                            type="tel"
                                            name="phone"
                                            autoComplete="tel"
                                            placeholder={phonePlaceholder}
                                            value={phone}
                                            onChange={(event) =>
                                                setPhone(event.target.value)
                                            }
                                            required
                                        />
                                    </label>
                                </div>
                                <div className={styles.text}>
                                    <label className={styles.field}>
                                        <span className={styles.srOnly}>
                                            {messageLabel}
                                        </span>
                                        <textarea
                                            className={styles.textarea}
                                            name="message"
                                            rows={4}
                                            placeholder={messagePlaceholder}
                                            value={message}
                                            onChange={(event) =>
                                                setMessage(event.target.value)
                                            }
                                        />
                                    </label>
                                </div>
                                <p className={styles.privacy}>
                                    {privacy.text}{" "}
                                    <a
                                        className={styles.privacyLink}
                                        href={privacy.linkHref}
                                    >
                                        {privacy.linkLabel}
                                    </a>
                                </p>
                                <div className={styles.submitWrap}>
                                    <button
                                        type="submit"
                                        className={styles.submit}
                                    >
                                        {submitLabel}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}

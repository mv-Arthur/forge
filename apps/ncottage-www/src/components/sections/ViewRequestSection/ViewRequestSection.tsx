"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import type { ViewRequestSectionContent } from "@/lib/constants";
import styles from "./ViewRequestSection.module.css";

interface ViewRequestSectionProps {
    title: ViewRequestSectionContent["title"];
    nameLabel: ViewRequestSectionContent["nameLabel"];
    namePlaceholder: ViewRequestSectionContent["namePlaceholder"];
    phoneLabel: ViewRequestSectionContent["phoneLabel"];
    phonePlaceholder: ViewRequestSectionContent["phonePlaceholder"];
    submitLabel: ViewRequestSectionContent["submitLabel"];
    privacy: ViewRequestSectionContent["privacy"];
    successTitle: ViewRequestSectionContent["successTitle"];
    successText: ViewRequestSectionContent["successText"];
}

export function ViewRequestSection({
    title,
    nameLabel,
    namePlaceholder,
    phoneLabel,
    phonePlaceholder,
    submitLabel,
    privacy,
    successTitle,
    successText,
}: ViewRequestSectionProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!phone.trim()) return;
        console.log("ViewRequestSection submit:", { name, phone });
        setSubmitted(true);
    }

    return (
        <section className={styles.section}>
            <Container className={styles.wrapper}>
                <h2 className={styles.title}>{title}</h2>
                {submitted ? (
                    <div className={styles.success} role="status">
                        <p className={styles.successTitle}>{successTitle}</p>
                        <p className={styles.successText}>{successText}</p>
                    </div>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.fields}>
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
                            <button
                                type="submit"
                                className={styles.submit}
                                disabled={!phone.trim()}
                            >
                                {submitLabel}
                            </button>
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
                    </form>
                )}
            </Container>
        </section>
    );
}

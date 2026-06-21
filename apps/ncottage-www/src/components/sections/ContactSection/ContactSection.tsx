"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ContactSectionContent } from "@/content/home";
import styles from "./ContactSection.module.css";

interface ContactSectionProps {
    eyebrow: ContactSectionContent["eyebrow"];
    title: ContactSectionContent["title"];
    titleAccent?: ContactSectionContent["titleAccent"];
    lead: ContactSectionContent["lead"];
    addresses: ContactSectionContent["addresses"];
    phones: ContactSectionContent["phones"];
    email: ContactSectionContent["email"];
    hours: ContactSectionContent["hours"];
    form: ContactSectionContent["form"];
}

export function ContactSection({
    eyebrow,
    title,
    titleAccent,
    lead,
    addresses,
    phones,
    email,
    hours,
    form,
}: ContactSectionProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!phone.trim()) return;
        console.log("Contact submit:", { name, phone, message });
        setSubmitted(true);
    }

    return (
        <section className={styles.section}>
            <Container>
                <SectionHeading
                    eyebrow={eyebrow}
                    title={title}
                    titleAccent={titleAccent}
                    lead={lead}
                    align="center"
                    className={styles.head}
                />

                <div className={styles.grid}>
                    <div className={styles.formCol}>
                        {submitted ? (
                            <div className={styles.success} role="status">
                                <h3 className={styles.successTitle}>
                                    {form.successTitle}
                                </h3>
                                <p className={styles.successText}>
                                    {form.successText}
                                </p>
                            </div>
                        ) : (
                            <form
                                className={styles.form}
                                onSubmit={handleSubmit}
                                noValidate
                            >
                                <h3 className={styles.formTitle}>
                                    {form.title}
                                </h3>
                                <input
                                    className={styles.input}
                                    type="text"
                                    name="name"
                                    autoComplete="name"
                                    placeholder={form.namePlaceholder}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    className={styles.input}
                                    type="tel"
                                    name="phone"
                                    autoComplete="tel"
                                    placeholder={form.phonePlaceholder}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                                <textarea
                                    className={styles.textarea}
                                    name="message"
                                    rows={3}
                                    placeholder={form.messagePlaceholder}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button type="submit" className={styles.submit}>
                                    {form.submitLabel}
                                </button>
                                <p className={styles.privacy}>
                                    {form.privacy.text}{" "}
                                    <a
                                        className={styles.privacyLink}
                                        href={form.privacy.linkHref}
                                    >
                                        {form.privacy.linkLabel}
                                    </a>
                                </p>
                            </form>
                        )}
                    </div>

                    <div className={styles.contactsCol}>
                        <div className={styles.contactsBlock}>
                            <span className={styles.contactsLabel}>
                                Телефоны
                            </span>
                            <ul className={styles.contactsList}>
                                {phones.map((p) => (
                                    <li key={p.number}>
                                        <a
                                            href={`tel:${p.number}`}
                                            className={styles.contactsLink}
                                        >
                                            {p.display}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.contactsBlock}>
                            <span className={styles.contactsLabel}>Почта</span>
                            <a
                                href={`mailto:${email}`}
                                className={styles.contactsLink}
                            >
                                {email}
                            </a>
                        </div>
                        <div className={styles.contactsBlock}>
                            <span className={styles.contactsLabel}>График</span>
                            <span className={styles.contactsValue}>
                                {hours}
                            </span>
                        </div>
                        <div className={styles.contactsBlock}>
                            <span className={styles.contactsLabel}>Адреса</span>
                            <ul className={styles.addresses}>
                                {addresses.map((a) => (
                                    <li key={a} className={styles.addressItem}>
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

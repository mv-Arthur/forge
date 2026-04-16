"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import styles from "./ContactForm.module.css";

export function ContactForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) return;
        console.log("Contact form:", { name, phone });
        setSubmitted(true);
    }

    return (
        <section className={styles.section}>
            <Container>
                <div className={styles.inner}>
                    <div className={styles.info}>
                        <SectionHeading
                            align="left"
                            label="Обратная связь"
                            title="Оставьте заявку"
                            description="Мы свяжемся с вами в течение 30 минут в рабочее время и ответим на все вопросы."
                        />
                        <ul className={styles.benefits}>
                            <li>Бесплатная консультация</li>
                            <li>Расчёт стоимости за 24 часа</li>
                            <li>Выезд на участок</li>
                        </ul>
                    </div>
                    <div className={styles.formWrapper}>
                        {submitted ? (
                            <div className={styles.success}>
                                <p className={styles.successTitle}>
                                    Заявка отправлена
                                </p>
                                <p className={styles.successText}>
                                    Мы свяжемся с вами в ближайшее время.
                                </p>
                            </div>
                        ) : (
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
                                    Отправить заявку
                                </Button>
                                <p className={styles.privacy}>
                                    Нажимая кнопку, вы соглашаетесь с{" "}
                                    <a href="/privacy">
                                        политикой обработки персональных данных
                                    </a>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}

"use client";

import { useEffect, useState, type FormEvent } from "react";
import { formatPrice } from "@/lib/utils";
import { useLeadForm } from "@/lib/useLeadForm";
import { useProjectConfig } from "./ProjectConfigContext";
import styles from "./ProjectLeadForm.module.css";

interface ProjectLeadFormProps {
    projectName: string;
    projectPrice: number;
}

export function ProjectLeadForm({
    projectName,
    projectPrice,
}: ProjectLeadFormProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [comment, setComment] = useState("");
    const { submit, error, isSubmitting, isSuccess } = useLeadForm();
    const { summary } = useProjectConfig();

    useEffect(() => {
        if (summary) setComment(summary);
    }, [summary]);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!phone.trim() || isSubmitting) return;
        void submit({
            source: "project",
            project: projectName,
            name: name.trim() || undefined,
            phone: phone.trim(),
            comment: comment.trim() || undefined,
        });
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.left}>
                <p className={styles.eyebrow}>Получить расчёт</p>
                <h2 className={styles.title}>
                    Менеджер свяжется в&nbsp;течение часа
                </h2>
                <p className={styles.lead}>
                    Расскажем, что входит в&nbsp;каждую комплектацию, посчитаем
                    стоимость с&nbsp;выбранными опциями и&nbsp;ответим
                    на&nbsp;вопросы по&nbsp;проекту&nbsp;«{projectName}».
                </p>
                <ul className={styles.bullets}>
                    <li>Без обязательств — это бесплатная консультация</li>
                    <li>
                        Подберём комплектацию под бюджет от{" "}
                        {formatPrice(projectPrice)}
                    </li>
                    <li>Подскажем по ипотеке и&nbsp;рассрочке</li>
                </ul>
            </div>

            {isSuccess ? (
                <div className={styles.success}>
                    <p className={styles.successTitle}>Заявка отправлена</p>
                    <p className={styles.successText}>
                        Спасибо! Мы свяжемся с&nbsp;вами в&nbsp;ближайшее время.
                    </p>
                </div>
            ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.field}>
                        <span className={styles.label}>Имя</span>
                        <input
                            type="text"
                            name="name"
                            autoComplete="name"
                            className={styles.input}
                            placeholder="Как к вам обращаться"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <label className={styles.field}>
                        <span className={styles.label}>Телефон</span>
                        <input
                            type="tel"
                            name="phone"
                            required
                            autoComplete="tel"
                            className={styles.input}
                            placeholder="+7 (___) ___-__-__"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </label>
                    <label className={styles.field}>
                        <span className={styles.label}>
                            Комментарий{" "}
                            <span className={styles.optional}>
                                — необязательно
                            </span>
                        </span>
                        <textarea
                            name="comment"
                            rows={3}
                            className={styles.textarea}
                            placeholder="Например, интересует комплектация «Стандарт» с гаражом"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </label>
                    <p className={styles.contextLine}>
                        Заявка по проекту:{" "}
                        <strong className={styles.contextProject}>
                            {projectName}
                        </strong>
                    </p>
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
                        {isSubmitting ? "Отправляем…" : "Отправить заявку"}
                    </button>
                    <p className={styles.policy}>
                        Нажимая кнопку, вы соглашаетесь с&nbsp;политикой
                        обработки персональных данных.
                    </p>
                </form>
            )}
        </div>
    );
}

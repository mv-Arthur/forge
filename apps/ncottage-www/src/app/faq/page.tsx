"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import styles from "./page.module.css";

const FAQ_ITEMS = [
    {
        q: "Сколько стоит строительство дома?",
        a: "Стоимость зависит от площади, технологии и комплектации. Каркасный дом — от 2,4 млн ₽, из газобетона — от 4 млн ₽, кирпичный — от 7 млн ₽. Точный расчёт — после выбора проекта.",
    },
    {
        q: "Какие сроки строительства?",
        a: "Каркасный дом — 2-3 месяца, из газобетона — 4-6 месяцев, кирпичный — 6-10 месяцев. Сроки фиксируются в договоре.",
    },
    {
        q: "Можно ли изменить готовый проект?",
        a: "Да, любой проект из каталога можно адаптировать: изменить планировку, материалы, добавить или убрать элементы.",
    },
    {
        q: "Какая гарантия на построенный дом?",
        a: "Мы даём гарантию 5 лет на все виды работ. В течение гарантийного срока устраняем любые дефекты бесплатно.",
    },
    {
        q: "Как происходит оплата?",
        a: "Поэтапная оплата по мере выполнения работ. Принимаем наличные, банковский перевод, работаем с ипотекой и материнским капиталом.",
    },
    {
        q: "Работаете ли вы в зимний период?",
        a: "Да, строим круглый год. Зимой соблюдаем специальные технологии для бетонных работ и кладки.",
    },
    {
        q: "Где вы строите?",
        a: "Основные регионы — Санкт-Петербург, Ленинградская область, Новгородская область. Также работаем в Москве и МО.",
    },
    {
        q: "Можно ли посмотреть строящиеся объекты?",
        a: "Да, мы организуем экскурсии по строящимся и построенным объектам. Оставьте заявку, и мы подберём удобную дату.",
    },
];

export default function FaqPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className={styles.page}>
            <Container>
                <SectionHeading
                    label="FAQ"
                    title="Часто задаваемые вопросы"
                />
                <div className={styles.list}>
                    {FAQ_ITEMS.map((item, i) => (
                        <div
                            key={i}
                            className={`${styles.item} ${openIndex === i ? styles.itemOpen : ""}`}
                        >
                            <button
                                className={styles.question}
                                onClick={() =>
                                    setOpenIndex(
                                        openIndex === i ? null : i
                                    )
                                }
                            >
                                <span>{item.q}</span>
                                <span className={styles.chevron}>
                                    {openIndex === i ? "−" : "+"}
                                </span>
                            </button>
                            {openIndex === i && (
                                <div className={styles.answer}>
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
